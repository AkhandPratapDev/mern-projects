import express from "express";
import {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
} from "../controllers/contactInfoController.js";

const router = express.Router();

router.get("/", getContactInfo);
router.post("/", createContactInfo);
router.put("/", updateContactInfo); // For admin panel updates

export default router;
