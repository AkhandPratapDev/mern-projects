import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ProductManagement.css";

import ExploreCategory from "../../components/ExploreCategory/ExploreCategory";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import Search from "../../components/Search/Search";
import { StoreContext } from "../../context/StoreContext";

const ProductManagement = () => {
  const [category, setCategory] = useState("All");
  const location = useLocation();
  const { productList } = useContext(StoreContext);

  // Get search term from query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q")?.toLowerCase() || "";

  // ==================== Filter products by category + search ====================
  const filteredProducts = productList.filter((p) => {
    // Match category
    const categoryMatch =
      category === "All" ||
      (p.category &&
        p.category.toLowerCase().trim() === category.toLowerCase().trim());

    // Match product name
    const nameMatch = searchTerm
      ? p.name?.toLowerCase().includes(searchTerm)
      : true;

    // Match keywords
    const keywordMatch = searchTerm
      ? Array.isArray(p.search_keyword) &&
        p.search_keyword.some((kw) => kw.toLowerCase().includes(searchTerm))
      : true;

    return categoryMatch && (nameMatch || keywordMatch);
  });

  return (
    <div className="product-management">
      {/* ==================== Page Title ==================== */}
      <h2 className="page-title">👕 Product Management</h2>

      {/* ==================== Search Bar ==================== */}
      <div className="search-resp">
        <Search />
      </div>

      {/* ==================== Category Selector ==================== */}
      <ExploreCategory category={category} setCategory={setCategory} />

      {/* ==================== Product Display ==================== */}
      <ProductDisplay products={filteredProducts} />
    </div>
  );
};

export default ProductManagement;
