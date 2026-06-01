import mongoose from "mongoose";

const policiesSchema = new mongoose.Schema(
  {
    shipping_policy: { type: String },
    returns_policy: { type: String },
    privacy_policy: { type: String },
  },
  { timestamps: true }
);

const policiesModel =
  mongoose.models.policies || mongoose.model("policies", policiesSchema);

export default policiesModel;
