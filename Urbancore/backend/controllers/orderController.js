import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // ✅ add this
import lastproductModel from "../models/lastproductModel.js"; // ✅ added
import offerModel from "../models/offerModel.js"; // ✅ added
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Frontend URL for redirects
const FRONTEND_URL = "http://localhost:5174";

// ================= Place Order & Create Stripe Session =================
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, payment } = req.body;

    // ✅ Step 1: Reduce product quantity before placing the order
    for (const item of items) {
      // Try all product collections
      let product =
        (await productModel.findById(item._id || item.id)) ||
        (await lastproductModel.findById(item._id || item.id)) ||
        (await offerModel.findById(item._id || item.id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${item._id || item.id}`,
        });
      }

      const size = item.size || "M"; // fallback
      const quantities =
        product.quantities instanceof Map
          ? Object.fromEntries(product.quantities)
          : product.quantities;

      // 🧩 Validate stock
      if (!quantities || quantities[size] === undefined) {
        return res.status(400).json({
          success: false,
          message: `No stock available for size ${size} of "${product.name}".`,
        });
      }

      if (quantities[size] < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for size ${size} of "${product.name}". Only ${quantities[size]} left.`,
        });
      }

      // ✅ Reduce quantity
      quantities[size] -= item.quantity;

      // Convert back to Map (Mongo expects Map type)
      product.quantities = new Map(Object.entries(quantities));
      await product.save();
    }

    // ✅ Step 2: Create order document
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      paymentMethod: payment === "cod" ? "cod" : "stripe",
    });

    await newOrder.save();

    // ✅ Step 3: Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Step 4: COD handling
    if (payment === "cod") {
      return res.json({
        success: true,
        message: "COD order placed successfully",
        orderId: newOrder._id,
      });
    }

    // ✅ Step 5: Stripe handling
    if (payment === "paynow") {
      const line_items = items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charges" },
          unit_amount: 200,
        },
        quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      });

      return res.json({
        success: true,
        session_url: session.url,
      });
    }

    // ❌ Invalid payment method
    return res.json({ success: false, message: "Invalid payment method" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};
// ================= Verify Payment =================
const verifyOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    res.json({ success: false, message: "Error verifying order" });
  }
};

// ================= User Orders =================
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ================= Admin: List All Orders =================
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error listing orders" });
  }
};

// ================= Update Order Status =================
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: "Error updating status" });
  }
};

// ================= Delete a Single Order =================
const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

// ================= Auto-cleanup Delivered Orders =================
const cleanupOldDeliveredOrders = async (req, res) => {
  try {
    // Read from query or body (default 28 days)
    const { period = "28d" } = req.query;

    // Handle "never" (no deletion)
    if (period === "never") {
      return res.json({
        success: true,
        message: "Cleanup skipped — set to 'Never'.",
      });
    }

    // Convert period to milliseconds
    let days = 28;
    if (period === "7d") days = 7;
    else if (period === "1y") days = 365;

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await orderModel.deleteMany({
      status: "Delivered",
      date: { $lte: cutoffDate },
    });

    res.json({
      success: true,
      message: `${result.deletedCount} delivered orders older than ${days} days deleted.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error cleaning up orders" });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrder,
  cleanupOldDeliveredOrders,
};
