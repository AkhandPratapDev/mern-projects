import express from "express";
import { addReview, getLatestReview, getAverageRating,getTotalRatings } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);         // Save rating
reviewRouter.get("/latest", getLatestReview); // Get last rating
reviewRouter.get("/average", getAverageRating); // Get average rating
reviewRouter.get("/total", getTotalRatings); // new route

export default reviewRouter;
