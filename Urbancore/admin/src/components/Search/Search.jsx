import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Search.css";
import { assets } from "../../assets/assets";

const Search = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState(""); // track user input
  const navigate = useNavigate();
  const location = useLocation();

  // ==================== Handle Search Submission ====================
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    // Navigate depending on current route
    if (location.pathname !== "/products") {
      navigate(`/shop?q=${encodeURIComponent(trimmedTerm)}`);
    } else {
      navigate(`?q=${encodeURIComponent(trimmedTerm)}`);
    }

    setSearchTerm(""); // reset input
    onClose(); // close search overlay
  };

  return (
    <div className="search-overlay">
      <div className="search-box">

        {/* ==================== Search Form ==================== */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="search"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button type="submit" className="search-btn-resp">
            <img src={assets.search_icon} alt="Search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;
