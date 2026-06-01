import Contact from "../models/contactModel.js";

// Add a new contact message (anyone can send)
export const addContactMessage = async (req, res) => {
  try {
    const { name, contact, email, reason } = req.body;

    const newMessage = new Contact({
      name,
      contact,
      email,
      reason,
    });

    await newMessage.save();
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages (admin only)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unseen messages count
export const getUnseenCount = async (req, res) => {
  try {
    const count = await Contact.countDocuments({ seen: false });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/contactController.js

// Mark a message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);
    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });

    message.seen = true;
    await message.save();

    res.json({ success: true, message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
