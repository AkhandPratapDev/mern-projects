import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ProductItem.css";
import { assets } from "../../assets/assets";

/* =============== Product Item Component =============== */
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
  cartPosition = "right", // default cart button position
}) => {
  const { addToCart } = useContext(StoreContext);

  /* =============== Add to Cart Handler =============== */
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
      source: "product",
    });
  };

  return (
    /* =============== Product Item Container =============== */
    <div
      className={`product-item ${cartPosition === "left" ? "left-cart" : ""}`}
      id="product-item"
    >
      {/* =============== Product Link =============== */}
      <Link to={`/product/${id}`} className="product-item-link">
        {/* =============== Product Image =============== */}
        <div className="product-item-img-container">
          <img className="product-item-image" src={image} alt={name} />
        </div>

        {/* =============== Product Info =============== */}
        <div className="product-item-info">
          {/* =============== Name & Description =============== */}
          <div className="product-item-name-description">
            <p>{name}</p>
            <p className="product-description">{description}</p>
          </div>

          {/* =============== Price & Discount =============== */}
          <div className="product-item-price-discount">
            <div className="product-item-disount-regular-price">
              {discount && <p className="product-discount">{discount}% off</p>}
              <p className="product-regular-price">&#8377;{regular_price}</p>
            </div>
            <p className="product-item-price">&#8377;{price}</p>
          </div>
        </div>
      </Link>

      {/* =============== Add to Cart Button =============== */}
      <div className="product-item-cart-btn">
        <button onClick={handleAddToCart}>
          <span>Add to Cart</span>
          <img src={assets.shopping_bag_wt_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
