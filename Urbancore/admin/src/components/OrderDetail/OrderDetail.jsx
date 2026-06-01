import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./OrderDetail.css";
import { assets } from "../../assets/assets";

const OrderDetail = () => {
  const { id } = useParams();
  const { orders } = useContext(StoreContext);
  const navigate = useNavigate();

  /* ==================== Fetch Order Product ==================== */
  const order_product = orders.find((item) => String(item._id) === String(id));

  const [mainImage, setMainImage] = useState(order_product?.image);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1); // ✅ Quantity state
  const [openDropdown, setOpenDropdown] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  /* ==================== Handle Window Resize ==================== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!order_product) {
    return (
      <div className="product-detail not-found">
        <h2>Product not found!</h2>
      </div>
    );
  }

  /* ==================== Dropdown Toggle ==================== */
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  /* ==================== Thumbnails ==================== */
  const thumbnails = [
    order_product.image,
    order_product.product_image_1,
    order_product.product_image_2,
    order_product.product_image_3,
  ].filter(Boolean);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <div className="product-detail">
      {/* ==================== Left: Product Images ==================== */}
      <div className="product-detail-images">
        {isMobile ? (
          <>
            <div
              className="thumbnail-row carousel-mode"
              ref={carouselRef}
              onScroll={handleScroll}
            >
              {thumbnails.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  className={`thumb ${activeIndex === index ? "active" : ""}`}
                />
              ))}
            </div>
            <div className="dots">
              {thumbnails.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === activeIndex ? "active" : ""}`}
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollTo({
                        left: i * carouselRef.current.offsetWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                ></span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="thumbnail-row">
              {thumbnails.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  onClick={() => setMainImage(img)}
                  className={`thumb ${mainImage === img ? "active" : ""}`}
                />
              ))}
            </div>
            <img
              src={mainImage}
              alt={order_product.name}
              className="main-image"
            />
          </>
        )}
      </div>

      {/* ==================== Right: Product Info ==================== */}
      <div className="product-detail-info">
        <h2 className="product-title">{order_product.product_detail}</h2>
        <h3 className="product-name">{order_product.name}</h3>

        {/* ==================== Price Section ==================== */}
        <div className="product-price-section">
          {order_product.discount && (
            <span className="current-price">₹{order_product.price}</span>
          )}
          {order_product.regular_price && (
            <span className="old-price">₹{order_product.regular_price}</span>
          )}
          {order_product.discount && (
            <span className="discount">{order_product.discount} OFF</span>
          )}
        </div>

        <p className="offer-note">
          🚀 {order_product.sold_last_week || 0} people bought this in last 7
          days
        </p>

        {/* ==================== Sizes ==================== */}
        <div className="product-sizes">
          <span className="label">Size:</span>
          {order_product.sizes?.map((size) => (
            <button
              key={size}
              className={`size-btn ${selectedSize === size ? "active" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {/* ==================== Color & Quantity ==================== */}
        <div className="product-color-quantity-details">
          <div className="quantity-control">
            <span className="label">Quantity:</span>
            <div className="quantity-btns">
              <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="product-color">
            <span className="label">Color: </span>
            <span className="color-value">{order_product.color}</span>
          </div>
        </div>

        {/* ==================== Action Buttons ==================== */}
        <div className="product-actions">
          <button
            onClick={() =>
              navigate(`/order/${order_product._id}`, { state: { quantity } })
            }
            className="product-display-order-btn"
          >
            Out For Delivery
          </button>
          <button
            onClick={() => navigate(`/status/${order_product._id}`)}
            className="track-btn"
          >
            Track
          </button>
        </div>

        {/* ==================== Dropdowns ==================== */}
        <div className="dropdowns">
          <div className="dropdown">
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown("description")}
            >
              <span>Product Description</span>
              <span>{openDropdown === "description" ? "−" : "+"}</span>
            </div>
            {openDropdown === "description" && (
              <div className="dropdown-body">
                <p>{order_product.description}</p>
              </div>
            )}
          </div>

          <div className="dropdown">
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown("return")}
            >
              <span>15 Days Return & Instant Refunds</span>
              <span>{openDropdown === "return" ? "−" : "+"}</span>
            </div>
            {openDropdown === "return" && (
              <div className="dropdown-body">
                <p>
                  Easy returns within 15 days. Instant refund once processed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
