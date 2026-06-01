import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./AdminPolicies.css";

const AdminPolicies = () => {
  const { policies, fetchPolicies, updatePolicies } = useContext(StoreContext);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(null);

  // ✅ Default text placeholders (shown when no data from backend)
  const DEFAULT_POLICIES = {
    shipping_policy: `We offer fast and reliable shipping across India. Orders are typically processed within 1-2 business days.
Shipping times may vary depending on location. Tracking information will be provided for all shipments.

📦 Standard Shipping: 3-7 business days
⚡ Express Shipping: 1-3 business days
🎁 Free shipping on orders above ₹999`,

    returns_policy: `Customer satisfaction is our priority. If you are not satisfied with your purchase, you can return it within 15 days.
The product must be unused, in original packaging, and with all tags attached.

📝 Request a return via your account or email support
💰 Refunds are processed within 5-7 business days
🔄 Exchanges can be requested for a different size or color`,

    privacy_policy: `We respect your privacy and do not share your personal information with third parties without your consent.
All data is securely stored and only used to provide the best shopping experience.

🛡️ Personal information is encrypted
💳 Payment information is secure
📧 We never spam our customers`,
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    // ✅ Merge defaults with backend data (backend values override defaults)
    setFormData({
      shipping_policy:
        policies?.shipping_policy?.trim() || DEFAULT_POLICIES.shipping_policy,
      returns_policy:
        policies?.returns_policy?.trim() || DEFAULT_POLICIES.returns_policy,
      privacy_policy:
        policies?.privacy_policy?.trim() || DEFAULT_POLICIES.privacy_policy,
    });
  }, [policies]);

  const handleSave = async () => {
    await updatePolicies(formData);
    setEditing(null);
  };

  return (
    <div className="policies-page">
      <h2 className="policies-title">📜 Manage Policies</h2>

      {/* ==================== Shipping Policy ==================== */}
      <section className="policy-section">
        <h2>🚚 Shipping Policy</h2>
        {editing === "shipping" ? (
          <textarea
            value={formData.shipping_policy}
            onChange={(e) =>
              setFormData({ ...formData, shipping_policy: e.target.value })
            }
            onBlur={handleSave}
            rows="6"
            className="editable-textarea"
          />
        ) : (
          <p
            onClick={() => setEditing("shipping")}
            style={{ whiteSpace: "pre-line", cursor: "pointer" }}
          >
            {formData.shipping_policy}
          </p>
        )}
      </section>

      {/* ==================== Returns & Exchanges ==================== */}
      <section className="policy-section">
        <h2>↩️ Returns & Exchanges</h2>
        {editing === "returns" ? (
          <textarea
            value={formData.returns_policy}
            onChange={(e) =>
              setFormData({ ...formData, returns_policy: e.target.value })
            }
            onBlur={handleSave}
            rows="6"
            className="editable-textarea"
          />
        ) : (
          <p
            onClick={() => setEditing("returns")}
            style={{ whiteSpace: "pre-line", cursor: "pointer" }}
          >
            {formData.returns_policy}
          </p>
        )}
      </section>

      {/* ==================== Privacy Policy ==================== */}
      <section className="policy-section">
        <h2>🔒 Privacy Policy</h2>
        {editing === "privacy" ? (
          <textarea
            value={formData.privacy_policy}
            onChange={(e) =>
              setFormData({ ...formData, privacy_policy: e.target.value })
            }
            onBlur={handleSave}
            rows="6"
            className="editable-textarea"
          />
        ) : (
          <p
            onClick={() => setEditing("privacy")}
            style={{ whiteSpace: "pre-line", cursor: "pointer" }}
          >
            {formData.privacy_policy}
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminPolicies;
