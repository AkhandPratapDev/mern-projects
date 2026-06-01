import React, { useContext, useRef, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./HomePage.css";
import LastProductDisplay from "../../components/LastProductDisplay/LastProductDisplay";
import { successToast, errorToast } from "../../utils/toast";
import AdminPolicies from "../../components/AdminPolicies/AdminPolicies";

/* ==================== Default Images ==================== */
const DEFAULT_IMAGES = {
  header_img_1: "/images/default-header1.jpg",
  header_img_2: "/images/default-header2.jpg",
  header_img_3: "/images/default-header3.jpg",
  homepage_poster: "/images/default-homeposter.jpg",
  offers_poster: "/images/default-offers.jpg",
  last_product_display_poster: "/images/default-lastposter.jpg",
};

const HomePage = () => {
  /* ==================== Context & State ==================== */
  const { homepageAssets, updateHomepageAsset } = useContext(StoreContext);
  const [images, setImages] = useState(DEFAULT_IMAGES);

  /* ==================== Refs ==================== */
  const fileInputRef = useRef(null);
  const currentEditingRef = useRef(null);

  /* ==================== Effect: Load Homepage Assets ==================== */
  useEffect(() => {
    if (homepageAssets) setImages({ ...DEFAULT_IMAGES, ...homepageAssets });
  }, [homepageAssets]);

  /* ==================== Helper: Validation Rules ==================== */
  const dimensionRules = {
    header_img_1: { width: 890, height: 390 },
    header_img_2: { width: 890, height: 390 },
    header_img_3: { width: 890, height: 390 },
    homepage_poster: { width: 700, height: 210 },
    offers_poster: { width: 700, height: 250 },
  };

  /* ==================== Handler: Image Validation ==================== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const key = currentEditingRef.current;
    const rule = dimensionRules[key];
    const maxSize = 2 * 1024 * 1024; // 2MB

    // --- Check file size ---
    if (file.size > maxSize) {
      errorToast(" File size must not exceed 2MB.");
      e.target.value = "";
      return;
    }

    // --- Check dimensions ---
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;

      if (rule && (width !== rule.width || height !== rule.height)) {
        errorToast(
          ` Invalid image dimensions it must ${rule.width}×${rule.height}px.`
        );
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
        return;
      }

      // ✅ If valid — preview & update
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({
          ...prev,
          [key]: reader.result,
        }));
        updateHomepageAsset(key, file);
      };
      reader.readAsDataURL(file);
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      errorToast(" Invalid image file. Please upload a valid image.");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  /* ==================== Handler: Open File Dialog ==================== */
  const handleImageClick = (key) => {
    currentEditingRef.current = key;
    fileInputRef.current.click();
  };

  /* ==================== JSX ==================== */
  return (
    <div className="homepage-container">
      <h2 className="page-title">🏠 Home Management</h2>
      <div className="homepage">
        {/* Hidden file input for image upload */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Header Images */}
        <h3>
          Header Images <span>(890×390px)</span>
        </h3>
        <div className="header-images">
          {["header_img_1", "header_img_2", "header_img_3"].map((key) => (
            <img
              key={key}
              src={images[key]}
              alt={key}
              className="homepage-img"
              onClick={() => handleImageClick(key)}
            />
          ))}
        </div>

        {/* Home Poster */}
        <h3>
          Home Poster <span>(700×210px)</span>
        </h3>
        <img
          className="border"
          src={images.homepage_poster}
          alt="homepage_poster"
          onClick={() => handleImageClick("homepage_poster")}
        />

        {/* Offers Poster */}
        <h3>
          Offers Poster <span> (700×250px)</span>
        </h3>
        <img
          className="border"
          src={images.offers_poster}
          alt="offers_poster"
          onClick={() => handleImageClick("offers_poster")}
        />

        {/* Last Product Display Poster */}
        <h3>
          Last Product Display Poster <span> (265×265px)</span>
        </h3>
        <LastProductDisplay />

        <AdminPolicies />
      </div>
    </div>
  );
};

export default HomePage;
