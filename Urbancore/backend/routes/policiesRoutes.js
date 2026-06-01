import express from "express";
import { getPolicies, updatePolicies } from "../controllers/policiesController.js";

const router = express.Router();

router.get("/", getPolicies);
router.put("/", updatePolicies);

export default router;
