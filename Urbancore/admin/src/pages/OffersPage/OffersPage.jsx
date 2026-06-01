import React, { useContext } from "react";
import "./OffersPage.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../../components/ProductItem/ProductItem";
import OfferDisplay from "../../components/OfferDisplay/OfferDisplay";

const OffersPage = () => {
  const { offer_product_list } = useContext(StoreContext); // ✅ Fetch offer products from context

  return (
    <div className="offer-mangement">
      {/* ==================== Page Title ==================== */}
      <h2 className="page-title">🎁 Offer Management</h2>

      {/* ==================== Offers Display Component ==================== */}
      <OfferDisplay />
    </div>
  );
};

export default OffersPage;
