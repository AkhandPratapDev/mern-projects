import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const verificationModel =
  mongoose.models.verification || mongoose.model("verification", verificationSchema);

export default verificationModel;
