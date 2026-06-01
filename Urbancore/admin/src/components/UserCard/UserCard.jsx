import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./UserCard.css";
import { assets } from "../../assets/assets";
import {
  confirmToast,
  errorToast,
  successToast,
  warningToast,
} from "../../utils/toast";

const UserCard = ({ id, name, email, address }) => {
  const { removeUser } = useContext(StoreContext);
  const navigate = useNavigate();

  // ==================== Parse Address ====================
  const street = address?.street || "";
  const city = address?.city || "";
  const country = address?.country || "";

  // ==================== Remove User ====================
  const handleRemove = async () => {
    const confirmed = await confirmToast(
      `Are you sure you want to remove ${name}?`
    );

    if (confirmed) {
      try {
        await removeUser(id);
        successToast(`${name} has been removed.`);
      } catch (err) {
        errorToast("Failed to remove user.");
      }
    } else {
      warningToast("Action cancelled.");
    }
  };

  // ==================== Navigate to User Orders ====================
  const handleViewOrders = () => {
    navigate(`/user-orders/${id}`);
  };

  return (
    <div className="user-card" id="user-card">
      <div className="user-card-container">
        {/* ==================== User Image ==================== */}
        <div className="user-image">
          <img src={assets.user_image} alt="user" />
        </div>

        {/* ==================== User Info ==================== */}
        <div className="user-card-info">
          <h3 className="user-card-name">{name}</h3>
          <p className="user-card-email">{email}</p>
          <p className="user-card-address">{address}</p>
        </div>
      </div>

      {/* ==================== Action Buttons ==================== */}
      <div className="user-card-action-btns">
        <button onClick={handleRemove}>Remove</button>
        <button className="user-orders" onClick={handleViewOrders}>
          Orders
        </button>
      </div>
    </div>
  );
};

export default UserCard;
