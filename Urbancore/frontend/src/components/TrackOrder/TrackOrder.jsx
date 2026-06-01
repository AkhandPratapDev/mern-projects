import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TrackOrder.css";
import { assets } from "../../assets/assets";

/* ==================== Order Steps ==================== */
const steps = [
  "Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const { token, url, productList, LastProductList, OfferProductList } =
    useContext(StoreContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ==================== Fetch Order Data ==================== */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.post(
          `${url}/api/order/userOrders`,
          {},
          { headers: { token } }
        );

        if (res.data.success) {
          const userOrder = res.data.data.find((o) => o._id === orderId);
          setOrder(userOrder || null);
        }
      } catch (err) {
      
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrder();
  }, [token, url, orderId]);

  /* ==================== Utility: Find Product ==================== */
  const findProduct = (id) => {
    return (
      productList.find((p) => p._id?.toString() === id?.toString()) ||
      LastProductList.find((p) => p._id?.toString() === id?.toString()) ||
      OfferProductList.find((p) => p._id?.toString() === id?.toString())
    );
  };

  /* ==================== Utility: Get Correct Image Source ==================== */
  const getImageSource = (product, item) => {
    const img =
      product?.image || item?.image || item?.offerImage || item?.lastImage;

    if (!img) return assets.placeholder_img;

    // if already full URL (http:// or /uploads), just return it
    if (img.startsWith("http") || img.startsWith("/uploads")) return img;

    // else prepend base URL safely
    return `${url}/${img.replace(/^\/+/, "")}`;
  };

  /* ==================== Handle Product Click ==================== */
  const handleProductClick = (item) => {
    if (item.source === "last") {
      navigate(`/lastproduct/${item.id}`);
    } else if (item.source === "offer") {
      navigate(`/offerProduct/${item.id}`);
    } else {
      navigate(`/product/${item.id}`);
    }
  };

  /* ==================== Loading & Error States ==================== */
  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found!</p>;

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="track-order-page">
      {/* ==================== Back Button ==================== */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <img src={assets.back_icon} alt="Back" />
      </button>

      <h2 className="trcking-order-h2">Tracking Order: {order._id}</h2>

      {/* ==================== Status Progress ==================== */}
      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={step} className="progress-step">
            <div className={`circle ${index <= currentStep ? "active" : ""}`}>
              {index < currentStep ? "✔" : index + 1}
            </div>
            <span className={`label ${index <= currentStep ? "active" : ""}`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`line ${index < currentStep ? "filled" : ""}`} />
            )}
          </div>
        ))}
      </div>

      {/* ==================== Order Details ==================== */}
      <div className="order-details">
        <p>
          <strong>Total:</strong> ₹{order.amount}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Shipping Address:</strong> {order.address.name},{" "}
          {order.address.address}, {order.address.phone}
        </p>

        <h4>Items:</h4>
        <div className="order-items">
          {order.items.map((item, index) => {
            const product = findProduct(item.id);
            const imageSrc = getImageSource(product, item);

            return (
              <div key={index} className="order-item-card">
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="order-item-img"
                  onClick={() => handleProductClick(item)}
                  style={{ cursor: "pointer" }}
                />
                <div className="order-item-details">
                  <h5>{item.name}</h5>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price * item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {/* {item.color && <p>Color: {item.color}</p>} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
