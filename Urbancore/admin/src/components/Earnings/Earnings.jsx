import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import UserCard from "../UserCard/UserCard";
import "./Earnings.css";
import { StoreContext } from "../../context/StoreContext";

/* ==================== Earnings Component ==================== */
const Earnings = ({
  statusPercentages = [],
  latestUsers = [],
  avgRating = null,
  totalRatings = 0,
}) => {
  const navigate = useNavigate();
  const { orderList, fetchOrders } = useContext(StoreContext);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderList.length > 0) {
      //  Filter paid (Stripe) orders only
      const paidOrders = orderList.filter(
        (order) => order.paymentMethod === "stripe"
      );

      //  Sum up total amount
      const total = paidOrders.reduce((sum, order) => sum + order.amount, 0);
      setTotalEarnings(total);
    }
  }, [orderList]);

  //  Format total with commas
  const formattedTotal = totalEarnings.toLocaleString("en-IN");

  return (
    <div className="earnings-container">
      <div className="earnings-content">
        {/* ==================== Earnings This Month ==================== */}
        <div className="card earning-card">
          <div className="card-header">
            <h4>Earnings This Month</h4>
          </div>
          <img
            src={assets.total_income_icon}
            alt="Bank Card"
            className="earning-image"
          />
          <p className="earning-amount">₹{formattedTotal}</p>
        </div>

        {/* ==================== Recent Activity ==================== */}
        <div className="card activity-card">
          <div className="card-header">
            <h4>Recent Activity</h4>
          </div>
          {statusPercentages.length === 0 ? (
            <p className="no-data">No activity yet.</p>
          ) : (
            statusPercentages.map((item) => (
              <div key={item.status} className="activity-item">
                <div className="activity-header">
                  <span>{item.status}</span>
                  <span className="activity-item-percentage-value">
                    {item.percentage}%
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ==================== Latest Users ==================== */}
        <div className="card users-card">
          <div className="card-header">
            <h4>New Users</h4>
            <img
              src={assets.rigth_arrow_icon}
              alt="See all users"
              className="arrow-icon"
              onClick={() => navigate("/users")}
            />
          </div>
          {latestUsers.length === 0 ? (
            <p className="no-data">No new users.</p>
          ) : (
            latestUsers.map((user) => (
              <UserCard
                key={user._id}
                id={user._id}
                name={user.name}
                email={user.email}
              />
            ))
          )}
        </div>

        {/* ==================== Website Rating ==================== */}
        <div className="card rating-card">
          <div className="card-header">
            <h4>Website Rating</h4>
          </div>
          {avgRating ? (
            <>
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  let starClass = "star";

                  if (avgRating >= starValue) {
                    starClass += " filled";
                  } else if (avgRating >= starValue - 0.5) {
                    starClass += " half";
                  }

                  return (
                    <span key={index} className={starClass}>
                      ★
                    </span>
                  );
                })}
              </div>
              <p className="rating-text">
                {avgRating.toFixed(1)} / 5 ({totalRatings} ratings)
              </p>
            </>
          ) : (
            <p className="rating-text">No ratings yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
