import express from "express";
import {
  addLastProduct,
  listLastProduct,
  getLastProductById,
  updateLastProduct,
} from "../controllers/lastproductController.js";
import multer from "multer";

const productRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Add Product
productRouter.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "product_image_1", maxCount: 1 },
    { name: "product_image_2", maxCount: 1 },
    { name: "product_image_3", maxCount: 1 },
    { name: "product_image_4", maxCount: 1 },
  ]),
  addLastProduct
);

// List Products
productRouter.get("/list", listLastProduct);

// Get single product by ID
productRouter.get("/:id", getLastProductById);

// ✅ Update Product by ID (PUT request)
productRouter.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "product_image_1", maxCount: 1 },
    { name: "product_image_2", maxCount: 1 },
    { name: "product_image_3", maxCount: 1 },
    { name: "product_image_4", maxCount: 1 },
  ]),
  updateLastProduct
);

export default productRouter;
