import express from "express";
import {
  loginAdmin,
  changePassword,
  addAdmin,
  removeAdmin,
  listAdmins,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import Admin from "../models/adminModel.js";

const router = express.Router();

// Login (auto-create first Super Admin if none exists)
router.post("/login", loginAdmin);

// Change password (protected)
router.post("/change-password", adminAuth, changePassword);

// Add admin (only Super Admin)
router.post("/add", adminAuth, addAdmin);

// Remove admin (only Super Admin)
router.delete("/remove/:id", adminAuth, removeAdmin);

// List admins
router.get("/list", adminAuth, listAdmins);

// Example dashboard route
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    res.json({
      success: true,
      message: "Welcome to Admin Dashboard",
      admin: admin.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get current admin info
router.get("/me", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId, "-password");
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
