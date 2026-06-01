import reviewModel from "../models/reviewModel.js";
import jwt from "jsonwebtoken";

// Save a new review
const addReview = async (req, res) => {
  try {
    const { rating } = req.body;

    // If logged-in user is rating
    let userId = null;
    if (req.headers.token) {
      try {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        return res.json({ success: false, message: "Invalid token" });
      }
    }

    const review = new reviewModel({ rating, user: userId });
    await review.save();

    res.json({ success: true, message: "Review saved successfully", review });
  } catch (err) {
    res.json({ success: false, message: "Error saving review" });
  }
};

// Get latest review
const getLatestReview = async (req, res) => {
  try {
    const review = await reviewModel.findOne().sort({ createdAt: -1 });
    res.json({ success: true, rating: review ? review.rating : null });
  } catch (err) {
    res.json({ success: false, message: "Error fetching review" });
  }
};

// Get average rating

const getAverageRating = async (req, res) => {
  try {
    const result = await reviewModel.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const avg =
      result.length > 0 ? parseFloat(result[0].avgRating.toFixed(1)) : null;

    res.json({ success: true, averageRating: avg });
  } catch (err) {
    res.json({ success: false, message: "Error fetching average rating" });
  }
};

// Get total number of ratings
const getTotalRatings = async (req, res) => {
  try {
    const count = await reviewModel.countDocuments();
    res.json({ success: true, totalRatings: count });
  } catch (err) {
    res.json({ success: false, message: "Error counting ratings" });
  }
};

export { addReview, getLatestReview, getAverageRating, getTotalRatings };
