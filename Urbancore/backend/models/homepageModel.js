import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    header_img_1: { type: String },
    header_img_2: { type: String },
    header_img_3: { type: String },
    homepage_poster: { type: String },
    offers_poster: { type: String },
    last_product_display_poster: { type: String },
  },
  { timestamps: true }
);

const homepageModel =
  mongoose.models.homepage || mongoose.model("homepage", homepageSchema);

export default homepageModel;
