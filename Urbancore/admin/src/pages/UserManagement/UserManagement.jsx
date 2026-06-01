import React, { useContext } from "react";
import "./UserManagement.css";
import { StoreContext } from "../../context/StoreContext";
import UserCard from "../../components/UserCard/UserCard";

const UserManagement = () => {
  const { userList } = useContext(StoreContext);

  return (
    <div className="user-management" id="user-management">
      {/* ==================== Page Title ==================== */}
      <h2 className="page-title">👥 Users Management</h2>

      {/* ==================== No Users Found ==================== */}
      {userList.length === 0 && <p className="no-user">No user found.</p>}

      {/* ==================== Users Display List ==================== */}
      <div className="user-display-list">
        {userList.map((user, index) => (
          <React.Fragment key={user.id || index}>
            <div
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <UserCard
                id={user._id}
                name={user.name}
                email={user.email}
                address={user.address}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
