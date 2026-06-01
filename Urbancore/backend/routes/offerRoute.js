import express from "express";
import {
  addOfferProduct,
  listOfferProduct,
  removeOfferProduct,
  getOfferProductById,
  updateOfferProduct,
} from "../controllers/offerController.js";
import multer from "multer";

const offerRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Add Product
offerRouter.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "product_image_1", maxCount: 1 },
    { name: "product_image_2", maxCount: 1 },
    { name: "product_image_3", maxCount: 1 },
    { name: "product_image_4", maxCount: 1 },
  ]),
  addOfferProduct
);

// List Products
offerRouter.get("/list", listOfferProduct);

// Remove Product
offerRouter.post("/remove", removeOfferProduct);

// Get single product by ID
offerRouter.get("/:id", getOfferProductById);

// ✅ Update Product by ID (PUT request)
offerRouter.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "product_image_1", maxCount: 1 },
    { name: "product_image_2", maxCount: 1 },
    { name: "product_image_3", maxCount: 1 },
    { name: "product_image_4", maxCount: 1 },
  ]),
  updateOfferProduct
);

export default offerRouter;
