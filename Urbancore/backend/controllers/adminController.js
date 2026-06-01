// SUPER ADMIN
import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ======================================================
   🟢 Login Admin (auto-create first Super Admin)
====================================================== */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const adminCount = await Admin.countDocuments();

    // 🟢 No admin exists → create the first one as Super Admin
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        email: email.toLowerCase(),
        password: hashedPassword,
        isSuperAdmin: true,
      });
      await newAdmin.save();

      const token = jwt.sign(
        {
          id: newAdmin._id,
          email: newAdmin.email,
          isSuperAdmin: newAdmin.isSuperAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "First Super Admin created successfully",
        token,
      });
    }

    // 🟡 Normal login
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        isSuperAdmin: admin.isSuperAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   🔑 Change Password
====================================================== */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.adminId);

    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Old password incorrect" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   👥 Add Admin (only Super Admin)
====================================================== */
export const addAdmin = async (req, res) => {
  try {
    if (!req.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can add new admins",
      });
    }

    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const existing = await Admin.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.json({
      success: true,
      message: "Admin added successfully",
      admin: { id: newAdmin._id, email: newAdmin.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   ❌ Remove Admin (only Super Admin)
====================================================== */
export const removeAdmin = async (req, res) => {
  try {
    if (!req.isSuperAdmin)
      return res
        .status(403)
        .json({
          success: false,
          message: "Only Super Admin can remove admins",
        });

    const { id } = req.params;
    const adminToDelete = await Admin.findById(id);

    if (!adminToDelete)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    if (adminToDelete.isSuperAdmin)
      return res.status(400).json({
        success: false,
        message: "Cannot delete the Super Admin account",
      });

    await Admin.findByIdAndDelete(id);
    res.json({ success: true, message: "Admin removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   📋 List All Admins
====================================================== */
export const listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password");
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
