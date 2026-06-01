import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidenav.css";
import { assets } from "../../assets/assets";

const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);

  /* ==================== Menu Items ==================== */
  const menuItems = [
    { name: "Dashboard", link: "/dashboard", icon: assets.dashboard_icon },
    {
      name: "Product Management",
      link: "/products",
      icon: assets.products_icon,
    },
    { name: "Order Management", link: "/orders", icon: assets.orders_icon },
    { name: "User Management", link: "/users", icon: assets.users_icon },
    { name: "Offers Page", link: "/offerspage", icon: assets.offers_icon },
    { name: "Home Page", link: "/homepage", icon: assets.home_edit_icon },
    {
      name: "Admin Setting",
      link: "/settings",
      icon: assets.admin_settings_icon,
    },
  ];

  /* ==================== Auto Collapse on Resize ==================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) setCollapsed(true); // auto collapse
      else setCollapsed(false); // expand on larger screens
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    /* ==================== Side Navigation ==================== */
    <aside className={`sidenav ${collapsed ? "collapsed" : ""}`}>
      <nav className="sidenav-menu">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.link}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="sidenav-icon"
                />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ==================== Collapse Toggle Button ==================== */}
      <div
        className="collapse-button"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand" : "Collapse"}
      >
        <img
          src={collapsed ? assets.open_sidenav_icon : assets.left_arrow_icon}
          alt="toggle"
        />
      </div>
    </aside>
  );
};

export default SideNav;
