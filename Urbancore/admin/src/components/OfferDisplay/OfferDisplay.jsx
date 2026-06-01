import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./OfferDisplay.css";
import OfferItem from "../OfferItem/OfferItem";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const OfferDisplay = ({ category }) => {
  const { offerProductList, setOfferProductList } = useContext(StoreContext);
  const navigate = useNavigate();

  /* ==================== Navigate to Add Product ==================== */
  const handleAddProduct = () => {
    navigate("/offerProduct/new");
  };

  return (
    <div className="product-display" id="product-display">
      <h2>Offer Products</h2>

      {/* ==================== Product List ==================== */}
      <div className="product-display-list">
        {offerProductList.length === 0 && (
          <p className="no-product">No products found</p>
        )}

        {offerProductList
          .filter(
            (item) =>
              category === "All" || !category || item.category === category
          )
          .map((item, index) => (
            <div key={item._id || index} className="fade-in">
              <OfferItem
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                discount={item.discount}
                regular_price={item.regular_price}
                category={item.category}
                color={item.color}
                onProductDeleted={(deletedId) => {
                  setOfferProductList((prev) =>
                    prev.filter((p) => p._id !== deletedId)
                  );
                }}
              />
            </div>
          ))}
      </div>

      {/* ==================== Floating Add Product Button ==================== */}
      <div className="add-product-btn">
        <button onClick={handleAddProduct}>
          Add Product{" "}
          <img className="plus-icon" src={assets.plus_icon} alt="plus icon" />
        </button>
      </div>
    </div>
  );
};

export default OfferDisplay;
