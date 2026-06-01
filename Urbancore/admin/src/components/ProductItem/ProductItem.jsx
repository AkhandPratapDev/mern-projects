import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./ProductItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import {
  successToast,
  errorToast,
  warningToast,
  confirmToast,
} from "../../utils/toast";

const ProductItem = ({
  id,
  name,
  price,
  description,
  image,
  category,
  regular_price,
  discount,
  color,
  cartPosition = "right",
}) => {
  const { removeProduct } = useContext(StoreContext);

  /* ==================== Delete Product Handler ==================== */
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      // 🟡 Ask for confirmation before deleting
      const confirmed = await confirmToast(
        "Are you sure you want to delete this product?"
      );
      if (!confirmed) return; // user clicked "No"

      // ✅ Proceed with deletion
      await removeProduct(id);
      successToast("✅ Product deleted successfully!");
    } catch (err) {
  
      errorToast(" Failed to delete product.");
    }
  };

  return (
    <div
      className={`product-item ${cartPosition === "left" ? "left-cart" : ""}`}
      id="product-item"
    >
      {/* ==================== Product Link ==================== */}
      <Link to={`/product/${id}`} className="product-item-link">
        <div className="product-item-img-container">
          <img className="product-item-image" src={image} alt={name} />
        </div>

        {/* ==================== Product Info ==================== */}
        <div className="product-item-info">
          <div className="product-item-name-description">
            <p>{name}</p>
            <p className="product-description">{description}</p>
          </div>

          {/* ==================== Price & Discount ==================== */}
          <div className="product-item-price-discount">
            <div className="product-item-disount-regular-price">
              {discount && <p className="product-discount">{discount} % off</p>}
              <p className="product-regular-price">&#8377;{regular_price}</p>
            </div>
            <p className="product-item-price">&#8377;{price}</p>
          </div>
        </div>
      </Link>

      {/* ==================== Delete Button ==================== */}
      <div className="product-item-cart-btn">
        <button onClick={handleDelete}>
          <span>Delete Product</span>
          <img src={assets.delete_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
