import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Offers from "./pages/Offers/Offers";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Account from "./pages/Account/Account";
import MyOrder from "./pages/MyOrder/MyOrder";
import TrackOrder from "./components/TrackOrder/TrackOrder";
import OfferDetail from "./components/OfferDetail/OfferDetail";
import LastProductDetail from "./components/LastProducDetail/LastProductDetail";
import Policies from "./components/Policies/Policies";
import Verify from "./pages/Verify/Verify";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const App = () => {
  
  return (
    <Routes>
      {/* ==================== Main Layout Wrapper ==================== */}
      <Route path="/" element={<Layout />}>
        {/* ==================== Home Page ==================== */}
        <Route index element={<Home />} />

        {/* ==================== Shop Page ==================== */}
        <Route path="shop" element={<Shop />} />

        {/* ==================== Offers Page ==================== */}
        <Route path="offers" element={<Offers />} />

        {/* ==================== Offer Product Details ==================== */}
        <Route path="offerProduct/:id" element={<OfferDetail />} />

        {/* ==================== Cart Page ==================== */}
        <Route path="cart" element={<Cart />} />

        {/* ==================== Product Details Page ==================== */}
        <Route path="product/:id" element={<ProductDetail />} />

        {/* ==================== Place Order Page ==================== */}
        <Route path="order/:id" element={<PlaceOrder />} />

        {/* ==================== My Orders Page ==================== */}
        <Route path="orders" element={<MyOrder />} />

        {/* ==================== Account Page ==================== */}
        <Route path="account" element={<Account />} />

        {/* ==================== Track Order Page ==================== */}
        <Route path="/trackOrder/:orderId" element={<TrackOrder />} />

        {/* ==================== Last Product Details Page ==================== */}
        <Route path="lastproduct/:id" element={<LastProductDetail />} />

        {/* ==================== Policies Page ==================== */}
        <Route path="verify" element={<Verify />} />
        <Route path="policies" element={<Policies />} />
        <Route path="login" element={<LoginPopup />} />
      
      </Route>
    </Routes>
  );
};

export default App;
