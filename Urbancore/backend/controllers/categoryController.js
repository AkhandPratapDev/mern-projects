import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import path from "path";

// ✅ List all categories
const listCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
};

// ✅ Add a new category
const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const category_image = req.file.filename; // multer gives us this

    const newCategory = new categoryModel({
      category_name,
      category_image,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: err.message,
    });
  }
};

// ✅ Remove a category by ID
const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete image from server if exists
    const imagePath = path.join(
      process.cwd(),
      "uploads",
      category.category_image
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await categoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: err.message,
    });
  }
};

export { listCategory, addCategory, removeCategory };
