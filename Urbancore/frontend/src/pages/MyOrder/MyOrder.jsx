import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyOrder.css";
import { assets } from "../../assets/assets";

const MyOrder = () => {
  const { token, url, productList, LastProductList, OfferProductList } =
    useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* =============== Fetch Orders =============== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(
          `${url}/api/order/userOrders`,
          {},
          { headers: { token } }
        );
        if (res.data.success) setOrders(res.data.data);
      } catch (err) {
       
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token, url]);

  if (loading) return <p className="loading-msg">Loading your orders...</p>;
  if (orders.length === 0) return <p className="empty-msg">No orders found!</p>;

  /* =============== Sort Orders (Newest First) =============== */
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  /* =============== Find Product by ID =============== */
  const findProduct = (id) => {
    return (
      productList.find((p) => p._id?.toString() === id?.toString()) ||
      LastProductList.find((p) => p._id?.toString() === id?.toString()) ||
      OfferProductList.find((p) => p._id?.toString() === id?.toString())
    );
  };

  /* =============== Get Correct Image URL =============== */
  const getImageSource = (product, item) => {
    const img =
      product?.image || item?.image || item?.offerImage || item?.lastImage;

    if (!img) return assets.placeholder_img;

    // if already full URL, just return it
    if (img.startsWith("http") || img.startsWith("/uploads")) return img;

    // else prepend backend base URL
    return `${url}/${img.replace(/^\/+/, "")}`;
  };

  /* =============== Smart Navigation =============== */
  const handleProductClick = (item) => {
    const inProduct = productList.find((p) => p._id === item.id);
    const inOffer = OfferProductList.find((p) => p._id === item.id);
    const inLast = LastProductList.find((p) => p._id === item.id);

    if (inOffer) {
      navigate(`/offerProduct/${item.id}`);
    } else if (inLast) {
      navigate(`/lastproduct/${item.id}`);
    } else if (inProduct) {
      navigate(`/product/${item.id}`);
    } else {
    }
  };

  return (
    <div className="my-orders-container">
      <h2 className="page-title">📦 My Orders</h2>

      {sortedOrders.map((order) => (
        <div key={order._id} className="order-card fade-in">
          <div className="order-header">
            <div>
              <h3 className="order-id">Order ID: {order._id}</h3>
              <p className="order-date">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>
            <button
              className="track-btn"
              onClick={() => navigate(`/trackOrder/${order._id}`)}
            >
              Track Order <img src={assets.track_order_wt_icon} alt="" />
            </button>
          </div>

          <div className="order-info-item">
            <div className="order-info">
              <p>
                <strong>Total:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                {order.payment ? "✅ Paid" : "⚠️ Pending / COD"}
              </p>
              <p>
                <strong>Address:</strong> {order.address.name},{" "}
                {order.address.address}, {order.address.phone}
              </p>
            </div>

            <div className="order-items">
              {order.items.map((item, idx) => {
                const product = findProduct(item.id);
                const imageSrc = getImageSource(product, item);

                return (
                  <div key={idx} className="order-item-card">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="order-item-img"
                      onClick={() => handleProductClick(item)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className="order-item-details">
                      <h5>{item.name}</h5>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price * item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
