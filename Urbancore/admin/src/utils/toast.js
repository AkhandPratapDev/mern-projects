import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./toast.css";

const baseStyle = {
  duration: 2000,
  gravity: "top",
  position: "right",
  close: true,
  stopOnFocus: true,
  offset: { x: 20, y: 60 },
};

// SVG icons
const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#22c55e" viewBox="0 0 24 24" width="18" height="18" style="margin-right:8px;vertical-align:middle;"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" width="18" height="18" style="margin-right:8px;vertical-align:middle;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
const warningIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#facc15" viewBox="0 0 24 24" width="18" height="18" style="margin-right:8px;vertical-align:middle;"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;

// ✅ Success toast
export const successToast = (msg) => {
  Toastify({
    ...baseStyle,
    text: `${successIcon}<span>${msg}</span>`,
    escapeMarkup: false, // 👈 allows SVG rendering
    className: "toast-base toast-success",
  }).showToast();
};

// ❌ Error toast
export const errorToast = (msg) => {
  Toastify({
    ...baseStyle,
    text: `${errorIcon}<span>${msg}</span>`,
    escapeMarkup: false,
    className: "toast-base toast-error",
  }).showToast();
};

// ⚠️ Warning toast
export const warningToast = (msg) => {
  Toastify({
    ...baseStyle,
    text: `${warningIcon}<span>${msg}</span>`,
    escapeMarkup: false,
    className: "toast-base toast-warning",
  }).showToast();
};

// ✅ Confirm toast (unchanged)
export const confirmToast = (msg) => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.className = "toast-confirm-container";
    container.innerHTML = `
      <span>${msg}</span>
      <div>
        <button id="toast-yes" class="toast-confirm-yes">Yes</button>
        <button id="toast-no" class="toast-confirm-no">No</button>
      </div>
    `;

    const toast = Toastify({
      node: container,
      duration: -1,
      gravity: "top",
      position: "right",
      close: false,
      stopOnFocus: true,
    });

    toast.showToast();

    container.querySelector("#toast-yes").onclick = () => {
      toast.hideToast();
      resolve(true);
    };
    container.querySelector("#toast-no").onclick = () => {
      toast.hideToast();
      resolve(false);
    };
  });
};
