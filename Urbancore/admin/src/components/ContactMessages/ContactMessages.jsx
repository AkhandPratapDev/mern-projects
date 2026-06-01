/* ==================== Imports ==================== */
import React, { useEffect, useContext } from "react";
import "./ContactMessages.css";
import { StoreContext } from "../../context/StoreContext";

/* ==================== Component Start ==================== */
const ContactMessages = () => {
  /* ==================== Access Global Context ==================== */
  const { messages, fetchMessages, deleteMessage, markMessageAsRead } =
    useContext(StoreContext);

  /* ==================== Fetch Messages on Mount ==================== */
  useEffect(() => {
    fetchMessages();
  }, []);

  /* ==================== JSX Return ==================== */
  return (
    <div className="messages-container">
      <h2>Contact Messages</h2>

      {/* ==================== Messages Table ==================== */}
      <table className="messages-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((msg) => (
            <tr
              key={msg._id}
              style={{ background: msg.seen ? "#fff" : "#f0f8ff" }}
            >
              {/* ==================== Message Details ==================== */}
              <td data-label="Name">{msg.name}</td>
              <td data-label="Contact">{msg.contact}</td>
              <td data-label="Email">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=Regarding your inquiry`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="email-link"
                >
                  {msg.email}
                </a>
              </td>

              <td data-label="Reason">{msg.reason}</td>

              {/* ==================== Date Formatting ==================== */}
              <td data-label="Date">
                {new Date(msg.createdAt).toLocaleString()}
              </td>

              {/* ==================== Action Buttons ==================== */}
              <td>
                {!msg.seen && (
                  <button
                    className="mark-read-btn"
                    onClick={() => markMessageAsRead(msg._id)}
                  >
                    Mark as read
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(msg._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ==================== Export Component ==================== */
export default ContactMessages;
