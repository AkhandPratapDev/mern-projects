import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  discount: { type: Number },
  regular_price: { type: Number },
  product_detail: { type: String, required: true },
  product_image_1: { type: String },
  product_image_2: { type: String },
  product_image_3: { type: String },
  product_image_4: { type: String },
  sizes: { type: Array, required: true },
  color: { type: String, required: true },
  expected_delivery: { type: Array, required: true },
  search_keyword: { type: Array, required: true },
  quantities: { type: Map, of: Number, default: {} },
});

const offerModel =
  mongoose.models.offer || mongoose.model("offer", offerSchema);

export default offerModel;
