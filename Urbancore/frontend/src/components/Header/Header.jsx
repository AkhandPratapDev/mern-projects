import React, { useEffect, useRef, useState, useContext } from "react";
import "./Header.css";
import { StoreContext } from "../../context/StoreContext"; // adjust path if needed

const Header = () => {
  const { homepageAssets } = useContext(StoreContext);

  // =========================== Images Setup ===========================
  const images = [
    homepageAssets?.header_img_1,
    homepageAssets?.header_img_2,
    homepageAssets?.header_img_3,
  ].filter(Boolean); // remove undefined/null

  // Duplicate images for infinite scrolling
  const extendedImages = [...images, ...images];

  // =========================== State & Refs ===========================
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  // =========================== Auto Slide Effect ===========================
  useEffect(() => {
    if (!images.length) return; // skip autoplay if no images
    timerRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(timerRef.current);
  }, [images.length]);

  // =========================== Reset Index for Infinite Scroll ===========================
  useEffect(() => {
    if (index >= images.length) {
      const timeout = setTimeout(() => {
        setIndex(0);
      }, 500); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [index, images.length]);

  // =========================== Skeleton Loader ===========================
  if (!images.length) {
    return (
      <div className="header">
        <div className="skeleton skeleton-header"></div>
      </div>
    );
  }

  // =========================== Header Slider ===========================
  return (
    <div className="header">
      <div
        className="header-contents"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: index === 0 ? "none" : undefined,
        }}
      >
        {extendedImages.map((img, i) => (
          <img key={i} src={img} alt={`header-${i}`} className="header-img" />
        ))}
      </div>

      {/* =========================== Dots Navigation =========================== */}
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index % images.length ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Header;
