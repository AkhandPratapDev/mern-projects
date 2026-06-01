import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { successToast, errorToast, warningToast } from "../../utils/toast";

const Cart = () => {
  /* ==================== Context & State ==================== */
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    updateCartItem,
    productList,
    LastProductList,
    OfferProductList,
  } = useContext(StoreContext);

  const navigate = useNavigate();



  /* ==================== Find Product by ID ==================== */
  const findProduct = (id) => {
    return (
      productList.find((p) => p._id?.toString() === id?.toString()) ||
      LastProductList.find((p) => p._id?.toString() === id?.toString()) ||
      OfferProductList.find((p) => p._id?.toString() === id?.toString())
    );
  };

  /* ==================== Navigation Handler ==================== */
  const goToDetails = (id, source) => {
    if (source === "last") {
      navigate(`/lastproduct/${id}`);
    } else if (source === "offer") {
      navigate(`/offerProduct/${id}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  /* ==================== Handle Size Selection ==================== */
  const handleSizeChange = (item, newSize) => {
    updateCartItem(item.id, { size: newSize });
  };

  /* ==================== Empty Cart Message ==================== */
  if (cart.length === 0) {
    return <div className="cart-empty">Your cart is empty 🛒</div>;
  }

  /* ==================== Order Button Handler ==================== */
  const handleOrder = (item) => {
    const product = findProduct(item.id);

    if (!product) {
      errorToast("Product not found!");
      return;
    }

    // 🚨 Check if size is required but not selected
    if (product.sizes && product.sizes.length > 0 && !item.size) {
      warningToast("Please select a size first!");
      return;
    }

    // ✅ Check stock availability (handle size-wise quantity)
    let availableQty = 0;

    if (product.quantities && item.size) {
      availableQty = product.quantities[item.size] || 0;
    } else if (typeof product.quantity === "number") {
      availableQty = product.quantity;
    }

    if (item.quantity > availableQty) {
      warningToast(
        `Only ${availableQty} item(s) available${
          item.size ? ` for size ${item.size}` : ""
        }.`
      );
      return;
    }
    if (!availableQty || availableQty <= 0) {
      warningToast("This item is out of stock!");
      return;
    }

    // ✅ Navigate to order page if all validations pass
    navigate(`/order/${item.id}`, {
      state: {
        quantity: item.quantity,
        source: item.source,
        size: item.size,
        color: item.color,
      },
    });
  };

  /* ==================== Cart Items ==================== */
  return (
    <div className="cart-page">
      {cart.map((item) => {
        const product = findProduct(item.id) || item; // fallback to item if not found

        return (
          <div key={item.id + item.size + item.color} className="cart-card">
            {/* ==================== Product Image ==================== */}
            <div
              className="cart-img"
              onClick={() => goToDetails(item.id, item.source)}
              style={{ cursor: "pointer" }}
            >
              <img src={product?.image || item.image} alt={item.name} />
            </div>

            {/* ==================== Product Details ==================== */}
            <div className="cart-details">
              <h4 className="cart-product-name">{product?.name}</h4>

              {/* ==================== Sizes ==================== */}
              {product?.sizes && (
                <div className="product-sizes">
                  <span className="label">Size:</span>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${
                        item.size === size ? "active" : ""
                      }`}
                      onClick={() => handleSizeChange(item, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}

              {/* ==================== Color ==================== */}
              <p>
                {" "}
                <span className="label">Color:</span>{" "}
                {product?.color || "Default"}
              </p>
            </div>

            {/* ==================== Quantity + Actions ==================== */}
            <div className="cart-quantity-action-btn">
              {/* ==================== Quantity Controls ==================== */}
              <div className="cart-quantity">
                <button
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
                <button
                  className="delete-btn"
                  onClick={() => deleteFromCart(item.id, item.size, item.color)}
                >
                  <img src={assets.delete_icon} alt="Delete" />
                </button>
              </div>

              {/* ==================== Order Button ==================== */}
              <div className="cart-action">
                <button onClick={() => handleOrder(item)} className="order-btn">
                  Order
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
