import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductDisplay.css";
import ProductItem from "../ProductItem/ProductItem";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const ProductDisplay = ({ products }) => {
  const { setProductList } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/product/new");
  };

  return (
    <div className="product-display" id="product-display">
      <h2>Products</h2>

      <div className="product-display-list">
        {products.length === 0 && (
          <p className="no-product">No products found</p>
        )}

        {products.map((item, index) => (
          <div key={item._id || index} className="fade-in">
            <ProductItem
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
                setProductList((prev) =>
                  prev.filter((p) => p._id !== deletedId)
                );
              }}
            />
          </div>
        ))}
      </div>

      <div className="add-product-btn">
        <button onClick={handleAddProduct}>
          Add Product <img src={assets.plus_icon} alt="+" />
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;
