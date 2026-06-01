import React, { useContext } from "react";
import "./OfferProductDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import OfferItem from "../OffreItem/OffreItem"; // ✅ Individual offer product component
import { assets } from "../../assets/assets";

const OfferProductDisplay = () => {
  // ✅ Get offers list and homepage assets from context
  const { OfferProductList, homepageAssets } = useContext(StoreContext);

  return (
    <div className="offer-product-display" id="offer-product-display">
      {/* ==================== Offer Poster ==================== */}
      <div className="offer-poster">
        <img src={homepageAssets.offers_poster} alt="offers poster" />
      </div>

      {/* ==================== Offer Products List ==================== */}
      <div className="offer-product-display-list">
        {OfferProductList.map((item, index) => {
          return (
            <OfferItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              discount={item.discount}
              regular_price={item.regular_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OfferProductDisplay;
