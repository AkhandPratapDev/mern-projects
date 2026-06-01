import express from "express";
import authMiddleware from "../milddleware/auth.js";
import { placeOrder, userOrders, verifyOrder,listOrders,upadateStatus} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware,userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", upadateStatus);



export default orderRouter;
