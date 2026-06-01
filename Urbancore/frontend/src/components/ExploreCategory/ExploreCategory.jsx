import React, { useContext } from "react";
import "./ExploreCategory.css";
import { StoreContext } from "../../context/StoreContext";

const ExploreCategory = ({ category, setCategory }) => {
  // Access category list from global store
  const { categoryList } = useContext(StoreContext);

  // Determine if data is still loading
  const isLoading = !categoryList || categoryList.length === 0;

  return (
    <div className="explore-category" id="explore-category">
      <div className="explore-category-list">
        {isLoading
          ? // Display skeleton placeholders while loading
            [...Array(8)].map((_, i) => (
              <div key={i} className="explore-category-list-item">
                <div className="skeleton skeleton-img"></div>
                <div className="skeleton skeleton-text short"></div>
              </div>
            ))
          : // Render actual category items
            categoryList.map((item, index) => (
              <div
                key={index}
                className="explore-category-list-item"
                onClick={() =>
                  setCategory((prev) =>
                    prev === item.category_name ? "All" : item.category_name
                  )
                }
              >
                {/* Category image: add 'active' class if selected */}
                <img
                  src={item.category_image}
                  alt={item.category_name}
                  className={category === item.category_name ? "active" : ""}
                />
                {/* Category name */}
                <p>{item.category_name}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ExploreCategory;
