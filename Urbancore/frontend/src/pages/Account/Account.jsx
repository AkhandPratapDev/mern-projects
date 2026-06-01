import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { successToast, errorToast, warningToast } from "../../utils/toast";

const Account = () => {
  const navigate = useNavigate();
  const {
    token,
    setToken,
    user,
    avatar,
    setAvatar,
    url,
    productList,
    LastProductList,
    OfferProductList,
  } = useContext(StoreContext);

  /* =============== Avatar Options =============== */
  const avatarOptions = [
    assets.person_1,
    assets.person_2,
    assets.person_3,
    assets.person_4,
    assets.person_5,
    assets.person_6,
    assets.person_7,
  ];

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  /* =============== Orders State =============== */
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* =============== Profile Edit State =============== */
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  /* =============== Address State =============== */
  const [address, setAddress] = useState("");

  /* =============== Sync Local State with User =============== */
  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setEmailInput(user.email || "");
      setAddress(user.address || "");
    }
  }, [user]);

  /* =============== Fetch Orders =============== */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await axios.post(
          `${url}/api/order/userOrders`,
          {},
          { headers: { token } }
        );
        if (res.data.success) {
          const sorted = res.data.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setOrders(sorted);
        }
      } catch (err) {
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [token, url]);

  /* =============== Save Profile =============== */
  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(
        `${url}/api/user/updateProfile`,
        { name: nameInput, email: emailInput },
        { headers: { token } }
      );
      if (res.data.success) {
        successToast("Profile updated successfully!");
        setEditingProfile(false);
      }
    } catch (err) {
      errorToast("Error updating profile");
    }
  };

  /* =============== Save Address =============== */
  const handleAddAddress = async () => {
    try {
      const res = await axios.put(
        `${url}/api/user/addAddress`,
        { address },
        { headers: { token } }
      );
      if (res.data.success) {
        successToast("Address updated successfully!");
      }
    } catch (err) {
      errorToast("Error adding address");
    }
  };

  /* =============== Navigate to Order Details =============== */
  const handleOrderClick = (orderId) => {
    navigate(`/trackOrder/${orderId}`);
  };

  /* =============== Logout =============== */
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // Inside Account component (replace relevant parts)
  const findProduct = (id) => {
    return (
      productList.find((p) => p._id?.toString() === id?.toString()) ||
      LastProductList.find((p) => p._id?.toString() === id?.toString()) ||
      OfferProductList.find((p) => p._id?.toString() === id?.toString())
    );
  };

  const getImageSource = (product, item) => {
    const img =
      product?.image || item?.image || item?.offerImage || item?.lastImage;
    if (!img) return assets.placeholder_img;
    if (img.startsWith("http") || img.startsWith("/uploads")) return img;
    return `${url}/${img.replace(/^\/+/, "")}`;
  };

  const handleThumbnailClick = (item) => {
    const inProduct = productList.find((p) => p._id === item.id);
    const inOffer = OfferProductList.find((p) => p._id === item.id);
    const inLast = LastProductList.find((p) => p._id === item.id);

    if (inOffer) navigate(`/offerProduct/${item.id}`);
    else if (inLast) navigate(`/lastproduct/${item.id}`);
    else if (inProduct) navigate(`/product/${item.id}`);
  };

  return (
    <div className="account-page">
      {/* =============== Profile Info =============== */}
      <div className="account-header">
        <div className="avatar-wrapper">
          <img src={avatar} alt="Avatar" className="avatar-img" />
          <button
            className="avatar-edit-btn"
            onClick={() => setShowAvatarPicker(true)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
              alt="Edit"
              className="pencil-icon"
            />
          </button>
        </div>

        <div className="person-info">
          {editingProfile ? (
            <>
              <div>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="personal-info-btns">
                <button onClick={handleSaveProfile} className="ac-save-btn">
                  Save
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="ac-cancle-btn"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="name-emial">
                <h2 className="ac-users-name">{user?.name || "Guest User"}</h2>
                <p>{user?.email || "No email available"}</p>
              </div>
              <div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="ac-edit-btn"
                >
                  <img src={assets.edit_icon} alt="" /> Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* =============== Avatar Picker Modal =============== */}
      {showAvatarPicker && (
        <div className="avatar-modal">
          <div className="avatar-modal-content">
            <h3>Choose Your Avatar</h3>
            <div className="avatar-options">
              {avatarOptions.map((option, idx) => (
                <img
                  key={idx}
                  src={option}
                  alt={`Avatar ${idx + 1}`}
                  className={`avatar-choice ${
                    avatar === option ? "selected" : ""
                  }`}
                  onClick={() => {
                    setAvatar(option);
                    setShowAvatarPicker(false);
                  }}
                />
              ))}
            </div>
            <button onClick={() => setShowAvatarPicker(false)}>Close</button>
          </div>
        </div>
      )}

      {/* =============== Address Section =============== */}
      <div className="account-section address-section">
        <h3>Address</h3>
        <div className="address-info">
          <textarea
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          />
          <button onClick={handleAddAddress}>
            <img src={assets.edit_icon} alt="" /> Save Address
          </button>
        </div>
      </div>

      {/* =============== Orders Section =============== */}
      <div className="account-section">
        <h3>My Recent Orders</h3>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          <>
            <div className="orders-list">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="order-card">
                  <div
                    className="order-info clickable"
                    onClick={() => handleOrderClick(order._id)}
                  >
                    <h4>Order #{order._id.slice(-6)}</h4>
                    <p>
                      Date:{" "}
                      {new Date(order.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      Status:{" "}
                      <span className={`status ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </p>
                    <p>Total: ₹{order.amount}</p>
                  </div>
                  {order.items?.length > 0 && (
                    <div
                      className="order-thumbnail clickable"
                      onClick={() => handleThumbnailClick(order.items[0])}
                    >
                      <img
                        src={getImageSource(
                          findProduct(order.items[0].id),
                          order.items[0]
                        )}
                        alt={order.items[0].name}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {orders.length > 3 && (
              <button
                className="view-all-btn"
                onClick={() => navigate("/orders")}
              >
                View All Orders →
              </button>
            )}
          </>
        ) : (
          <p className="empty">You have no orders yet.</p>
        )}
      </div>

      {/* =============== Settings / Logout =============== */}
      <div className="account-settings">
        <button onClick={logout} className="account-btn logout">
          Logout
          <img src={assets.logout_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Account;
