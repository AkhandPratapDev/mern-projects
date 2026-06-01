import userModel from "../models/userModel.js";

// -------------------- Add Item --------------------
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, color, size, quantity, source } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "userId missing" });
    if (!itemId)
      return res
        .status(400)
        .json({ success: false, message: "itemId missing" });

    const userData = await userModel.findById(userId);
    if (!userData)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    const key = `${itemId}_${color || "none"}_${size || "none"}`;

    // If item already exists, just increase quantity
    if (cartData[key]) {
      if (typeof cartData[key] === "number") {
        // 🔙 old data structure → migrate to new
        cartData[key] = {
          quantity: cartData[key],
          source: source || "product",
        };
      }
      cartData[key].quantity += quantity || 1;
    } else {
      cartData[key] = {
        quantity: quantity || 1,
        source: source || "product", // ✅ store source
      };
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Added To Cart", cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// -------------------- Remove One --------------------
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId, color, size } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    const key = `${itemId}_${color || "none"}_${size || "none"}`;

    if (cartData[key]) {
      if (typeof cartData[key] === "number") {
        // 🔙 old structure
        cartData[key] -= 1;
        if (cartData[key] <= 0) delete cartData[key];
      } else {
        cartData[key].quantity -= 1;
        if (cartData[key].quantity <= 0) delete cartData[key];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed From Cart", cartData });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// -------------------- Get Cart --------------------
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    // Convert cartData object to array of items
    const cartArray = Object.keys(cartData).map((key) => {
      const [itemId, color, size] = key.split("_");
      const value = cartData[key];

      // Handle both old (number) and new ({ quantity, source }) structures
      if (typeof value === "number") {
        return {
          id: itemId,
          color: color === "none" ? null : color,
          size: size === "none" ? null : size,
          quantity: value,
          source: "product", // default fallback
        };
      } else {
        return {
          id: itemId,
          color: color === "none" ? null : color,
          size: size === "none" ? null : size,
          quantity: value.quantity,
          source: value.source || "product",
        };
      }
    });

    res.json({ success: true, cart: cartArray });
  } catch (error) {
    res.json({ success: false, message: "Error fetching cart" });
  }
};

// -------------------- Delete Item Completely --------------------
const deleteFromCart = async (req, res) => {
  try {
    const { userId, itemId, color, size } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "UserId missing" });
    if (!itemId)
      return res
        .status(400)
        .json({ success: false, message: "ItemId missing" });

    const userData = await userModel.findById(userId);
    if (!userData)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    const key = `${itemId}_${color || "none"}_${size || "none"}`;

    if (cartData[key]) {
      delete cartData[key];
      await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
      return res.json({
        success: true,
        message: "Item deleted from cart",
        cartData,
      });
    }

    return res.json({ success: false, message: "Item not in cart" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error deleting item" });
  }
};

export { addToCart, removeFromCart, getCart, deleteFromCart };
