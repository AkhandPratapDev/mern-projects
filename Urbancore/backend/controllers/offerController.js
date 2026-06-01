import offerModel from "../models/offerModel.js";
import fs from "fs";
import path from "path";

// helper to safely parse array fields
const parseField = (field) => {
  if (!field) return [];
  try {
    return JSON.parse(field.trim()); // handles ["S","M","L"]
  } catch {
    return [field.trim()]; // fallback if plain string
  }
};

// --------ADD Offer Product ---------------
const addOfferProduct = async (req, res) => {
  try {

    const quantities = req.body.quantities
      ? JSON.parse(req.body.quantities)
      : {};

    const product = new offerModel({
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      price: Number(req.body.price),
      category: req.body.category?.trim(),
      discount: Number(req.body.discount),
      regular_price: Number(req.body.regular_price),
      product_detail: req.body.product_detail?.trim(),
      sizes: parseField(req.body.sizes),
      color: req.body.color?.trim(),
      expected_delivery: parseField(req.body.expected_delivery),
      search_keyword: parseField(req.body.search_keyword),
      // quantity: Number(req.body.quantity) || 0, // ✅ Added
      quantities: quantities, // ✅ Updated

      // main image
      image: req.files["image"] ? req.files["image"][0].filename : null,

      // extra images
      product_image_1: req.files["product_image_1"]
        ? req.files["product_image_1"][0].filename
        : null,
      product_image_2: req.files["product_image_2"]
        ? req.files["product_image_2"][0].filename
        : null,
      product_image_3: req.files["product_image_3"]
        ? req.files["product_image_3"][0].filename
        : null,
      product_image_4: req.files["product_image_4"]
        ? req.files["product_image_4"][0].filename
        : null,
    });

    await product.save();
    res.json({ success: true, message: "Product Added", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding product", error });
  }
};

// -------------------- LIST PRODUCTS --------------------
const listOfferProduct = async (req, res) => {
  try {
    const products = await offerModel.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// -------------------- GET PRODUCT BY ID --------------------
const getOfferProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await offerModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching product", error });
  }
};

// -------------------- REMOVE PRODUCT --------------------
const removeOfferProduct = async (req, res) => {
  try {
    const product = await offerModel.findById(req.body.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // collect all images
    const images = [
      product.image,
      product.product_image_1,
      product.product_image_2,
      product.product_image_3,
      product.product_image_4,
    ];

    // delete all files safely
    images.forEach((img) => {
      if (img) {
        const filePath = path.join(process.cwd(), "uploads", img);
        fs.unlink(filePath, (err) => {
          if (err) {
          } else {
          }
        });
      }
    });

    // delete from DB
    await offerModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing product" });
  }
};

const updateOfferProduct = async (req, res) => {
  try {
    const { id } = req.params; // ✅ get ID from URL
    const product = await offerModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update text fields
    product.name = req.body.name?.trim() ?? product.name;
    product.description = req.body.description?.trim() ?? product.description;
    product.product_detail =
      req.body.product_detail?.trim() ?? product.product_detail;
    product.price =
      req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.regular_price =
      req.body.regular_price !== undefined
        ? Number(req.body.regular_price)
        : product.regular_price;
    product.discount =
      req.body.discount !== undefined
        ? Number(req.body.discount)
        : product.discount;
    product.color = req.body.color?.trim() ?? product.color;
    product.category = req.body.category?.trim() ?? product.category;
    product.sizes = req.body.sizes ? JSON.parse(req.body.sizes) : product.sizes;
    product.expected_delivery = req.body.expected_delivery
      ? JSON.parse(req.body.expected_delivery)
      : product.expected_delivery;
    product.search_keyword = req.body.search_keyword
      ? JSON.parse(req.body.search_keyword)
      : product.search_keyword;

    // ✅ Update quantities per size
    if (req.body.quantities) {
      try {
        product.quantities = JSON.parse(req.body.quantities);
      } catch {
        product.quantities = {};
      }
    }

    // Update images if uploaded
    if (req.files) {
      if (req.files["image"]) product.image = req.files["image"][0].filename;
      if (req.files["product_image_1"])
        product.product_image_1 = req.files["product_image_1"][0].filename;
      if (req.files["product_image_2"])
        product.product_image_2 = req.files["product_image_2"][0].filename;
      if (req.files["product_image_3"])
        product.product_image_3 = req.files["product_image_3"][0].filename;
      if (req.files["product_image_4"])
        product.product_image_4 = req.files["product_image_4"][0].filename;
    }

    await product.save();

    res.json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// -------------------- EXPORTS --------------------
export {
  addOfferProduct,
  listOfferProduct,
  getOfferProductById,
  removeOfferProduct,
  updateOfferProduct,
};
