// =============== React & Libraries ===============
import React, { useContext, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { successToast, errorToast } from "../../utils/toast";

// =============== Styles ===============
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { productList, LastProductList, OfferProductList, token, url } =
    useContext(StoreContext);

  const { source, quantity: qtyFromState, size, color } = location.state || {};
  const quantity = qtyFromState || 1;

  // 🔹 Find product based on source
  let product;
  if (source === "last") {
    product = LastProductList.find((item) => String(item._id) === String(id));
  } else if (source === "offer") {
    product = OfferProductList.find((item) => String(item._id) === String(id));
  } else {
    product = productList.find((item) => String(item._id) === String(id));
  }

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "cod",
  });

  const [loading, setLoading] = useState(false); // 🔹 Loading state

  if (!product) return <h2 className="order-not-found">Product not found!</h2>;

  const totalPrice = product.price * quantity;

  // 🔹 Handle form inputs
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 If not logged in
    if (!token) {
      errorToast("Please sign up or log in to place your order.");
      return;
    }

    setLoading(true); // Show "Placing..." state

    try {
      const orderPayload = {
        items: [
          {
            id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
            size,
            color,
          },
        ],
        amount: totalPrice,
        address: {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
        },
        payment: formData.payment,
      };

      // ================= CASH ON DELIVERY =================
      if (formData.payment === "cod") {
        const res = await axios.post(`${url}/api/order/place`, orderPayload, {
          headers: { token },
        });

        if (res.data.success) {
          successToast("Order placed successfully!");
          window.location.replace("/orders"); // 🚀 prevents back navigation
        } else {
          errorToast(" Failed to place order!");
        }
      }

      // ================= STRIPE PAYMENT =================
      else if (formData.payment === "paynow") {
        const res = await axios.post(`${url}/api/order/place`, orderPayload, {
          headers: { token },
        });

        if (res.data.success && res.data.session_url) {
          window.location.href = res.data.session_url; // redirect to Stripe checkout
        } else {
          errorToast(" Stripe session could not be created!");
        }
      }
    } catch (err) {
      errorToast("Error placing order");
    } finally {
      setLoading(false); // Stop "Placing..." state
    }
  };

  return (
    <div className="order-container">
      {/* Left: Product Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <img
          src={product.image}
          alt={product.name}
          className="order-product-img"
        />
        <h3>{product.name}</h3>
        <p>{product.product_detail}</p>
        <div className="order-price">
          <span className="price">
            ₹{product.price} × {quantity} = ₹{totalPrice}
          </span>
        </div>
      </div>

      {/* Right: Shipping / Payment Form */}
      <div className="order-form">
        <h2>Shipping Details</h2>

        {!token ? (
          <div className="login-warning">
            <p>Please sign up or log in to place an order.</p>
            <button
              className="login-btn"
              onClick={() => navigate("/login")} // navigate to login page
            >
              Go to Login / Signup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.payment === "cod"}
                    onChange={handleChange}
                  />
                  Cash on Delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="paynow"
                    checked={formData.payment === "paynow"}
                    onChange={handleChange}
                  />
                  Pay Now
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Placing...
                </>
              ) : (
                <>Place Order (₹{totalPrice})</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
