import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Transaction.css";

const Transaction = () => {
  const { orderList, productList, fetchOrders } = useContext(StoreContext);
  const [transactions, setTransactions] = useState([]);
  const [duration, setDuration] = useState("all"); // 👈 dropdown state

  useEffect(() => {
    fetchOrders(); // ✅ Ensure latest data
  }, []);

  useEffect(() => {
    const now = new Date();

    // ✅ Calculate time window based on selected duration
    const timeWindow =
      duration === "24h"
        ? 24 * 60 * 60 * 1000
        : duration === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : duration === "30d"
        ? 30 * 24 * 60 * 60 * 1000
        : null; // 'all'

    const onlinePayments = orderList
      .filter((order) => order.paymentMethod === "stripe")
      .filter((order) => {
        if (!timeWindow) return true; // all
        const orderDate = new Date(order.date);
        return now - orderDate <= timeWindow;
      })
      .flatMap((order) =>
        order.items.map((item) => {
          const product = productList.find(
            (p) => p._id.toString() === item.id.toString()
          );

          return {
            username: order.address?.name || "Unknown User",
            category: product?.category || "N/A",
            date: new Date(order.date).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount: item.price * item.quantity,
          };
        })
      );

    setTransactions(onlinePayments);
  }, [orderList, productList, duration]); // 👈 depends on dropdown

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2 className="transaction-title">Transaction History</h2>

        {/* 👇 Duration Dropdown */}
        <select
          className="transaction-filter"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="all">All</option>
          <option value="24h">1 Day</option>
          <option value="7d">1 Weak </option>
          <option value="30d">1 Month</option>
        </select>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td>₹{item.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
