import React, { useContext, useEffect, useState } from "react";
import "./ProductDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";

/* =============== ProductDisplay Component =============== */
const ProductDisplay = ({
  category,
  showPoster = false,
  limit = null,
  infiniteScroll = false,
  products: propsProducts = null,
}) => {
  const { productList, homepageAssets } = useContext(StoreContext);

  /* =============== Determine Products Source =============== */
  const sourceProducts = Array.isArray(propsProducts)
    ? propsProducts
    : Array.isArray(productList)
    ? productList
    : [];

  /* =============== Filter by Category =============== */
  const filteredByCategory =
    category && category !== "All"
      ? sourceProducts.filter(
          (item) => (item.category || "").toString() === category.toString()
        )
      : sourceProducts;

  /* =============== Initial Visible Count =============== */
  const getInitialCount = () => {
    if (infiniteScroll) return window.innerWidth <= 500 ? 12 : 20;
    return limit || 20;
  };
  const [visibleCount, setVisibleCount] = useState(getInitialCount);

  /* =============== Column Calculation =============== */
  const [columns, setColumns] = useState(4);

  /* =============== Loading State =============== */
  const [loading, setLoading] = useState(false);

  /* =============== Update Columns on Resize =============== */
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth <= 500) setColumns(2);
      else if (window.innerWidth <= 1024) setColumns(3);
      else if (window.innerWidth <= 1288) setColumns(4);
      else setColumns(5);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  /* =============== Adjust Visible Count on Resize =============== */
  useEffect(() => {
    const updateCount = () => {
      if (infiniteScroll) {
        setVisibleCount((prev) => {
          if (window.innerWidth <= 500 && prev < 12) return 12;
          if (window.innerWidth > 500 && prev < 20) return 20;
          return prev;
        });
      } else if (limit) {
        if (window.innerWidth <= 500) setVisibleCount(12);
        else if (window.innerWidth <= 768) setVisibleCount(15);
        else if (window.innerWidth <= 1020) setVisibleCount(18);
        else setVisibleCount(limit);
      }
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [limit, infiniteScroll]);

  /* =============== Infinite Scroll Logic =============== */
  useEffect(() => {
    if (!infiniteScroll) return;
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredByCategory.length
        ) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(
                prev + (window.innerWidth <= 500 ? 6 : 10),
                filteredByCategory.length
              )
            );
            setLoading(false);
          }, 800);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [infiniteScroll, filteredByCategory.length, visibleCount]);

  /* =============== Poster Logic =============== */
  const posterIndex = columns * 2 - 1;
  const productsToShow = filteredByCategory.slice(0, visibleCount);

  /* =============== Skeleton Display if Loading =============== */
  const showSkeleton = sourceProducts.length === 0 || loading;

  return (
    <div className="product-display" id="product-display">
      <h2>Top Selling Products</h2>

      <div className="product-display-list">
        {/* =============== Poster Skeleton / Real Poster =============== */}
        {showPoster &&
          (showSkeleton ? (
            <div className="product-poster">
              <div className="skeleton skeleton-poster"></div>
            </div>
          ) : null)}

        {/* =============== Product Items =============== */}
        {showSkeleton
          ? [...Array(columns * 2)].map((_, i) => (
              <div key={i} className="product-item skeleton-item">
                <div className="skeleton skeleton-img"></div>
                <div className="skeleton-text-content">
                  <div className="skeleton skeleton-text short"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-price"></div>
                  <div className="skeleton skeleton-btn"></div>
                </div>
              </div>
            ))
          : productsToShow.map((item, index) => (
              <React.Fragment key={item._id || index}>
                <div className="fade-in">
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                    discount={item.discount}
                    regular_price={item.regular_price}
                    category={item.category}
                    color={item.color}
                  />
                </div>

                {/* =============== Poster Display =============== */}
                {showPoster && index === posterIndex && (
                  <div className="product-poster">
                    <img src={homepageAssets.homepage_poster} alt="Poster" />
                  </div>
                )}
              </React.Fragment>
            ))}

        {/* =============== Infinite Scroll Sentinel =============== */}
        {infiniteScroll && <div id="scroll-sentinel" />}
      </div>
    </div>
  );
};

export default ProductDisplay;
