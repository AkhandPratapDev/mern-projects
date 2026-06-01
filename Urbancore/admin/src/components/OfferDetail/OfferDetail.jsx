import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OfferDetail.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import CustomDropdown from "../CoustomDropdown/CoustomDropdown";
import {
  successToast,
  errorToast,
  warningToast,
  confirmToast,
} from "../../utils/toast";

const OfferDetail = () => {
  const { id } = useParams();
  const isNewProduct = id === "new";

  const {
    url,
    categoryList,
    offerProductList,
    addOfferProduct,
    removeOfferProduct,
    fetchOfferProducts,
    updateOfferProduct,
  } = useContext(StoreContext);

  /* ==================== Default New Product ==================== */
  const defaultNewProduct = {
    _id: "new",
    name: "Sample New Product",
    product_detail: "Amazing New Product",
    description: "This is a new product description.",
    price: 999,
    regular_price: 1499,
    discount: 30,
    sold_last_week: 12,
    color: "Red",
    sizes: ["S", "M", "L", "XL", "XXL"],
    expected_delivery: [3, 7],
    image: assets.add_img_icon,
    product_image_1: assets.add_img_icon,
    product_image_2: assets.add_img_icon,
    product_image_3: assets.add_img_icon,
    category: "New Category",
    search_keyword: [],
  };

  const allSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const [product, setProduct] = useState(
    isNewProduct ? defaultNewProduct : null
  );
  const [mainImage, setMainImage] = useState(product?.image);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const fileInputRef = useRef(null);
  const [editData, setEditData] = useState({ ...defaultNewProduct });
  const [quantities, setQuantities] = useState({});
  const [searchInput, setSearchInput] = useState(
    editData.search_keyword.join(", ")
  );

  const navigate = useNavigate();

  /* ==================== Fetch Existing Product ==================== */
  useEffect(() => {
    if (!isNewProduct) {
      const found = offerProductList.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setEditData(found);
        setMainImage(found.image);
        setSelectedSizes(found.sizes || []);
        setQuantities(found.quantities || {}); // <-- updated
      }
    }
  }, [id, isNewProduct, offerProductList, url]);

  /* ==================== Handle Window Resize ==================== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product && !isNewProduct) {
    return (
      <div className="product-detail not-found">
        <h2>Product not found!</h2>
      </div>
    );
  }

  /* ==================== Dropdown Toggle ==================== */
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  /* ==================== Thumbnail Images ==================== */
  const thumbnails = [
    editData.image &&
      (editData.image instanceof File
        ? URL.createObjectURL(editData.image)
        : editData.image),
    editData.product_image_1 &&
      (editData.product_image_1 instanceof File
        ? URL.createObjectURL(editData.product_image_1)
        : editData.product_image_1),
    editData.product_image_2 &&
      (editData.product_image_2 instanceof File
        ? URL.createObjectURL(editData.product_image_2)
        : editData.product_image_2),
    editData.product_image_3 &&
      (editData.product_image_3 instanceof File
        ? URL.createObjectURL(editData.product_image_3)
        : editData.product_image_3),
  ].filter(Boolean);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  const handleImageClick = (imgKey) => {
    fileInputRef.current.dataset.key = imgKey;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const imgKey = fileInputRef.current.dataset.key;

    if (!file || !imgKey) return;

    // --- Step 1: Validate file size ---
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      errorToast(" Image size must not exceed 2MB.");
      e.target.value = "";
      return;
    }

    // --- Step 2: Validate image dimensions ---
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== 245 || img.height !== 310) {
        errorToast(` Image dimensions must be 245×310px`);
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
        return;
      }

      // --- Step 3: Valid image → update preview and state ---
      setEditData((prev) => ({
        ...prev,
        [imgKey]: file, // keep file in state
      }));

      // Update main image preview if this is the main image
      if (imgKey === "image") {
        setMainImage(objectUrl);
      } else {
        // Force thumbnails to refresh by re-rendering
        setEditData((prev) => ({ ...prev }));
      }

      // Do NOT revoke object URL here — needed for preview
    };

    img.onerror = () => {
      errorToast(" Failed to read image file. Please try again.");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  /* ==================== Handle Text Change ==================== */
  const handleTextChange = (field, e) => {
    let value = e.target.innerText.trim();

    if (["price", "regular_price", "discount"].includes(field)) {
      value = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;

      setEditData((prev) => {
        let price = prev.price;
        let regular_price = prev.regular_price;
        let discount = prev.discount;

        if (field === "price") {
          price = value;
          if (regular_price && regular_price > 0) {
            discount = Math.round(
              ((regular_price - price) / regular_price) * 100
            );
          }
        } else if (field === "regular_price") {
          regular_price = value;
          if (price && regular_price > 0) {
            discount = Math.round(
              ((regular_price - price) / regular_price) * 100
            );
          }
        } else if (field === "discount") {
          discount = value;
          if (regular_price && discount >= 0) {
            price = Math.round(
              regular_price - (regular_price * discount) / 100
            );
          }
        }

        return { ...prev, price, regular_price, discount };
      });

      return;
    }

    setEditData({ ...editData, [field]: value });
  };

  /* ==================== Toggle Size ==================== */
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  /* ==================== Save Changes ==================== */
  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("product_detail", editData.product_detail);
      formData.append("description", editData.description);
      formData.append("price", editData.price);
      formData.append("regular_price", editData.regular_price);
      formData.append("discount", parseFloat(editData.discount));
      formData.append("sold_last_week", editData.sold_last_week);
      formData.append("color", editData.color);
      if (selectedSizes.length)
        formData.append("sizes", JSON.stringify(selectedSizes));
      if (editData.expected_delivery)
        formData.append(
          "expected_delivery",
          JSON.stringify(editData.expected_delivery)
        );
      formData.append("category", editData.category);
      formData.append(
        "search_keyword",
        JSON.stringify(editData.search_keyword || [])
      );
      formData.append("quantities", JSON.stringify(quantities));

      if (editData.image instanceof File)
        formData.append("image", editData.image);
      if (editData.product_image_1 instanceof File)
        formData.append("product_image_1", editData.product_image_1);
      if (editData.product_image_2 instanceof File)
        formData.append("product_image_2", editData.product_image_2);
      if (editData.product_image_3 instanceof File)
        formData.append("product_image_3", editData.product_image_3);

      if (isNewProduct) {
        await addOfferProduct(formData);
        successToast(" Product added successfully!");
      } else {
        await updateOfferProduct(product._id, formData);
        successToast(" Product updated successfully!");
      }

      fetchOfferProducts();
      navigate("/offerspage");
    } catch (err) {

      errorToast("Failed to save changes.");
    }
  };

  /* ==================== Discard Changes ==================== */
  const handleDiscardChanges = () => {
    setEditData(product);
    setMainImage(product.image);
    setSelectedSizes(product.sizes || []);
    setSearchInput(product.search_keyword?.join(", ") || "");
    setQuantities(product.quantities || {});
  };

  /* ==================== Delete Product ==================== */
  // Delete product with double-confirm
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      // Ask for confirmation
      const confirmed = await confirmToast(
        "Are you sure you want to delete this product?"
      );
      if (!confirmed) return;

      // Delete product
      await removeOfferProduct(id);
      successToast(" Product deleted successfully!");

      // Navigate to /products after deletion
      navigate("/offerspage");
    } catch (err) {
      errorToast(" Failed to delete product.");
    }
  };

  /* ==================== Render JSX ==================== */
  return (
    <div className="product-detail">
      {/* ==================== Left: Images ==================== */}
      <div className="product-detail-images">
        {isMobile ? (
          <>
            <div
              className="thumbnail-row carousel-mode"
              ref={carouselRef}
              onScroll={handleScroll}
            >
              {thumbnails.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  className={`thumb ${activeIndex === index ? "active" : ""}`}
                  onClick={() =>
                    handleImageClick(
                      index === 0 ? "image" : `product_image_${index}`
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <div className="dots">
              {thumbnails.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === activeIndex ? "active" : ""}`}
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollTo({
                        left: i * carouselRef.current.offsetWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                ></span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="thumbnail-row">
              {thumbnails.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  onClick={() =>
                    handleImageClick(
                      index === 0 ? "image" : `product_image_${index}`
                    )
                  }
                  className={`thumb ${mainImage === img ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                />
              ))}

              {thumbnails.length < 4 && (
                <div
                  className="thumb add-image-box"
                  onClick={() =>
                    handleImageClick(`product_image_${thumbnails.length}`)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ccc",
                    cursor: "pointer",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#888",
                  }}
                >
                  +
                </div>
              )}
            </div>

            <img
              src={mainImage}
              alt={editData.name}
              className="main-image"
              onClick={() => handleImageClick("image")}
              style={{ cursor: "pointer" }}
            />
          </>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* ==================== Right: Info ==================== */}
      <div className="product-detail-info">
        <h2
          className="product-title"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleTextChange("product_detail", e)}
        >
          {editData.product_detail}
        </h2>
        <h3
          className="product-name"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleTextChange("name", e)}
        >
          {editData.name}
        </h3>

        {/* ==================== Price Section ==================== */}
        <div className="product-price-section">
          <p>
            <span className="current-price">₹</span>
            <span
              className="current-price"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("price", e)}
            >
              {editData.price}
            </span>
          </p>
          <p>
            <span className="old-price">₹</span>
            <span
              className="old-price"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("regular_price", e)}
            >
              {editData.regular_price}
            </span>
          </p>
          <p>
            <span
              className="discount"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("discount", e)}
            >
              {editData.discount}
            </span>{" "}
            <span className="discount">% OFF</span>
          </p>
        </div>

        <p className="offer-note">
          🚀 {editData.sold_last_week || 0} people bought this in last 7 days
        </p>

        {/* ==================== Sizes ==================== */}
        <div className="product-sizes">
          <span className="label">Sizes:</span>
          {allSizes.map((size) => (
            <button
              key={size}
              className={`size-btn ${
                selectedSizes.includes(size) ? "active" : ""
              }`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {/* ==================== Category Dropdown ==================== */}
        <div className="product-category">
          <span className="label">Category:</span>
          <CustomDropdown
            options={categoryList?.map((c) => c.category_name) || []}
            value={editData.category}
            onChange={(val) => setEditData({ ...editData, category: val })}
            placeholder="Select Category"
          />
        </div>

        {/* ==================== Search Keywords ==================== */}
        <div className="product-search-keyword">
          <span className="label">Search Keywords:</span>
          <div
            className="keyword-input-container"
            onClick={() => document.getElementById("keywordInput").focus()}
          >
            {editData.search_keyword.map((keyword, index) => (
              <div key={index} className="keyword-tag">
                {keyword}
                <span
                  className="remove-tag"
                  onClick={() =>
                    setEditData({
                      ...editData,
                      search_keyword: editData.search_keyword.filter(
                        (k, i) => i !== index
                      ),
                    })
                  }
                >
                  ×
                </span>
              </div>
            ))}

            <input
              id="keywordInput"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "," || e.key === "Enter") {
                  e.preventDefault();
                  const newTag = searchInput.trim().replace(/,$/, "");
                  if (newTag && !editData.search_keyword.includes(newTag)) {
                    setEditData({
                      ...editData,
                      search_keyword: [...editData.search_keyword, newTag],
                    });
                  }
                  setSearchInput("");
                } else if (
                  e.key === "Backspace" &&
                  !searchInput &&
                  editData.search_keyword.length
                ) {
                  const newKeywords = [...editData.search_keyword];
                  newKeywords.pop();
                  setEditData({ ...editData, search_keyword: newKeywords });
                }
              }}
              placeholder="Type a keyword and press comma or Enter"
            />
          </div>
        </div>

        {/* ==================== Color & Quantity ==================== */}
        <div className="product-color-quantity-details">
          <div className="quantity-control">
            <span className="label">Quantity: </span>

            <CustomDropdown
              placeholder="Select quantities"
              value={
                selectedSizes.length === 0
                  ? "No sizes selected"
                  : `${selectedSizes.length} size${
                      selectedSizes.length > 1 ? "s" : ""
                    } selected`
              }
            >
              <div className="quantity-dropdown-body">
                {selectedSizes.map((size) => (
                  <div key={size} className="size-quantity-row">
                    <span className="size-label">{size}</span>
                    <div className="quantity-btns">
                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [size]: Math.max((prev[size] || 0) - 1, 0),
                          }))
                        }
                      >
                        −
                      </button>
                      <span
                        className="quantity-value"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const val = parseInt(e.target.innerText.trim());
                          setQuantities((prev) => ({
                            ...prev,
                            [size]: !isNaN(val) && val >= 0 ? val : 0,
                          }));
                        }}
                      >
                        {quantities[size] || 0}
                      </span>
                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [size]: (prev[size] || 0) + 1,
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CustomDropdown>
          </div>

          <div className="product-color">
            <span className="label">Color: </span>
            <span
              className="color-value"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("color", e)}
            >
              {editData.color}
            </span>
          </div>
        </div>

        {/* ==================== Action Buttons ==================== */}
        <div className="product-actions">
          <button className="save-btn" onClick={handleSaveChanges}>
            {isNewProduct ? "Add Product" : "Save Changes"}
          </button>
          {!isNewProduct && (
            <>
              <button className="discard-btn" onClick={handleDiscardChanges}>
                Discard Changes
              </button>
              <button className="delete-product-btn" onClick={handleDelete}>
                Delete Product
              </button>
            </>
          )}
        </div>

        {/* ==================== Dropdown Sections ==================== */}
        <div className="dropdowns">
          <div className="dropdown">
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown("description")}
            >
              <span>Product Description</span>
              <span>{openDropdown === "description" ? "−" : "+"}</span>
            </div>
            {openDropdown === "description" && (
              <div className="dropdown-body">
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("description", e)}
                >
                  {editData.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ==================== Delivery Time ==================== */}
        <div className="return_policy">
          <div className="delivery_time">
            <p>
              Expected delivery in{" "}
              <span
                className="time"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const val = parseInt(e.target.innerText.trim());
                  if (!isNaN(val)) {
                    setEditData({
                      ...editData,
                      expected_delivery: [val, editData.expected_delivery[1]],
                    });
                  }
                }}
              >
                {editData.expected_delivery?.[0]}
              </span>{" "}
              <span className="time">to</span>{" "}
              <span
                className="time"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const val = parseInt(e.target.innerText.trim());
                  if (!isNaN(val)) {
                    setEditData({
                      ...editData,
                      expected_delivery: [editData.expected_delivery[0], val],
                    });
                  }
                }}
              >
                {editData.expected_delivery?.[1]}
              </span>{" "}
              working days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetail;
