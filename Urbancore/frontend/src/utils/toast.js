import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./toastify.css";

const baseStyle = {
  duration: 2000,
  gravity: "top",
  position: "right",
  close: true,
  stopOnFocus: true,
  offset: { x: 20, y: 60 },
};

const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#22c55e" viewBox="0 0 24 24" width="20" height="20" style="margin-right:8px;vertical-align:middle;"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" width="20" height="20" style="margin-right:8px;vertical-align:middle;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
const warningIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#facc15" viewBox="0 0 24 24" width="20" height="20" style="margin-right:8px;vertical-align:middle;"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;

// ✅ Success toast
export const successToast = (msg) => {
  Toastify({
    ...baseStyle,
    text: `${successIcon}<span>${msg}</span>`,
    escapeMarkup: false, // 👈 necessary for SVG to render
    style: {
      background: "#000",
      color: "#22c55e",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      padding: "10px 18px",
      fontSize: "15px",
      fontWeight: 500,
      borderRight: "5px solid #16a34a",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
  }).showToast();
};

// ❌ Error toast
export const errorToast = (msg) => {
  Toastify({
    ...baseStyle,
    text: `${errorIcon}<span>${msg}</span>`,
    escapeMarkup: false, // 👈 needed
    style: {
      background: "#000",
      color: "#ef4444",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      padding: "10px 18px",
      fontSize: "15px",
      fontWeight: 500,
      borderRight: "5px solid #dc2626",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    className: "toast-error",
  }).showToast();
};

// ⚠️ Warning toast
export const warningToast = (msg) => {
  Toastify({
    ...baseStyle,
    text: `${warningIcon}<span>${msg}</span>`,
    escapeMarkup: false, // 👈 needed
    style: {
      background: "#000",
      color: "#facc15",
      boxShadow: "0 3px 10px rgba(255, 193, 7, 0.25)",
      padding: "10px 18px",
      fontSize: "15px",
      fontWeight: 500,
      borderLeft: "6px solid #facc15",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      letterSpacing: "0.3px",
    },
    offset: { x: 20, y: 60 },
    className: "toast-warning",
  }).showToast();
};
