import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./OfferDetail.css";
import { assets } from "../../assets/assets";
import LastProductDisplay from "../LastProductDisplay/LastProductDisplay";
import { successToast, errorToast, warningToast } from "../../utils/toast";

const OfferDetail = () => {
  const { id } = useParams(); // get product id from URL
  const { OfferProductList, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  // find the product by id from context
  const product = OfferProductList.find(
    (item) => String(item._id) === String(id)
  );

  // ==================== Local state ====================
  const [mainImage, setMainImage] = useState(null); // main displayed image
  const [selectedSize, setSelectedSize] = useState("M"); // default size
  const [quantity, setQuantity] = useState(1); // default quantity
  const [openDropdown, setOpenDropdown] = useState(null); // which dropdown is open
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800); // mobile layout
  const [activeIndex, setActiveIndex] = useState(0); // for carousel active dot
  const carouselRef = useRef(null);

  // ==================== Effects ====================
  // set main image when product is loaded
  useEffect(() => {
    if (product?.image) setMainImage(product.image);
  }, [product]);

  // handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ==================== If product not found ====================
  if (!product) {
    return (
      <div className="product-detail not-found">
        <h2>Product not found!</h2>
      </div>
    );
  }

  // ==================== Handlers ====================
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // thumbnails array for carousel / image selection
  const thumbnails = [
    product.image,
    product.product_image_1,
    product.product_image_2,
    product.product_image_3,
  ].filter(Boolean);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

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
      source: "offer", // marks it as offer product
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
        source: "offer", // keep your source field
      },
    });
  };

  // ==================== JSX ====================
  return (
    <>
      <div className="product-detail">
        {/* Left section: Images */}
        <div className="product-detail-images">
          {isMobile ? (
            <>
              {/* Mobile carousel */}
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

              {/* Carousel dots */}
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
              {/* Desktop thumbnails */}
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

              {/* Main image */}
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

        {/* Right section: Product Info */}
        <div className="product-detail-info">
          <h2 className="product-title">{product.product_detail}</h2>
          <h3 className="product-name">{product.name}</h3>

          {/* Pricing & discount */}
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

          {/* Sales note */}
          <p className="offer-note">
            🚀 Crack the best deal, comfort meets trend!
          </p>

          {/* Size selection */}
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

          {/* Quantity & color */}
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

          {/* Actions: Order & Add to Cart */}
          <div className="product-actions">
            <button className="product-display-order-btn" onClick={handleOrder}>
              Order
            </button>

            <button className="cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          {/* Dropdown sections */}
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

          {/* Additional info: delivery & icons */}
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

      {/* Last products display (related products) */}
      <LastProductDisplay />
    </>
  );
};

export default OfferDetail;
