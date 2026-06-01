import express from "express";
import { addContactMessage, getAllMessages,getUnseenCount,deleteMessage,markAsRead } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/", addContactMessage); // anyone can send
contactRouter.get("/", getAllMessages);     // admin panel will handle security if needed

contactRouter.delete("/:id", deleteMessage);
contactRouter.get("/unseen-count", getUnseenCount);

// routes/contactRoute.js
contactRouter.put("/mark-read/:id", markAsRead);

export default contactRouter;
