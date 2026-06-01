import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidenav from "../Sidenav/Sidenav";
import AdminLoginPopup from "../AdminLoginPopup/AdminLoginPopup";
import { StoreContext } from "../../context/StoreContext";

const Layout = () => {
  /* ==================== State ==================== */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { url } = useContext(StoreContext);
  const location = useLocation(); //  Track current route

  /* ==================== Scroll to top on route change ==================== */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // use "smooth" for animated scroll
    });
  }, [location.pathname]);

  /* ==================== Check admin authentication ==================== */
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.get(`${url}/api/admin/dashboard`, {
          headers: { token }, // direct token
        });
        setIsAuthenticated(true);
      } catch (err) {
        sessionStorage.removeItem("adminToken");
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyToken();
  }, [url]);

  /* ==================== Handle successful login ==================== */
  const handleLoginSuccess = (tokenFromServer) => {
    setIsAuthenticated(true);
    sessionStorage.setItem("adminToken", tokenFromServer);
  };

  /* ==================== Loading state ==================== */
  /* ==================== Loading state ==================== */
  if (checkingAuth) {
    return (
      <div className="auth-checking-screen">
        <div className="auth-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  /* ==================== Show login popup if not authenticated ==================== */
  if (!isAuthenticated) {
    return <AdminLoginPopup onLoginSuccess={handleLoginSuccess} />;
  }

  /* ==================== Main layout ==================== */
  return (
    <>
      <Navbar />
      <Sidenav />
      <div className="layout">
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;

// For MObile testing

// import React, { useEffect, useContext } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import "./Layout.css";
// import Navbar from "../Navbar/Navbar";
// import Sidenav from "../Sidenav/Sidenav";
// import { StoreContext } from "../../context/StoreContext";

// const Layout = () => {
//   const { url } = useContext(StoreContext);
//   const location = useLocation();

//   // Scroll to top on route change
//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "instant",
//     });
//   }, [location.pathname]);

//   return (
//     <>
//       <Navbar />
//       <Sidenav />
//       <div className="layout">
//         <main>
//           <Outlet />
//         </main>
//       </div>
//     </>
//   );
// };

// export default Layout;
