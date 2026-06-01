import express from "express";
import multer from "multer";
import { getHomepageAssets, updateHomepageAsset } from "../controllers/homepageController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET assets
router.get("/assets", getHomepageAssets);

// UPDATE asset
router.put(
  "/update/:id",
  upload.fields([
    { name: "header_img_1", maxCount: 1 },
    { name: "header_img_2", maxCount: 1 },
    { name: "header_img_3", maxCount: 1 },
    { name: "homepage_poster", maxCount: 1 },
    { name: "offers_poster", maxCount: 1 },
    { name: "last_product_display_poster", maxCount: 1 },
  ]),
  updateHomepageAsset
);

export default router;
