import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import ContactInfoAdmin from "../../components/ContactInfoAdmin/ContactInfoAdmin";

import {
  confirmToast,
  errorToast,
  successToast,
  warningToast,
} from "../../utils/toast";
import "./AdminSettings.css";
import { assets } from "../../assets/assets";

const AdminSettings = () => {
  const {
    admins,
    currentAdmin,
    fetchAdmins,
    fetchCurrentAdmin,
    addAdmin,
    removeAdmin,
    changeAdminPassword,
  } = useContext(StoreContext);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);

  // ==================== Fetch admins on mount ====================
  useEffect(() => {
    fetchCurrentAdmin();
    fetchAdmins();
  }, []);

  // ==================== Add new admin ====================
  const handleAddAdmin = async () => {
    if (!currentAdmin?.isSuperAdmin)
      return warningToast("Only super admin can add new admins.");
    if (!newAdminEmail.trim() || !newAdminPassword.trim())
      return warningToast("Enter admin email and password");

    const admin = await addAdmin(newAdminEmail, newAdminPassword);
    if (admin) {
      setNewAdminEmail("");
      setNewAdminPassword("");
      setShowAddAdminForm(false);
    }
  };

  // ==================== Remove admin with confirmation ====================
  const handleRemoveAdmin = async (id, isSuperAdmin) => {
    if (!currentAdmin?.isSuperAdmin)
      return warningToast("Only super admin can remove admins.");
    if (isSuperAdmin) return warningToast("Super admin cannot be removed!");

    const confirmed = await confirmToast(
      "Are you sure you want to remove this admin?"
    );
    if (confirmed) await removeAdmin(id);
  };

  // ==================== Change current admin password ====================
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword)
      return warningToast("Enter both old and new password");
    await changeAdminPassword(oldPassword, newPassword);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <>
      {/* ==================== Add Admin Modal ==================== */}
      {showAddAdminForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddAdminForm(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAddAdminForm(false)}
            >
              ✖
            </button>
            <h3>Add New Admin</h3>
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Enter admin email"
            />
            <input
              type="password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              placeholder="Set password"
            />
            <button className="modal-add-btn" onClick={handleAddAdmin}>
              Add Admin
            </button>
          </div>
        </div>
      )}
      <div className="admin-dashboard fade-in">
        <h2 className="page-title">⚙️ Admin Settings</h2>

        <div className="cards-container">
          {/* ==================== Admin Management ==================== */}
          <div className="card">
            <div className="total-admin">
              <h3>👥 Admin Management</h3>
              <p className="total-admin">Total Admins : {admins.length}</p>
            </div>
            <div className="admin-list">
              {admins.map((admin) => (
                <div key={admin._id} className="admin-item">
                  {admin.email}{" "}
                  {admin.isSuperAdmin && (
                    <span className="super-admin-info">(Super Admin)</span>
                  )}
                  {currentAdmin?.isSuperAdmin && !admin.isSuperAdmin && (
                    <button
                      className="remove-btn"
                      onClick={() =>
                        handleRemoveAdmin(admin._id, admin.isSuperAdmin)
                      }
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}
            </div>

            {currentAdmin?.isSuperAdmin && (
              <div className="add-admin-btn-container">
                <button
                  className="add-admin-btn"
                  onClick={() => setShowAddAdminForm(true)}
                >
                  Add New{" "}
                  <img
                    className="add-admin-icon"
                    src={assets.add_admin_icon}
                    alt=""
                  />
                </button>
              </div>
            )}
          </div>

          {/* ==================== Change Password ==================== */}
          <div className="card">
            <h3>🔑 Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className="password-warning">
              ⚠️ Changing your password will immediately update your login
              credentials. Make sure to remember your new password.
            </p>

            <button onClick={handleChangePassword}>Update</button>
          </div>

          {currentAdmin?.isSuperAdmin && <ContactInfoAdmin />}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
