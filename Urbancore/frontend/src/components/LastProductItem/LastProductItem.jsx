import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./LastProductItem.css";
import { assets } from "../../assets/assets";

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
  cartPosition = "right" /* ==================== Default Cart Button Position ==================== */,
}) => {
  const { addToCart } = useContext(StoreContext);

  /* ==================== Handle Add to Cart ==================== */
  const handleAddToCart = () => {
    if (!id) {
      return;
    }

    addToCart({
      id,
      name,
      price,
      image,
      category,
      color,
      source: "last",
    });
  };

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
          {/* ==================== Name & Description ==================== */}
          <div className="product-item-name-description">
            <p>{name}</p>
            <p className="product-description">{description}</p>
          </div>

          {/* ==================== Price & Discount ==================== */}
          <div className="product-item-price-discount">
            <div className="product-item-disount-regular-price">
              {discount && <p className="product-discount">{discount}% off</p>}
              <p className="product-regular-price">&#8377;{regular_price}</p>
            </div>
            <p className="product-item-price">&#8377;{price}</p>
          </div>
        </div>
      </Link>

      {/* ==================== Add to Cart Button ==================== */}
      <div className="product-item-cart-btn">
        <button onClick={handleAddToCart}>
          <span>Add to Cart</span>
          <img src={assets.shopping_bag_wt_icon} alt="Shopping Bag Icon" />
        </button>
      </div>
    </div>
  );
};

export default LastProductItem;
