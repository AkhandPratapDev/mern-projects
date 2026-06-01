import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./UserOrders.css";
import { assets } from "../../assets/assets";

const UserOrders = () => {
  /* ==================== Get userId from route params ==================== */
  const { userId } = useParams();

  /* ==================== Access orders & products from context ==================== */
  const { orderList, productList } = useContext(StoreContext);

  const navigate = useNavigate();

  /* ==================== Track copied Order ID ==================== */
  const [copiedId, setCopiedId] = useState(null);

  /* ==================== Filter orders for this user ==================== */
  const userOrders = orderList.filter((order) => order.userId === userId);

  /* ==================== Function to get status badge class ==================== */
  const getStatusClass = (status) => {
    switch (status) {
      case "Placed":
        return "status-placed";
      case "Processing":
        return "status-processing";
      case "Shipped":
        return "status-shipped";
      case "Out for Delivery":
        return "status-out";
      case "Delivered":
        return "status-delivered";
      default:
        return "status-default";
    }
  };

  return (
    <div className="user-orders-page">
      {/* ==================== Page title ==================== */}
      <h2 className="page-title">User Orders</h2>

      {userOrders.length === 0 ? (
        /* ==================== Show message if no orders ==================== */
        <p className="no-orders">No orders found for this user.</p>
      ) : (
        userOrders.map((order) => (
          /* ==================== Single order card ==================== */
          <div key={order._id} className="order-card">
            <div className="order-header">
              {/* ==================== Order ID with copy feature ==================== */}
              <h3 className="order-id-container">
                Order ID: {order._id}{" "}
                <span
                  className="copy-icon"
                  title="Copy Order ID"
                  onClick={() => {
                    navigator.clipboard.writeText(order._id);
                    setCopiedId(order._id);

                    /* ==================== Reset copied state after 1.5s ==================== */
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                >
                  <img src={assets.copy_icon} alt="" />
                </span>
                {/* ==================== Show copied tooltip ==================== */}
                {copiedId === order._id && (
                  <span className="copy-popup">Copied!</span>
                )}
              </h3>
            </div>

            {/* ==================== Order total and status ==================== */}
            <div className="user-order-status-price">
              <p>Total: ₹{order.amount}</p>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* ==================== Display order items ==================== */}
            <h4>Items:</h4>
            <div className="order-items">
              {order.items.map((item, index) => {
                /* ==================== Find product details from productList ==================== */
                const product = productList.find(
                  (p) => p._id.toString() === item.id.toString()
                );

                /* ==================== Single product in order ==================== */
                return (
                  <div key={index} className="order-item-card">
                    <img src={product?.image || item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrders;
