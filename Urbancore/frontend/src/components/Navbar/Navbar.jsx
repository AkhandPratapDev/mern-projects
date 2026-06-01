import React, { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import ContactFormPopup from "../ContactFormPopup/ContactFormPopup";

const Navbar = ({ setShowLogin }) => {
  /* ==================== Component State ==================== */
  const [menu, setMenu] = useState("home");
  const [openSidenav, setOpenSidenav] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactPopup, setShowContactPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { cart, token, avatar } = useContext(StoreContext);

  /* ==================== Cart Count Calculation ==================== */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ==================== Update Active Menu on Route Change ==================== */
  useEffect(() => {
    if (location.pathname === "/") setMenu("home");
    else if (location.pathname.startsWith("/shop")) setMenu("shop");
    else if (location.pathname.startsWith("/offers")) setMenu("offers");
    else if (location.pathname.startsWith("/contact")) setMenu("contact");
  }, [location.pathname]);

  /* ==================== Toggle Responsive Sidenav ==================== */
  const toggleSidenavbar = () => setOpenSidenav(!openSidenav);

  /* ==================== Search Handler ==================== */
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    if (location.pathname !== "/shop") {
      navigate(`/shop?q=${encodeURIComponent(trimmedTerm)}`);
    } else {
      navigate(`?q=${encodeURIComponent(trimmedTerm)}`);
    }

    setSearchTerm("");
  };

  return (
    /* ==================== Navbar Container ==================== */
    <div
      className={`navbar ${
        location.pathname === "/shop" ? "navbar--shop" : ""
      }`}
    >
      <div className="navbar-container">
        {/* ==================== Logo ==================== */}
        <img src={assets.logo} alt="logo" className="logo" />

        {/* ==================== Main Nav Menu ==================== */}
        <ul className="navbar-menu">
          <Link to="/">
            <li className={menu === "home" ? "active" : ""}>Home</li>
          </Link>
          <Link to="/shop">
            <li className={menu === "shop" ? "active" : ""}>Shop</li>
          </Link>
          <Link to="/offers">
            <li className={menu === "offers" ? "active" : ""}>Offers</li>
          </Link>
          <li
            onClick={() => {
              setMenu("contact");
              setShowContactPopup(true);
            }}
            className={menu === "contact" ? "active" : ""}
          >
            Contact
          </li>
        </ul>

        {/* ==================== Right Section ==================== */}
        <div className="navbar-right">
          {/* --- Search Bar --- */}
          <form onSubmit={handleSearch} className="nav-search-icon">
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

          {/* --- Cart Icon --- */}
          <div className="navbar-bag-icon">
            <Link to="/cart">
              <img src={assets.shopping_bag_icon} alt="bag-icon" />
              {cartCount > 0 && <div className="bag-dot">{cartCount}</div>}
            </Link>
          </div>

          {/* --- User Icon / Profile --- */}
          {!token ? (
            <div
              onClick={() => setShowLogin(true)}
              className="navbar-user-icon"
            >
              <img src={assets.user_icon} alt="user-icon" />
            </div>
          ) : (
            <Link to="/account">
              <div className="navbar-login-user-icon">
                <img src={avatar} alt="profile" />
              </div>
            </Link>
          )}
        </div>

        {/* ==================== Responsive Side Navbar ==================== */}
        <div className="responsive-navbar-right">
          <div className="side-navbar">
            <img
              src={assets.menu_icon}
              alt="bar"
              onClick={toggleSidenavbar}
              className="open-sidenav"
            />
            <div className={`side-menu ${openSidenav ? "open" : ""}`}>
              <div className="side-navbar-top">
                <img
                  src={assets.side_nav_logo}
                  alt=""
                  className="sidenav-logo"
                />
                <button onClick={toggleSidenavbar} className="close-sidenav">
                  ✖
                </button>
              </div>
              <ul className="side-navbar-menu">
                <li
                  onClick={() => {
                    toggleSidenavbar();
                    if (token) navigate("/account");
                    else setShowLogin(true);
                  }}
                >
                  <img
                    src={token ? avatar : assets.user_wt_icon}
                    alt="avatar"
                    className="side-avatar"
                  />{" "}
                  My Account
                </li>

                <Link to="/shop" onClick={toggleSidenavbar}>
                  <li>
                    <img src={assets.shop_bag_wt_icon} alt="" /> Products
                  </li>
                </Link>
                <Link to="/offers" onClick={toggleSidenavbar}>
                  <li>
                    <img src={assets.offer_wt_icon} alt="" /> Offers
                  </li>
                </Link>
                <Link to="/cart" onClick={toggleSidenavbar}>
                  <li>
                    <img src={assets.shopping_bag_wt_icon} alt="bag-icon" />{" "}
                    Cart
                  </li>
                </Link>
                <li
                  onClick={() => {
                    toggleSidenavbar();
                    setMenu("contact");
                    setShowContactPopup(true);
                  }}
                >
                  <img src={assets.contact_msg_wt_icon} alt="" /> Contact
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== Bottom Navbar (Mobile) ==================== */}
      <div className="navbar-bottom">
        <Link to="/">
          <div className="nav-home-icon">
            <img src={assets.home_icon} alt="home-icon" />
          </div>
        </Link>
        <Link to="/shop">
          <div className="navbar-search-icon">
            <img src={assets.search_icon} alt="search-icon" />
          </div>
        </Link>
        <Link to="/cart">
          <div className="navbar-bag-icon">
            <img src={assets.shopping_bag_icon} alt="bag-icon" />
            {cartCount > 0 && <div className="bag-dot">{cartCount}</div>}
          </div>
        </Link>

        {!token ? (
          <div onClick={() => setShowLogin(true)} className="navbar-user-icon">
            <img src={assets.user_icon} alt="user-icon" />
          </div>
        ) : (
          <Link to="/account">
            <div className="navbar-user-icon">
              <img src={avatar} alt="profile" />
            </div>
          </Link>
        )}
      </div>

      {/* ==================== Contact Popup ==================== */}
      {showContactPopup && (
        <ContactFormPopup onClose={() => setShowContactPopup(false)} />
      )}
    </div>
  );
};

export default Navbar;
