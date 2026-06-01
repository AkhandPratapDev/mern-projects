import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder,
  children, // ✅ NEW — allows you to pass custom JSX
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange && onChange(option);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown ${open ? "open" : ""}`} ref={dropdownRef}>
      {/* ===== Dropdown Header ===== */}
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        <span>{value || placeholder || "Select option"}</span>
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {/* ===== Dropdown Body ===== */}
      {open && (
        <div className="dropdown-list" onClick={(e) => e.stopPropagation()}>
          {children ? (
            children
          ) : (
            <ul>
              {options.map((option) => (
                <li
                  key={option}
                  className={`dropdown-item ${
                    option === value ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
