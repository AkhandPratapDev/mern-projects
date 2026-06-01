import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String, required: true },
  seen: { type: Boolean, default: false }, // ✅ new field
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
