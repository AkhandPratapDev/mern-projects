import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import LastProductDisplay from "../LastProductDisplay/LastProductDisplay";
import { assets } from "../../assets/assets";
import "./LastProductDetail.css";
import { successToast, errorToast, warningToast } from "../../utils/toast";

const LastProductDetail = () => {
  const { id } = useParams();
  const { LastProductList, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const product = LastProductList.find(
    (item) => String(item._id) === String(id)
  );

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // ------------------ Set main image once product loads ------------------
  useEffect(() => {
    if (product?.image) setMainImage(product.image);
  }, [product]);

  // ------------------ Detect screen resize for mobile layout ------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ------------------ Product not found ------------------
  if (!product) {
    return (
      <div className="product-detail not-found">
        <h2>Product not found!</h2>
      </div>
    );
  }

  // ------------------ Toggle dropdown sections ------------------
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // ------------------ Thumbnails for product images ------------------
  const thumbnails = [
    product.image,
    product.product_image_1,
    product.product_image_2,
    product.product_image_3,
  ].filter(Boolean);

  // ------------------ Track active carousel index ------------------
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    setActiveIndex(Math.round(scrollLeft / width));
  };

  // ------------------ Add product to cart ------------------
  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSize,
      color: product.color,
      quantity,
      source: "last",
    });
  };

  /* ==================== Order Button Handler ==================== */

  const handleOrder = () => {
    const availableQty = product.quantities?.[selectedSize] || 0;
    if (quantity > availableQty) {
      warningToast(
        `Only ${availableQty} item(s) available for size ${selectedSize}.`
      );
      return;
    }

    // ✅ Navigate to order page with size & color
    navigate(`/order/${product._id}`, {
      state: {
        quantity,
        size: selectedSize, // send selected size
        color: product.color, // send product color
        source: "last", // keep your source field
      },
    });
  };

  return (
    <>
      <div className="product-detail">
        {/* =================== Left Section: Images =================== */}
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

              {mainImage && (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="main-image"
                />
              )}
            </>
          )}
        </div>

        {/* =================== Right Section: Info =================== */}
        <div className="product-detail-info">
          <h2 className="product-title">{product.product_detail}</h2>
          <h3 className="product-name">{product.name}</h3>

          <div className="product-price-section">
            {product.discount && (
              <span className="current-price">₹{product.price}</span>
            )}
            {product.regular_price && (
              <span className="old-price">₹{product.regular_price}</span>
            )}
            {product.discount && (
              <span className="discount">{product.discount}% OFF</span>
            )}
          </div>

          <p className="offer-note">
            🚀 Crack the best deal, comfort meets trend!
          </p>

          <div className="product-sizes">
            <span className="label">Size:</span>
            {product.sizes?.map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? "active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

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
              <span className="label">Color:</span>
              <span className="color-value">{product.color}</span>
            </div>
          </div>

          <div className="product-actions">
            <button className="product-display-order-btn" onClick={handleOrder}>
              Order
            </button>
            <button className="cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

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
                  <p>{product.description}</p>
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

          <div className="return_policy">
            <div className="return_policy_icon">
              <div>
                <img src={assets.easy_return_icon} alt="" />
                <p>Easy Return & Refunds.</p>
              </div>
              <div>
                <img src={assets.cod_icon} alt="" />
                <p>Cash on Delivery.</p>
              </div>
              <div>
                <img src={assets.quality_assurance_icon} alt="" />
                <p>Quality Assurance.</p>
              </div>
            </div>
            <div className="delivery_time">
              <p>
                Expected delivery in{" "}
                <span className="time">
                  {product.expected_delivery[0]} to{" "}
                  {product.expected_delivery[1]} working days.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================== Related Products Display =================== */}
      <LastProductDisplay />
    </>
  );
};

export default LastProductDetail;
