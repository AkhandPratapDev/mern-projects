import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Policies.css";

const Policies = () => {
  const { policies, fetchPolicies } = useContext(StoreContext);

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="policies-page">
      <h2>📜 Our Policies</h2>

      {/* Shipping Policy */}
      <section className="policy-section">
        <h3>🚚 Shipping Policy</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {policies.shipping_policy || "Loading..."}
        </p>
      </section>

      {/* Returns Policy */}
      <section className="policy-section">
        <h3>↩️ Returns & Exchanges</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {policies.returns_policy || "Loading..."}
        </p>
      </section>

      {/* Privacy Policy */}
      <section className="policy-section">
        <h3>🔒 Privacy Policy</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {policies.privacy_policy || "Loading..."}
        </p>
      </section>
    </div>
  );
};

export default Policies;
