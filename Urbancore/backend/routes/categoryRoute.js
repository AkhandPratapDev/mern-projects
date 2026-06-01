import express from "express";
import {
  addCategory,
  removeCategory,
  listCategory,
} from "../controllers/categoryController.js";
import multer from "multer";
import path from "path";

const categoryRoute = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789.jpg
  },
});

const upload = multer({ storage });

// Add Category (with image upload)
categoryRoute.post("/add", upload.single("category_image"), addCategory);

// List Category
categoryRoute.get("/list", listCategory);

// Remove Category
categoryRoute.post("/remove/:id", removeCategory); // send category ID in URL

export default categoryRoute;
