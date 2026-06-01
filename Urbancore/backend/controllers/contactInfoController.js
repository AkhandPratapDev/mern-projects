import ContactInfo from "../models/contactInfoModel.js";

// ✅ Get contact info
export const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    if (!contactInfo) return res.status(404).json({ message: "No contact info found" });
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create new contact info (only once — for setup)
export const createContactInfo = async (req, res) => {
  try {
    const existing = await ContactInfo.findOne();
    if (existing) return res.status(400).json({ message: "Contact info already exists. Use update instead." });

    const { email, phone, socialLinks } = req.body;
    const contactInfo = new ContactInfo({ email, phone, socialLinks });
    const saved = await contactInfo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update contact info (for admin panel)
export const updateContactInfo = async (req, res) => {
  try {
    const { email, phone, socialLinks } = req.body;

    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      contactInfo = new ContactInfo({ email, phone, socialLinks });
    } else {
      contactInfo.email = email || contactInfo.email;
      contactInfo.phone = phone || contactInfo.phone;
      contactInfo.socialLinks = { ...contactInfo.socialLinks, ...socialLinks };
    }

    const updated = await contactInfo.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
