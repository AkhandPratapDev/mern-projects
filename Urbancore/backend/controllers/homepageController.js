import homepageModel from "../models/homepageModel.js";
import fs from "fs";
import path from "path";

// GET HOMEPAGE ASSETS
export const getHomepageAssets = async (req, res) => {
  try {
    let assets = await homepageModel.findOne();
    if (!assets) {
      // Create default record
      assets = new homepageModel({
        header_img_1: "default-header1.jpg",
        header_img_2: "default-header2.jpg",
        header_img_3: "default-header3.jpg",
        homepage_poster: "default-homeposter.jpg",
        offers_poster: "default-offers.jpg",
        last_product_display_poster: "default-lastposter.jpg",
      });
      await assets.save();
    }
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assets" });
  }
};

// UPDATE HOMEPAGE ASSET
export const updateHomepageAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const key = req.body.key;

    let assets = await homepageModel.findById(id);
    if (!assets)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.files && req.files[key] && req.files[key][0]) {
      const file = req.files[key][0];

      // Delete old file if exists
      if (assets[key]) {
        const filePath = path.join(process.cwd(), "uploads", assets[key]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      assets[key] = file.filename;
      await assets.save();
    }

    res.json({ success: true, message: "Homepage updated", data: assets });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating homepage" });
  }
};
