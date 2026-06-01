import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
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
  addProduct
);

// List Products
productRouter.get("/list", listProduct);

// Remove Product
productRouter.post("/remove", removeProduct);

// Get single product by ID
productRouter.get("/:id", getProductById);

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
  updateProduct
);

export default productRouter;
