import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LastProductDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import LastProductItem from "../LastProductItem/LastProductItem";
import { assets } from "../../assets/assets";
import { successToast, errorToast } from "../../utils/toast";

const DEFAULT_POSTER = "/images/default-lastposter.jpg";

const LastProductDisplay = () => {
  /* ==================== Context ==================== */
  const {
    lastProductList,
    homepageAssets,
    updateHomepageAsset,
    fetchLastProducts,
  } = useContext(StoreContext);

  /* ==================== State ==================== */
  const [poster, setPoster] = useState(DEFAULT_POSTER);
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w <= 1025) return 1;
    if (w <= 1089) return 2;
    return 3;
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* ==================== Sync poster from backend ==================== */
  useEffect(() => {
    if (homepageAssets?.last_product_display_poster) {
      setPoster(homepageAssets.last_product_display_poster);
    } else {
      setPoster(DEFAULT_POSTER);
    }
  }, [homepageAssets]);

  /* ==================== Responsive product count ==================== */
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      let next;
      if (w <= 1025) next = 1;
      else if (w <= 1289) next = 2;
      else next = 3;
      setVisibleCount((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ==================== Poster upload handlers ==================== */
  const handlePosterClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2 MB
    const requiredWidth = 265;
    const requiredHeight = 265;

    // --- Step 1: File size check ---
    if (file.size > maxSize) {
      errorToast(" Image size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    // --- Step 2: Dimension check ---
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      if (width !== requiredWidth || height !== requiredHeight) {
        errorToast(
          ` Invalid image dimensions it must ${requiredWidth}×${requiredHeight}px`
        );
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
        return;
      }

      // ✅ Step 3: Update poster if valid
      const reader = new FileReader();
      reader.onloadend = () => setPoster(reader.result);
      reader.readAsDataURL(file);

      if (homepageAssets?._id) {
        updateHomepageAsset("last_product_display_poster", file);
      }

      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      errorToast(" Invalid image file. Please upload a valid image.");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  /* ==================== Navigation handlers ==================== */
  const handleProductClick = (productId) =>
    navigate(`/lastproduct/${productId}`);
  const handleAddNewProduct = () => navigate("/lastproduct/new");

  /* ==================== Product slots ==================== */
  const products = lastProductList ? lastProductList.slice(0, 3) : [];
  const totalSlots = 3;
  const remainingSlots = totalSlots - products.length;

  /* ==================== Render ==================== */
  return (
    <div className="last-product-display" id="last-product-display">
      {/* ==================== Hidden file input ==================== */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* ==================== Poster ==================== */}
      <div
        className="last-product-poster"
        onClick={handlePosterClick}
        style={{ cursor: "pointer" }}
      >
        <img className="border" src={poster} alt="Last Product Poster" />
      </div>

      {/* ==================== Product list ==================== */}
      {products.map((item, index) => (
        <div
          key={item._id || index}
          onClick={() => handleProductClick(item._id)}
          className="product-item"
          style={{ cursor: "pointer" }}
        >
          <LastProductItem
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            discount={item.discount}
            regular_price={item.regular_price}
            cartPosition={index === 0 ? "left" : "right"}
          />
        </div>
      ))}

      {/* ==================== Add new product boxes ==================== */}
      {Array.from({ length: remainingSlots }).map((_, i) => (
        <div
          key={`add-box-${i}`}
          className="add-new-product-box"
          onClick={handleAddNewProduct}
        >
          <span>＋ Add New Product</span>
        </div>
      ))}
    </div>
  );
};

export default LastProductDisplay;
