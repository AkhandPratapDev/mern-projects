import express from "express";
import cors from "cors";
import 'dotenv/config';
import cron from "node-cron";
import fetch from "node-fetch";

import { connectDB } from "./config/db.js";

// Routes
import productRouter from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import offerRouter from "./routes/offerRoute.js";
import homepageRouter from "./routes/homepageRoute.js";
import lastproductRouter from "./routes/lastproductRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRoutes from "./routes/contactRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import adminRouter from "./routes/adminRoute.js";
import policiesRoutes from "./routes/policiesRoutes.js";
import contactInfoRoutes from "./routes/contactInfoRoute.js";


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// API Routes
app.use("/api/category", categoryRoute);
app.use("/api/product", productRouter);
app.use("/api/offerProduct", offerRouter);
app.use("/api/homepage", homepageRouter);
app.use("/api/lastProduct", lastproductRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRoutes);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/policies", policiesRoutes);
app.use("/api/contactinfo", contactInfoRoutes);


// Serve static images
app.use("/images", express.static("uploads"));

// Default route
app.get("/", (req, res) => {
  res.send("API Working");
});


// Cron Job: Auto-delete Delivered Orders older than 28 days
cron.schedule("0 2 * * *", async () => {
  try {
    await fetch("http://localhost:4000/api/order/cleanup/old-delivered", { method: "DELETE" });
  } catch (err) {
  }
});



app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

