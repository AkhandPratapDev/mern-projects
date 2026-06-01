import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreCategory from "../../components/ExploreCategory/ExploreCategory";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import LastProductDisplay from "../../components/LastProductDisplay/LastProductDisplay";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home-page">
      {/* =============== Header Section =============== */}
      <Header />

      {/* =============== Category Filter =============== */}
      <ExploreCategory category={category} setCategory={setCategory} />

      {/* =============== Product List (Filtered by Category) =============== */}
      <ProductDisplay category={category} showPoster={true} limit={20} />

      {/* =============== Last Products / Special Deals =============== */}
      <LastProductDisplay />
    </div>
  );
};

export default Home;
