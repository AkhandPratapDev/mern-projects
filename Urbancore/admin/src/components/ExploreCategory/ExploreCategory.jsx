import React, { useContext, useState } from "react";
import "./ExploreCategory.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import {
  successToast,
  warningToast,
  errorToast,
  confirmToast,
} from "../../utils/toast";

const ExploreCategory = ({ category, setCategory }) => {
  /* ==================== Context ==================== */
  const { categoryList, removeCategory, addCategory } =
    useContext(StoreContext);

  /* ==================== Local State ==================== */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  /* ==================== Delete Category ==================== */
  const handleDelete = async (id) => {
    const userConfirmed = await confirmToast(
      "Are you sure you want to delete this category?"
    );
    if (userConfirmed) {
      await removeCategory(id);
      successToast("Category deleted successfully!");
    } else {
      warningToast("Category deletion cancelled.");
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  /* ==================== Add Category ==================== */
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName || !newCategoryImage) {
      errorToast("Please provide both name and image!");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", capitalizeFirstLetter(newCategoryName));
    formData.append("category_image", newCategoryImage);
    await addCategory(formData);

    setNewCategoryName("");
    setNewCategoryImage(null);
    setIsModalOpen(false);
  };

  /* ==================== Image Validation ==================== */
  const handleImageValidation = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // --- Step 1: Validate file size (max 2MB) ---
    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      errorToast(" Image size must not exceed 2MB.");
      e.target.value = "";
      return;
    }

    // --- Step 2: Validate image dimensions (must be 150x150) ---
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;

      if (width !== 150 || height !== 150) {
        errorToast(` Image dimensions must be 150×150px`);
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
        return;
      }

      // ✅ Valid image — save in state
      setNewCategoryImage(file);
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      errorToast("Failed to read image file. Please upload a valid image.");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  return (
    <div className="explore-category" id="explore-category">
      {/* ==================== Category Section ==================== */}
      <h2>Category</h2>

      <div className="explore-category-list">
        {categoryList?.map((item) => (
          <div
            key={item._id}
            className="explore-category-list-item"
            onClick={() =>
              setCategory((prev) =>
                prev === item.category_name ? "All" : item.category_name
              )
            }
          >
            <img
              className={category === item.category_name ? "active" : ""}
              src={item.category_image}
              alt={item.category_name}
            />
            <p>{item.category_name}</p>

            {/* ==================== Delete Button ==================== */}
            <div
              className="delete-category"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item._id);
              }}
            >
              <img
                src={assets.delete_icon}
                alt="Delete"
                className="delete_icon"
              />
            </div>
          </div>
        ))}

        {/* ==================== Add New Category ==================== */}
        <div
          className="explore-category-list-item add-category"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            className="add-category-img"
            src={assets.add_category_icon}
            alt="Add Category"
          />
          <p>Add New</p>
        </div>
      </div>

      {/* ==================== Add Category Modal ==================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <label>
                Category Name:
                <input
                  placeholder="Enter category name..."
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </label>

              <label className="custom-file-upload">
                {newCategoryImage ? (
                  <img
                    src={URL.createObjectURL(newCategoryImage)}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span className="plus-icon">+</span>
                    <p>Add Image</p>
                    <p>150px × 150px</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageValidation}
                  required
                />
              </label>

              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreCategory;
