import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./LastProductItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const LastProductItem = ({
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
  const { updateLastProduct } = useContext(StoreContext);

  return (
    <div
      className={`product-item ${cartPosition === "left" ? "left-cart" : ""}`}
      id="product-item"
    >
      {/* ==================== Product Link ==================== */}
      <Link to={`/lastproduct/${id}`} className="product-item-link">
        {/* ==================== Product Image ==================== */}
        <div className="product-item-img-container">
          <img className="product-item-image" src={image} alt={name} />
        </div>

        {/* ==================== Product Info ==================== */}
        <div className="product-item-info">
          {/* Name & Description */}
          <div className="product-item-name-description">
            <p>{name}</p>
            <p className="product-description">{description}</p>
          </div>

          {/* Price & Discount */}
          <div className="product-item-price-discount">
            <div className="product-item-disount-regular-price">
              {discount && <p className="product-discount">{discount} % off</p>}
              <p className="product-regular-price">&#8377;{regular_price}</p>
            </div>
            <p className="product-item-price">&#8377;{price}</p>
          </div>
        </div>
      </Link>

      {/* ==================== Update Product Button ==================== */}
      <div className="product-item-cart-btn">
        <button onClick={updateLastProduct}>
          <span>Update Product</span>
          <img src={assets.delete_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default LastProductItem;
