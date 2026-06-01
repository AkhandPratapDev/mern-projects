import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  socialLinks: {
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
});

const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);
export default ContactInfo;
