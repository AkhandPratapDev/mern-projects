import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import OrderItem from "../../components/OrdertItem/OrderItem";
import Transaction from "../../components/Transaction/Transaction";
import Earnings from "../../components/Earnings/Earnings";
import axios from "axios";

const Dashboard = () => {
  const { orderList, productList, userList, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // -------------------- Local State --------------------
  const [visibleCount, setVisibleCount] = useState(4); // Number of orders to show
  const [avgRating, setAvgRating] = useState(null); // Average product rating
  const [totalRatings, setTotalRatings] = useState(0); // Total reviews
  const [showEarnings, setShowEarnings] = useState(true); // Toggle Earnings component

  // -------------------- Fetch Ratings --------------------
  useEffect(() => {
    // Average rating
    axios
      .get(`${url}/api/review/average`)
      .then((res) => res.data.success && setAvgRating(res.data.averageRating))

    // Total ratings
    axios
      .get(`${url}/api/review/total`)
      .then((res) => res.data.success && setTotalRatings(res.data.totalRatings))
  }, [url]);

  // -------------------- Responsive Visible Orders --------------------
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 600) setVisibleCount(2);
      else if (window.innerWidth < 1183) setVisibleCount(3);
      else setVisibleCount(4);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // -------------------- Latest Orders --------------------
  const latestOrders = [...orderList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, visibleCount);

  // -------------------- Order Status Metrics --------------------
  const steps = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const statusCounts = steps.reduce((acc, step) => {
    acc[step] = orderList.filter((order) => order.status === step).length;
    return acc;
  }, {});
  const totalOrders = orderList.length;
  const statusPercentages = steps.map((step) => ({
    status: step,
    percentage:
      totalOrders > 0
        ? Math.round((statusCounts[step] / totalOrders) * 100)
        : 0,
  }));

  // -------------------- Latest Users --------------------
  const latestUsers = [...userList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <div className="dashboard">
      {/* -------------------- Left Section -------------------- */}
      <div className="dashboard-left">
        {/* Greeting + Link to Orders */}
        <div className="admin-name-dashboard">
          <h2>👋 Hi, Malino Alex</h2>
          <img
            src={assets.rigth_arrow_icon}
            alt="See all orders"
            className="link-to-orders"
            onClick={() => navigate("/orders")}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* -------------------- Recent Orders -------------------- */}
        <div className="product-cards-display">
          {latestOrders.length === 0 ? (
            <p>No recent orders.</p>
          ) : (
            latestOrders.map((order) =>
              order.items.map((item, index) => {
                const product = productList.find(
                  (p) => p._id.toString() === item.id.toString()
                );
                return (
                  <OrderItem
                    key={index}
                    id={item.id}
                    name={item.name}
                    image={product?.image || item.image}
                    price={item.price * item.quantity}
                    regular_price={product?.regular_price || item.price}
                    discount={product?.discount || null}
                    description={product?.description || ""}
                    category={product?.category || ""}
                    color={item.color || product?.color || ""}
                    cartPosition="left"
                  />
                );
              })
            )
          )}
        </div>

        {/* -------------------- Earnings Component -------------------- */}
        {showEarnings && (
          <Earnings
            statusPercentages={statusPercentages}
            latestUsers={latestUsers}
            avgRating={avgRating}
            totalRatings={totalRatings}
          />
        )}

        {/* -------------------- Transactions Component -------------------- */}
        <Transaction />
      </div>
    </div>
  );
};

export default Dashboard;
