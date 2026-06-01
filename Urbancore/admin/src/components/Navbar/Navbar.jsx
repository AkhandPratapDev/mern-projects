import React, { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { hasNewOrders, orderList, unseenCount, url, token, fetchMessages } =
    useContext(StoreContext);

  /* ==================== Handle Search ==================== */
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    if (location.pathname !== "/products") {
      navigate(`/products?q=${encodeURIComponent(trimmedTerm)}`);
    } else {
      navigate(`?q=${encodeURIComponent(trimmedTerm)}`);
    }

    setSearchTerm("");
  };

  /* ==================== Fetch Unseen Messages Periodically ==================== */
  useEffect(() => {
    fetchMessages(); // fetch unseenCount on mount
    const interval = setInterval(fetchMessages, 30000); // every 30s
    return () => clearInterval(interval);
  }, [url, token]);

  return (
    <div className="admin-navbar">
      <div className="navbar-container">
        {/* ==================== Left - Logo ==================== */}
        <div className="navbar-logo">
          <img src={assets.logo} alt="" className="logo" />
        </div>

        {/* ==================== Center - Search ==================== */}
        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="search"
            className="search-bar"
            placeholder="Search product......."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <img src={assets.search_icon} alt="search" />
          </button>
        </form>

        {/* ==================== Right - Icons ==================== */}
        <div className="navbar-right">
          {/* Responsive Search Icon */}
          <div className="search-resp">
            <Link to="/products">
              <img src={assets.search_icon} alt="" />
            </Link>
          </div>

          {/* Notification / Bell */}
          <div className="notification" style={{ position: "relative" }}>
            <Link to="/orders">
              <img src={assets.bell_icon} alt="Notifications" />
              {hasNewOrders && orderList.length > 0 && (
                <span className="red-dot" />
              )}
            </Link>
          </div>

          {/* Messages */}
          <div className="messages" style={{ position: "relative" }}>
            <Link to="/messages">
              <img src={assets.messages_icon} alt="Messages" />
              {unseenCount > 0 && <span className="msg-dot" />}
            </Link>
          </div>

          {/* Admin User */}
          <div className="admin-user">
            <Link to="/settings">
              <img src={assets.user_icon} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
