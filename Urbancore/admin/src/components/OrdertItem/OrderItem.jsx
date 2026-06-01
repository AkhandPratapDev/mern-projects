



import React from "react";
import { Link } from "react-router-dom";
import "./OrderItem.css";
import { assets } from "../../assets/assets";

const OrderItem = ({
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
  onDelete, // callback for Delete button
}) => {
  return (
    <div className={`product-item ${cartPosition === "left" ? "left-cart" : ""}`} id="product-item">
      <Link to={`/product/${id}`} className="product-item-link">
        <div className="product-item-img-container">
          <img className="product-item-image" src={image} alt={name} />
        </div>

        <div className="product-item-info">
          <div className="product-item-name-description">
            <p>{name}</p>
            <p className="product-description">{description}</p>
          </div>

          <div className="product-item-price-discount">
            <div className="product-item-disount-regular-price">
              {discount && <p className="product-discount">{discount} % off</p>}
              <p className="product-regular-price">&#8377;{regular_price}</p>
            </div>
            <p className="product-item-price">&#8377;{price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OrderItem;





