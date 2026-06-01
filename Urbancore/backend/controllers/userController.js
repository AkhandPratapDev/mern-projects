import userModel from "../models/userModel.js";
import verificationModel from "../models/verificationModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { sendVerificationEmail } from "../config/nodemailer.js";

/* ============================================================
   Helper: Create JWT Token
============================================================ */
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

/* ============================================================
   REGISTER USER (Step 1: Send OTP)
============================================================ */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store/Update OTP record
    await verificationModel.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true }
    );

    // Send OTP to user's email
    await sendVerificationEmail(email, otp);

    res.json({
      success: true,
      message: "Verification code sent to your email. Please verify.",
      tempUser: { name, email, password },
    });
  } catch (error) {
    res.json({ success: false, message: "Error sending verification email" });
  }
};

/* ============================================================
   VERIFY USER (Step 2: Confirm OTP & Create Account)
============================================================ */
const verifyUser = async (req, res) => {
  const { name, email, password, otp } = req.body;

  try {
    const record = await verificationModel.findOne({ email });
    if (!record)
      return res.json({ success: false, message: "OTP not found or expired." });

    if (record.expiresAt < Date.now()) {
      await verificationModel.deleteOne({ email });
      return res.json({
        success: false,
        message: "OTP expired. Please try again.",
      });
    }

    if (record.otp !== otp)
      return res.json({ success: false, message: "Invalid OTP." });

    // Hash password and create account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    await verificationModel.deleteOne({ email }); // remove OTP record after success

    const token = createToken(newUser._id);
    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: "Verification failed" });
  }
};

/* ============================================================
   LOGIN USER
============================================================ */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: "Error during login" });
  }
};

/* ============================================================
   LIST USERS (ADMIN)
============================================================ */
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password"); // exclude password
    res.json({ success: true, data: users });
  } catch (err) {
    res.json({ success: false, message: "Error fetching users" });
  }
};

/* ============================================================
   REMOVE USER (ADMIN)
============================================================ */
const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.json({ success: false, message: "Error deleting user" });
  }
};

/* ============================================================
   GET PROFILE
============================================================ */
const getProfile = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id, "-password");

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: "Error fetching profile" });
  }
};

/* ============================================================
   UPDATE PROFILE
============================================================ */
const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const token = req.headers.token;

  if (!token) return res.json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: "Error updating profile" });
  }
};

/* ============================================================
   ADD / UPDATE ADDRESS
============================================================ */
const addAddress = async (req, res) => {
  const { address } = req.body;
  const token = req.headers.token;

  if (!token) return res.json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.json({ success: false, message: "User not found" });

    user.address = address || user.address;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: "Error updating address" });
  }
};

/* ============================================================
   EXPORTS
============================================================ */
export {
  registerUser,
  verifyUser,
  loginUser,
  listUsers,
  removeUser,
  getProfile,
  updateProfile,
  addAddress,
};
