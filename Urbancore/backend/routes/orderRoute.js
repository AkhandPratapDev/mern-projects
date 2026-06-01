import express from "express";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrder,
  cleanupOldDeliveredOrders,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Place order (auth required)
orderRouter.post("/place", authMiddleware, placeOrder);

// Verify order (Stripe redirect, no auth)
orderRouter.post("/verify", verifyOrder);

// Get user orders (auth required)
orderRouter.post("/userorders", authMiddleware, userOrders);

// Admin: list all orders
orderRouter.get("/list", listOrders);

// Update order status
orderRouter.post("/status", updateStatus);

// Delete a single order
orderRouter.delete("/:id", deleteOrder);

// Cleanup old delivered orders
orderRouter.delete("/cleanup/old-delivered", cleanupOldDeliveredOrders);

export default orderRouter;
