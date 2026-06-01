import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Review from "../Review/Review";
import Footer from "../Footer/Footer";
import LoginPopup from "../LoginPopup/LoginPopup";

const Layout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  /* ==================== Scroll to Top on Route Change ==================== */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" /* use "smooth" if you want animation */,
    });
  }, [location.pathname]);

  return (
    <>
      {/* ==================== Login Popup ==================== */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {/* ==================== Navbar ==================== */}
      <Navbar setShowLogin={setShowLogin} />

      {/* ==================== Main Layout ==================== */}
      <div className="layout">
        <main>
          <Outlet />{" "}
          {/* Active page (Home, Shop, Offers, ProductDetails) goes here */}
        </main>

        {/* ==================== Conditional Render Placeholder ==================== */}
        {location.pathname.startsWith("/product/") ? null : ""}
      </div>

      {/* ==================== Review & Footer ==================== */}
      <Review />
      <Footer />
    </>
  );
};

export default Layout;
