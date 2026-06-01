import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import UserManagement from "./pages/UserManagement/UserManagement";
import HomePage from "./pages/HomePage/HomePage";
import OffersPage from "./pages/OffersPage/OffersPage";
import AdminSettings from "./pages/AdminSettings/AdminSettings";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import OfferDetail from "./components/OfferDetail/OfferDetail";
import OrderDetail from "./components/OrderDetail/OrderDetail";
import LastProductDetail from "./components/LastProductDetail/LastProductDetail";
import UserOrders from "./pages/UserOrders/UserOrders";
import ContactMessages from "./components/ContactMessages/ContactMessages";
import AdminPolicies from "./components/AdminPolicies/AdminPolicies";
import ContactInfoAdmin from "./components//ContactInfoAdmin/ContactInfoAdmin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/offerspage" element={<OffersPage />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="lastproduct/:id" element={<LastProductDetail />} />{" "}
        <Route path="offerProduct/:id" element={<OfferDetail />} />
        <Route path="order/:id" element={<OrderDetail />} />
        <Route path="/user-orders/:userId" element={<UserOrders />} />
        <Route path="/messages" element={<ContactMessages />} />
        <Route path="/policies" element={<AdminPolicies />} />
        <Route path="/contact-info" element={<ContactInfoAdmin />} />
      </Route>
    </Routes>
  );
};

export default App;
