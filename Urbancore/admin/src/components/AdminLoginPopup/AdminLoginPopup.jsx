import React, { useState, useContext } from "react";
import axios from "axios";
import "./AdminLoginPopup.css";
import { StoreContext } from "../../context/StoreContext";

const AdminLoginPopup = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const { url } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${url}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        onLoginSuccess(res.data.token);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-popup">
      <form onSubmit={handleSubmit}>
        <h3>Admin Login</h3>

        <input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="btn-loading">
              <div className="spinner"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLoginPopup;
