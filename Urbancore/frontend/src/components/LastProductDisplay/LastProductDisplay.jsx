import React, { useContext, useState, useEffect } from "react";
import "./LastProductDisplay.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import LastProductItem from "../LastProductItem/LastProductItem";
import { useNavigate } from "react-router-dom";

const LastProductDisplay = () => {
  const { LastProductList, homepageAssets } = useContext(StoreContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  /* ==================== Simulate Loading ==================== */
  useEffect(() => {
    if (LastProductList && LastProductList.length > 0) {
      setLoading(false);
    }
  }, [LastProductList]);

  /* ==================== Skeleton Display Logic ==================== */
  const showSkeleton =
    loading || !LastProductList || LastProductList.length === 0;

  /* ==================== Number of Skeleton Items ==================== */
  const skeletonCount = 4;

  return (
    <div className="last-product-display" id="last-product-display">
      <div className="last-product-poster">
        {showSkeleton ? (
          <div className="skeleton skeleton-poster"></div>
        ) : (
          <img src={homepageAssets.last_product_display_poster} alt="Poster" />
        )}
      </div>
      {showSkeleton
        ? [...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="product-item skeleton-item">
              <div className="skeleton skeleton-img"></div>
              <div className="skeleton-text-content">
                <div className="skeleton skeleton-text short"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-price"></div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            </div>
          ))
        : LastProductList.map((item, index) => {
            const cartPosition = index === 0 ? "left" : "right";

            return (
              <LastProductItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                discount={item.discount}
                regular_price={item.regular_price}
                cartPosition={cartPosition}
              />
            );
          })}
      {!showSkeleton && (
        <button onClick={() => navigate("/shop")} className="load-more-btn">
          <img src={assets.right_up_arrow_wt_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
};

export default LastProductDisplay;
