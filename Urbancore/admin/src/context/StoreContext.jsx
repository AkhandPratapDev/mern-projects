import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { transactions } from "../assets/assets";
import { assets } from "../assets/assets";
import {
  successToast,
  errorToast,
  warningToast,
  confirmToast,
} from "../utils/toast";

export const StoreContext = createContext(null);

const DEFAULT_IMAGES = {
  header_img_1: assets.add_header_img_icon,
  header_img_2: assets.add_header_img_icon,
  header_img_3: assets.add_header_img_icon,
  homepage_poster: assets.add_poster_icon,
  offers_poster: assets.add_poster_icon,
  last_product_display_poster: assets.add_img_icon,
};

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";

  // ---------------- STATES ----------------
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [offerProductList, setOfferProductList] = useState([]);
  const [homepageAssets, setHomepageAssets] = useState(DEFAULT_IMAGES);
  const [lastProductList, setLastProductList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [hasNewOrders, setHasNewOrders] = useState(false);

  // ---------------- PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/product/list`);
      if (res.data.success) {
        const productsWithUrls = res.data.data.map((p) => ({
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
        setProductList(productsWithUrls.reverse());
      }
    } catch (err) {
     
    }
  };

  const addProduct = async (productData) => {
    try {
      const res = await axios.post(`${url}/api/product/add`, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) fetchProducts();
      return res.data;
    } catch (err) {
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const res = await axios.put(`${url}/api/product/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) fetchProducts();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(`${url}/api/product/remove`, { id });
      if (res.data.success)
        setProductList((prev) => prev.filter((p) => p._id !== id));
      return res.data;
    } catch (err) {
    
    }
  };

  // ---------------- CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/category/list`);
      if (res.data.success) {
        const categoriesWithUrls = res.data.data.map((cat) => ({
          ...cat,
          category_image: `${url}/images/${cat.category_image}`,
        }));
        setCategoryList(categoriesWithUrls);
      }
    } catch (err) {
   
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const res = await axios.post(`${url}/api/category/add`, categoryData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) fetchCategories();
      return res.data;
    } catch (err) {
     
    }
  };

  const removeCategory = async (id) => {
    try {
      const res = await axios.post(`${url}/api/category/remove/${id}`);
      if (res.data.success)
        setCategoryList((prev) => prev.filter((c) => c._id !== id));
      return res.data;
    } catch (err) {
  
    }
  };

  // ---------------- OFFER PRODUCTS ----------------
  const fetchOfferProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/offerProduct/list`);
      if (res.data.success) {
        const productsWithUrls = res.data.data
          .map((p) => ({
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
          .reverse(); // <-- reverse the array

        setOfferProductList(productsWithUrls);
      }
    } catch (err) {
    }
  };

  const addOfferProduct = async (productData) => {
    try {
      const res = await axios.post(`${url}/api/offerProduct/add`, productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) fetchOfferProducts();
      return res.data;
    } catch (err) {
    }
  };

  const updateOfferProduct = async (id, formData) => {
    try {
      const res = await axios.put(
        `${url}/api/offerProduct/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) fetchOfferProducts();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const removeOfferProduct = async (id) => {
    try {
      const res = await axios.post(`${url}/api/offerProduct/remove`, { id });
      if (res.data.success)
        setOfferProductList((prev) => prev.filter((p) => p._id !== id));
      return res.data;
    } catch (err) {
    }
  };

  // ---------------- HOMEPAGE ASSETS ----------------
  const fetchHomepageAssets = async () => {
    try {
      const res = await axios.get(`${url}/api/homepage/assets`);
      if (res.data.success) {
        const assetsFromDB = res.data.data || {};

        const withUrls = {
          _id: assetsFromDB._id, // ✅ preserve ID
          header_img_1:
            assetsFromDB.header_img_1 &&
            !assetsFromDB.header_img_1.includes("default")
              ? `${url}/images/${assetsFromDB.header_img_1}`
              : DEFAULT_IMAGES.header_img_1,
          header_img_2:
            assetsFromDB.header_img_2 &&
            !assetsFromDB.header_img_2.includes("default")
              ? `${url}/images/${assetsFromDB.header_img_2}`
              : DEFAULT_IMAGES.header_img_2,
          header_img_3:
            assetsFromDB.header_img_3 &&
            !assetsFromDB.header_img_3.includes("default")
              ? `${url}/images/${assetsFromDB.header_img_3}`
              : DEFAULT_IMAGES.header_img_3,
          homepage_poster:
            assetsFromDB.homepage_poster &&
            !assetsFromDB.homepage_poster.includes("default")
              ? `${url}/images/${assetsFromDB.homepage_poster}`
              : DEFAULT_IMAGES.homepage_poster,
          offers_poster:
            assetsFromDB.offers_poster &&
            !assetsFromDB.offers_poster.includes("default")
              ? `${url}/images/${assetsFromDB.offers_poster}`
              : DEFAULT_IMAGES.offers_poster,
          last_product_display_poster:
            assetsFromDB.last_product_display_poster &&
            !assetsFromDB.last_product_display_poster.includes("default")
              ? `${url}/images/${assetsFromDB.last_product_display_poster}`
              : DEFAULT_IMAGES.last_product_display_poster,
        };

        setHomepageAssets(withUrls);
      } else {
        setHomepageAssets(DEFAULT_IMAGES);
      }
    } catch (err) {
      setHomepageAssets(DEFAULT_IMAGES);
    }
  };

  const updateHomepageAsset = async (key, file) => {
    if (!homepageAssets?._id) return;
    const formData = new FormData();
    formData.append(key, file);
    formData.append("key", key);

    try {
      await axios.put(
        `${url}/api/homepage/update/${homepageAssets._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchHomepageAssets();
    } catch (err) {
    }
  };

  // ---------------- LAST PRODUCTS ----------------
  const fetchLastProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/lastProduct/list`);
      if (res.data.success) {
        const productsWithUrls = res.data.data.map((p) => ({
          ...p,
          image: p.image ? `${url}/images/${p.image}` : null,
          product_image_1: p.product_image_1
            ? `${url}/images/${p.product_image_1}`
            : null,
          product_image_2: p.product_image_2
            ? `${url}/images/${p.product_image_2}`
            : null,
          product_image_3: p.product_image_3
            ? `${url}/images/${p.product_image_3}`
            : null,
          product_image_4: p.product_image_4
            ? `${url}/images/${p.product_image_4}`
            : null,
        }));
        setLastProductList(productsWithUrls.reverse());
      }
    } catch (err) {
    }
  };

  const updateLastProduct = async (id, formData) => {
    try {
      const res = await axios.put(
        `${url}/api/lastProduct/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) fetchLastProducts();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // ✅ NEW FUNCTION: Add a new Last Product
  const addLastProduct = async (formData) => {
    try {
      const res = await axios.post(`${url}/api/lastProduct/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) fetchLastProducts();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // ---------------- USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/user/list`);
      if (res.data.success) {
        // Reverse the users array so newest appears first
        setUserList([...res.data.data].reverse());
      }
    } catch (err) {
    }
  };

  const removeUser = async (id) => {
    try {
      const res = await axios.delete(`${url}/api/user/remove/${id}`);
      if (res.data.success)
        setUserList((prev) => prev.filter((u) => u._id !== id));
      return res.data;
    } catch (err) {
    }
  };

  // ---------------- ORDERS ----------------
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        const orders = [...res.data.data].reverse(); // newest first
        setOrderList(orders);

        const hasProcessingOrders = orders.some(
          (order) => order.status === "Proccesing"
        );
        setHasNewOrders(hasProcessingOrders);
      }
    } catch (err) {
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, {
        orderId,
        status,
      });
      if (res.data.success) fetchOrders();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this order?"
    );
    if (!confirmed) return false;

    try {
      const res = await axios.delete(`${url}/api/order/${orderId}`);
      if (res.data.success) {
        setOrderList((prev) => prev.filter((o) => o._id !== orderId));
        successToast("Order deleted successfully");
        return true;
      } else {
        errorToast(res.data.message || "Failed to delete order");
        return false;
      }
    } catch (err) {
      errorToast("Something went wrong");
      return false;
    }
  };

  // ---------------- CONTACT MESSAGES ----------------
  const [messages, setMessages] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const token = localStorage.getItem("token"); // or however you store it

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${url}/api/contact`, {
        headers: { token },
      });
      if (res.data.success) {
        const reversedMessages = res.data.messages.reverse(); // <-- reverse here
        setMessages(reversedMessages);

        // update unseen count
        const unseen = reversedMessages.filter((msg) => !msg.seen).length;
        setUnseenCount(unseen);
      } else {
      }
    } catch (err) {
    }
  };

  // Delete a message
  const deleteMessage = async (id) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this message?"
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(`${url}/api/contact/${id}`, {
        headers: { token },
      });
      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setUnseenCount(
          (prev) =>
            prev - (messages.find((msg) => msg._id === id)?.seen ? 0 : 1)
        );
      } else {
        errorToast(res.data.message);
      }
    } catch (err) {
      errorToast("Something went wrong!");
    }
  };

  // Mark a message as read
  const markMessageAsRead = async (id) => {
    try {
      const res = await axios.put(`${url}/api/contact/mark-read/${id}`, null, {
        headers: { token },
      });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, seen: true } : msg))
        );
        setUnseenCount((prev) => prev - 1);
      }
    } catch (err) {
    }
  };

  // ---------------- ADMINS ----------------
  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const fetchCurrentAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${url}/api/admin/me`, {
        headers: { token },
      });
      if (res.data.success) setCurrentAdmin(res.data.admin);
    } catch (err) {
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${url}/api/admin/list`, {
        headers: { token },
      });
      if (res.data.success) setAdmins(res.data.admins);
    } catch (err) {
    }
  };

  const addAdmin = async (email, password) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${url}/api/admin/add`,
        { email, password },
        { headers: { token } }
      );

      if (res.data.success) {
        setAdmins((prev) => [...prev, res.data.admin]);
        successToast("Admin added successfully!");
        return res.data.admin;
      } else {
        errorToast(res.data.message);
        return null;
      }
    } catch (err) {
      errorToast(err.response?.data?.message || "Error adding admin");
      return null;
    }
  };

  const removeAdmin = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(`${url}/api/admin/remove/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        setAdmins((prev) => prev.filter((a) => a._id !== id));
        successToast("Admin removed successfully!");
      } else {
        errorToast(res.data.message);
      }
    } catch (err) {
      errorToast(err.response?.data?.message || "Error removing admin");
    }
  };

  const changeAdminPassword = async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${url}/api/admin/change-password`,
        { oldPassword, newPassword },
        { headers: { token } }
      );
      successToast(res.data.message);
    } catch (err) {
      errorToast(err.response?.data?.message || "Error changing password");
    }
  };

  // ---------------- POLICIES ----------------
  const [policies, setPolicies] = useState({
    shipping_policy: "",
    returns_policy: "",
    privacy_policy: "",
  });

  // Fetch policies
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

  // Update policies
  const updatePolicies = async (updatedPolicies) => {
    try {
      const res = await axios.put(`${url}/api/policies`, updatedPolicies);
      if (res.data) {
        setPolicies(res.data);
        successToast(" Policies updated successfully!");
      }
    } catch (err) {
      errorToast("Failed to update policies");
    }
  };

  // ---------------- CONTACT INFO ----------------
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    socialLinks: {
      instagram: "",
      twitter: "",
      linkedin: "",
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

  // Update contact info (for admin panel)
  const updateContactInfo = async (updatedInfo) => {
    try {
      const res = await axios.put(`${url}/api/contactinfo`, updatedInfo);
      if (res.data) {
        setContactInfo(res.data);
        successToast(" Contact info updated successfully!");
      }
    } catch (err) {
      errorToast("Failed to update contact info");
    }
  };

  // ---------------- INIT LOAD ----------------
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOfferProducts();
    fetchHomepageAssets();
    fetchLastProducts();
    fetchUsers();
    fetchOrders();
    fetchPolicies();
    fetchContactInfo();
  }, []);

  // ---------------- CONTEXT VALUE ----------------
  const contextValue = {
    url,

    productList,
    addProduct,
    removeProduct,
    fetchProducts,
    updateProduct,

    categoryList,
    addCategory,
    removeCategory,
    fetchCategories,

    offerProductList,
    setOfferProductList,
    fetchOfferProducts,
    addOfferProduct,
    updateOfferProduct,
    removeOfferProduct,

    homepageAssets,
    fetchHomepageAssets,
    updateHomepageAsset,

    lastProductList,
    fetchLastProducts,
    updateLastProduct,
    addLastProduct,

    userList,
    fetchUsers,
    removeUser,

    orderList,
    hasNewOrders,
    setOrderList,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    setHasNewOrders,

    messages,
    unseenCount,
    fetchMessages,
    deleteMessage,
    markMessageAsRead,

    admins,
    currentAdmin,
    fetchAdmins,
    fetchCurrentAdmin,
    addAdmin,
    removeAdmin,
    changeAdminPassword,

    // Policies
    policies,
    fetchPolicies,
    updatePolicies,

    // Contact Info
    contactInfo,
    fetchContactInfo,
    updateContactInfo,

    transactions,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
