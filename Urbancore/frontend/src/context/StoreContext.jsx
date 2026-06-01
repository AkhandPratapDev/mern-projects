import { createContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";

  // -------------------- AUTH (TOKEN) --------------------
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // -------------------- USER PROFILE --------------------
  const [user, setUser] = useState(null);
  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/user/profile`, {
        headers: { token },
      });
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {


      // ⛔ Token invalid or expired → clear everything
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) fetchUserProfile();
    else setUser(null);
  }, [token]);

  // -------------------- CART --------------------
  const [cart, setCart] = useState([]);

  const fetchUserCart = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        const fullCart = res.data.cart.map((item) => ({
          id: item.id,
          name: item.name || "Unknown Product",
          price: item.price || 0,
          image: item.image
            ? `${url}/images/${item.image}`
            : `${url}/images/default_product.png`,
          category: item.category || "",
          color: item.color || null,
          size: item.size || null,
          quantity: item.quantity || 1,
          source: item.source || "product", // ✅ added
        }));
        setCart(fullCart);
      }
    } catch (err) {
     
    }
  };

  useEffect(() => {
    if (token) fetchUserCart();
  }, [token]);

  const addToCart = async (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    try {
      await axios.post(
        `${url}/api/cart/add`,
        {
          itemId: product.id,
          color: product.color || null,
          size: product.size || null,
          quantity: 1,
          source: product.source || "product", // ✅ include source
        },
        { headers: { token } }
      );
    } catch (err) {
     
    
    }
  };

  const removeFromCart = async (productId, size, color) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    if (!token) return;
    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId: productId, size, color, quantity: 1 },
        { headers: { token } }
      );
    } catch (err) {
  
    }
  };

  const deleteFromCart = async (productId, size, color) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId && item.size === size && item.color === color)
      )
    );
    if (!token) return;
    try {
      await axios.post(
        `${url}/api/cart/delete`,
        { itemId: productId, size, color },
        { headers: { token } }
      );
    } catch (err) {
     
    }
  };

  const updateCartItem = (productId, updates) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // -------------------- AVATAR --------------------
  const [avatar, setAvatar] = useState(
    localStorage.getItem("avatar") || assets.person_1
  );

  useEffect(() => {
    if (avatar) localStorage.setItem("avatar", avatar);
  }, [avatar]);

  // -------------------- PRODUCTS --------------------
  const [productList, setProductList] = useState([]);
  const [OfferProductList, setOfferProductList] = useState([]);
  const [LastProductList, setLastProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [homepageAssets, setHomepageAssets] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/product/list`);
      if (res.data.success) {
        const productsWithFullUrls = res.data.data.map((p) => ({
          ...p,
          image: `${url}/images/${p.image}`,
          product_image_1: p.product_image_1
            ? `${url}/images/${p.product_image_1}`
            : null,
          product_image_2: p.product_image_2
            ? `${url}/images/${p.product_image_2}`
            : null,
          product_image_3: p.product_image_3
            ? `${url}/images/${p.product_image_3}`
            : null,
        }));
        setProductList(productsWithFullUrls);
      }
    } catch (err) {
    }
  };

  const fetchOfferProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/offerProduct/list`);
      if (res.data.success) {
        setOfferProductList(
          res.data.data.map((p) => ({
            ...p,
            image: `${url}/images/${p.image}`,
            product_image_1: p.product_image_1
              ? `${url}/images/${p.product_image_1}`
              : null,
            product_image_2: p.product_image_2
              ? `${url}/images/${p.product_image_2}`
              : null,
            product_image_3: p.product_image_3
              ? `${url}/images/${p.product_image_3}`
              : null,
          }))
        );
      }
    } catch (err) {
    }
  };

  const fetchLastProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/lastProduct/list`);
      if (res.data.success) {
        setLastProductList(
          res.data.data.map((p) => ({
            ...p,
            image: `${url}/images/${p.image}`,
            product_image_1: p.product_image_1
              ? `${url}/images/${p.product_image_1}`
              : null,
            product_image_2: p.product_image_2
              ? `${url}/images/${p.product_image_2}`
              : null,
            product_image_3: p.product_image_3
              ? `${url}/images/${p.product_image_3}`
              : null,
          }))
        );
      }
    } catch (err) {
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/category/list`);
      if (res.data.success) {
        setCategoryList(
          res.data.data.map((p) => ({
            ...p,
            category_image: `${url}/images/${p.category_image}`,
          }))
        );
      }
    } catch (err) {
    }
  };

  const fetchHomepageAssets = async () => {
    try {
      const res = await axios.get(`${url}/api/homepage/assets`);
      if (res.data.success && typeof res.data.data === "object") {
        const assetsWithFullUrl = {};
        for (const key in res.data.data) {
          if (res.data.data[key])
            assetsWithFullUrl[key] = `${url}/images/${res.data.data[key]}`;
        }
        setHomepageAssets(assetsWithFullUrl);
      }
    } catch (err) {
    }
  };

  // -------------------- POLICIES --------------------
  const [policies, setPolicies] = useState({
    shipping_policy: "",
    returns_policy: "",
    privacy_policy: "",
  });

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${url}/api/policies`);
      if (res.data) {
        setPolicies({
          shipping_policy: res.data.shipping_policy || "",
          returns_policy: res.data.returns_policy || "",
          privacy_policy: res.data.privacy_policy || "",
        });
      }
    } catch (err) {
      errorToast("Failed to load policies");
    }
  };

  // ---------------- CONTACT INFO ----------------
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
  });
  // Fetch contact info
  const fetchContactInfo = async () => {
    try {
      const res = await axios.get(`${url}/api/contactinfo`);
      if (res.data) {
        setContactInfo({
          email: res.data.email || "",
          phone: res.data.phone || "",
          socialLinks: res.data.socialLinks || {},
        });
      }
    } catch (err) {
      errorToast("Failed to load contact info");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOfferProducts();
    fetchLastProducts();
    fetchCategories();
    fetchHomepageAssets();
    fetchPolicies();
    fetchContactInfo();
  }, []);

  // -------------------- CONTEXT VALUE --------------------
  const contextValue = {
    // Auth
    token,
    setToken,
    // User
    user,
    fetchUserProfile,
    // Cart
    cart,
    fetchUserCart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    updateCartItem,
    clearCart,
    // Avatar
    avatar,
    setAvatar,
    // Products
    productList,
    fetchProducts,
    OfferProductList,
    fetchOfferProducts,
    LastProductList,
    fetchLastProducts,
    // Categories
    categoryList,
    fetchCategories,
    // Homepage Assets
    homepageAssets,
    fetchHomepageAssets,

    // Policies
    policies,
    fetchPolicies,

    contactInfo,
    fetchContactInfo,

    // Backend URL
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
