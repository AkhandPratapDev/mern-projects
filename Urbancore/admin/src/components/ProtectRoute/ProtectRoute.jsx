import React from "react";
import AdminLoginPopup from "./AdminLoginPopup";

const ProtectedRoute = ({ isAdminLoggedIn, onLoginSuccess, children }) => {
  if (!isAdminLoggedIn) {
    return <AdminLoginPopup onLoginSuccess={onLoginSuccess} />;
  }
  return children;
};

export default ProtectedRoute;
