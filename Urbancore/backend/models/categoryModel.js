import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category_image: { type: String, required: true },
  category_name: { type: String, required: true },
});

// check if model already exists, else create it
const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;