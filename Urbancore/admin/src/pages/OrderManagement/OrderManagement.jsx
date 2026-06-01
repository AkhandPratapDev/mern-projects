
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderManagement.css";
import { StoreContext } from "../../context/StoreContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { assets } from "../../assets/assets";
import { confirmToast, errorToast, successToast, warningToast } from "../../utils/toast";

const steps = [
  "Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const OrderManagement = () => {
  const {
    url,
    orderList,
    productList,
    updateOrderStatus,
    fetchOrders,
    deleteOrder,
    setHasNewOrders,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const pages = ["Orders", "Status", "Completed"];
  const [activePage, setActivePage] = useState("Orders");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [filterPayment, setFilterPayment] = useState("all"); // all, cod, paid
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  useEffect(() => {
    fetchOrders();
    setHasNewOrders(false);
  }, []);

  const sortedActiveOrders = orderList
    .filter((o) => o.status !== "Delivered")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const completedOrders = orderList
    .filter((o) => o.status === "Delivered")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filtered lists
  const filteredActiveOrders = sortedActiveOrders
    .filter((o) => o._id.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((o) => {
      if (filterPayment === "cod") return o.paymentMethod !== "stripe";
      if (filterPayment === "paid") return o.paymentMethod === "stripe";
      return true;
    });

  const filteredStatusOrders = orderList
    .filter((o) => o.status !== "Delivered")
    .filter((o) => o._id.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredCompletedOrders = completedOrders.filter((o) =>
    o._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkOrder = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
      setOpenDropdownId(null);
    } catch (err) {

    }
  };

  const handleDeleteOrder = async (orderId) => {
    await deleteOrder(orderId);
    fetchOrders();
  };

  // ✅ NEW: Excel download function
  const handleDownloadExcel = () => {
    if (filteredCompletedOrders.length === 0) {
      errorToast("No completed orders to download!");
      return;
    }

    const data = [];

    filteredCompletedOrders.forEach((order) => {
      order.items.forEach((item, index) => {
        data.push({
          "Order ID": order._id,
          Date: new Date(order.date).toLocaleString(),
          "Total Amount (₹)": order.amount,
          "Payment Method": order.paymentMethod === "stripe" ? "Paid" : "COD",
          "Customer Name": order.address?.name || "-",
          Phone: order.address?.phone || "-",
          Address: order.address?.address || "-",
          "Item Name": item.name,
          Quantity: item.quantity,
          Size: item.size || "N/A",
          "Item Price (₹)": item.price,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Completed Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      blob,
      `Completed_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const [cleanupPeriod, setCleanupPeriod] = useState("28d");

  const handleCleanupOldOrders = async () => {
    if (cleanupPeriod === "never") {
      warningToast("Cleanup skipped — set to 'Never'.");
      return;
    }
    // 🟡 use confirmToast instead of window.confirm
    const confirmed = await confirmToast(
      `Delete delivered orders older than ${cleanupPeriod}?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${url}/api/order/cleanup/old-delivered?period=${cleanupPeriod}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (data.success) {
        successToast(
          data.message || "Old delivered orders deleted successfully!"
        );
        fetchOrders();
      } else {
        errorToast("Cleanup failed: " + data.message);
      }
    } catch (err) {
      errorToast("Error cleaning up orders.");
    }
  };

  return (
    <div className="order-management">
      <div className="order-management-header">
        <h1 className="page-title">📦 Order Management</h1>

        {/* Tabs */}
        <ul className="order-pages">
          {pages.map((page) => (
            <li
              key={page}
              className={`order-tab ${activePage === page ? "active" : ""}`}
              onClick={() => {
                setActivePage(page);
                if (page === "Orders") setFilterPayment("all");
              }}
              onMouseEnter={() =>
                page === "Orders" && setShowPaymentDropdown(true)
              }
              onMouseLeave={() =>
                page === "Orders" && setShowPaymentDropdown(false)
              }
              style={{ position: "relative" }}
            >
              {page}

              {/* Payment Filter Dropdown */}
              {page === "Orders" && showPaymentDropdown && (
                <ul className="payment-filter-dropdown">
                  <li
                    className={filterPayment === "cod" ? "active" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterPayment("cod");
                    }}
                  >
                    💴 COD
                  </li>
                  <li
                    className={filterPayment === "paid" ? "active" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterPayment("paid");
                    }}
                  >
                    ✅ Paid
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="my-orders-container">
        {/* ---------------- Orders ---------------- */}
        {activePage === "Orders" && (
          <>
            <h2 className="section-title">📦 My Orders</h2>
            <input
              type="text"
              className="orders-search status-search"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filteredActiveOrders.length === 0 ? (
              <p className="no-orders">No active orders found.</p>
            ) : (
              filteredActiveOrders.map((order) => (
                <div key={order._id} className="order-card fade-in">
                  <div className="order-header">
                    <h3 className="order-id-container">
                      Order ID: {order._id}{" "}
                      <span
                        className="copy-icon"
                        title="Copy Order ID"
                        onClick={() => {
                          navigator.clipboard.writeText(order._id);
                          setCopiedId(order._id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                      >
                        <img src={assets.copy_icon} alt="" />
                      </span>
                      {copiedId === order._id && (
                        <span className="copy-popup">Copied!</span>
                      )}
                    </h3>

                    <div className="order-date-action">
                      <p className="order-date">
                        Date:{" "}
                        {new Date(order.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <div className="order-actions">
                        <div className="status-dropdown-container">
                          <button
                            className="track-btn"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === order._id ? null : order._id
                              )
                            }
                          >
                            🚚 {order.status}
                          </button>
                          {openDropdownId === order._id && (
                            <ul className="status-dropdown">
                              {steps.map((step) => (
                                <li
                                  key={step}
                                  className={
                                    step === order.status ? "active" : ""
                                  }
                                  onClick={() =>
                                    handleMarkOrder(order._id, step)
                                  }
                                >
                                  {step}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p>
                    <strong>Total:</strong> ₹{order.amount}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentMethod === "stripe" ? "✅ Paid" : "💴 COD"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        order.status === "Delivered"
                          ? "status-paid"
                          : "status-pending"
                      }
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address.name},{" "}
                    {order.address.address}, {order.address.phone}
                  </p>

                  <h4>Items:</h4>
                  <div className="order-items">
                    {order.items.map((item, index) => {
                      const product = productList.find(
                        (p) => p._id.toString() === item.id.toString()
                      );
                      return (
                        <div key={index} className="order-item-card pop-in">
                          <img
                            src={product?.image || item.image}
                            alt={item.name}
                            className="order-item-img"
                            onClick={() => navigate(`/product/${item.id}`)}
                          />
                          <div className="order-item-details">
                            <h5>{item.name}</h5>
                            <p>Qty: {item.quantity}</p>

                            {item.size && <p>Size: {item.size}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ---------------- Status ---------------- */}
        {activePage === "Status" && (
          <>
            <h2 className="section-title">📊 Order Status Overview</h2>
            <input
              type="text"
              className="status-search"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filteredStatusOrders.length === 0 ? (
              <p className="no-orders">No orders found.</p>
            ) : (
              filteredStatusOrders.map((order) => {
                const currentStep = steps.indexOf(order.status);
                return (
                  <div key={order._id} className="status-overview-card fade-in">
                    <h3>Order ID: {order._id}</h3>
                    <div className="progress-container small">
                      {steps.map((step, index) => (
                        <div key={step} className="progress-step">
                          <div
                            className={`circle ${
                              index <= currentStep ? "active" : ""
                            }`}
                          >
                            {index < currentStep ? "✔" : index + 1}
                          </div>
                          <span
                            className={`label ${
                              index <= currentStep ? "active" : ""
                            }`}
                          >
                            {step}
                          </span>
                          {index < steps.length - 1 && (
                            <div
                              className={`line ${
                                index < currentStep ? "filled" : ""
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ---------------- Completed ---------------- */}
        {activePage === "Completed" && (
          <>
            <div className="title-with-btn">
              <h2 className="section-title">✅ Completed Orders</h2>

              <div className="action-btns">
                <select
                  className="cleanup-select"
                  value={cleanupPeriod}
                  onChange={(e) => setCleanupPeriod(e.target.value)}
                >
                  <option value="never">Never</option>
                  <option value="7d"> 1 week</option>
                  <option value="28d"> 28 days</option>
                  <option value="1y"> 1 year</option>
                </select>

                <button
                  className="cleanup-btn"
                  onClick={handleCleanupOldOrders}
                >
                  Cleanup
                </button>

                <button className="download-btn" onClick={handleDownloadExcel}>
                  Download Excel
                </button>
              </div>
            </div>

            <input
              type="text"
              className="orders-search status-search"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filteredCompletedOrders.length === 0 ? (
              <p className="no-orders">No completed orders found.</p>
            ) : (
              filteredCompletedOrders.map((order) => (
                <div key={order._id} className="order-card fade-in">
                  <h3>Order ID: {order._id}</h3>
                  <div className="completed-detail-box">
                    <div className="completed-detail">
                      <p>
                        <strong>Total:</strong> ₹{order.amount}
                      </p>
                      <p className="status-paid">Delivered 🎉</p>
                    </div>
                    <button
                      className="delete-order-info"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      🗑 Delete-info
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
