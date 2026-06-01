import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import ExploreCategory from "../../components/ExploreCategory/ExploreCategory";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import Search from "../../components/Search/Search";
import "./Shop.css";

const Shop = () => {
  const [category, setCategory] = useState("All"); // Selected category state

  const { productList } = useContext(StoreContext); // Access product list from context
  const location = useLocation(); // Get URL params
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q")?.toLowerCase() || ""; // Search term from URL

  /* ==================== Filter Products ==================== */
  // Filter products by name OR search_keyword array
  const filteredProducts = searchTerm
    ? productList.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(searchTerm);

        const keywordMatch = Array.isArray(p.search_keyword)
          ? p.search_keyword.some((kw) => kw.toLowerCase().includes(searchTerm))
          : false;

        return nameMatch || keywordMatch;
      })
    : productList;

  return (
    <div className="shop-product">
      {/* ==================== Search Bar ==================== */}
      <div className="search-resp">
        <Search />
      </div>

      {/* ==================== Category Filter ==================== */}
      <ExploreCategory category={category} setCategory={setCategory} />

      {/* ==================== Product Display ==================== */}
      {filteredProducts.length > 0 ? (
        <ProductDisplay
          products={filteredProducts}
          category={category}
          showPoster={false}
          infiniteScroll={true}
        />
      ) : (
        <p className="no-products">No products found</p>
      )}
    </div>
  );
};

export default Shop;
