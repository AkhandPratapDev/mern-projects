import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Review.css";
import { StoreContext } from "../../context/StoreContext";

const Review = () => {
  // ==================== State ====================
  const [rating, setRating] = useState(2); // default 2 stars
  const [showPopup, setShowPopup] = useState(false); // popup on rating submit

  const { url } = useContext(StoreContext);

  // ==================== Fetch latest rating on mount ====================
  useEffect(() => {
    axios.get(`${url}/api/review/latest`).then((res) => {
      if (res.data.success && res.data.rating) {
        setRating(res.data.rating);
      }
    });
  }, []);

  // ==================== Handle star click ====================
  const handleClick = (value) => {
    setRating(value); // update local rating

    // post rating to backend
    axios.post(`${url}/api/review`, { rating: value }).then((res) => {
      if (res.data.success) {
        setShowPopup(true); // show success popup
        setTimeout(() => setShowPopup(false), 3000); // auto hide after 3s
      }
    });
  };

  // ==================== JSX Render ====================
  return (
    <div className="review" id="review">
      <div className="review-card rate-us">
        {/* Card Title */}
        <h3>Rate Us</h3>

        {/* ==================== Star Rating UI ==================== */}
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "filled" : ""}
              onClick={() => handleClick(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Instruction Text */}
        <p>
          We value your feedback! Please take a moment to rate us and share your
          thoughts — it helps us improve and serve you better every time.
        </p>

        {/* ==================== Popup Message ==================== */}
        {showPopup && <div className="popup">Thanks for rating us! 🎉</div>}
      </div>
    </div>
  );
};

export default Review;
