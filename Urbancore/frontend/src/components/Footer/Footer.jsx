import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const Footer = () => {
  const { contactInfo, fetchContactInfo } = useContext(StoreContext);

  // Ensure data refresh (optional, since context already fetches once globally)
  useEffect(() => {
    if (!contactInfo.email || !contactInfo.phone) {
      fetchContactInfo();
    }
  }, []);

  const { email, phone, socialLinks } = contactInfo || {};

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        {/* =========================== Footer Links Sections =========================== */}
        <div className="footer-links">
          {/* Trending Wear */}
          <div>
            <h4>Trending Wear</h4>
            <ul>
              <Link to="/shop">
                <li>Shirts</li>
              </Link>
              <Link to="/shop">
                <li>Hoodies</li>
              </Link>
              <Link to="/shop">
                <li>Jackets</li>
              </Link>
            </ul>
          </div>

          {/* Men's Wear */}
          <div>
            <h4>Men's Wear</h4>
            <ul>
              <Link to="/shop">
                <li>Hoodies</li>
              </Link>
              <Link to="/shop">
                <li>Jackets</li>
              </Link>
              <Link to="/shop">
                <li>More...</li>
              </Link>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4>Account</h4>
            <ul>
              <li>
                <Link to="/orders">My Orders</Link>
              </li>
              <li>
                <Link to="/cart">Wishlist</Link>
              </li>
              <li>
                <Link to="/orders">Track Order</Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4>Policies</h4>
            <ul>
              <Link to="/policies">
                <li>Shipping</li>
              </Link>
              <Link to="/policies">
                <li>Returns</li>
              </Link>
              <Link to="/policies">
                <li>Privacy</li>
              </Link>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4>Get in Touch</h4>
            <ul>
              <li>Phone: {phone || "+91 9876543210"}</li>
              <li>
                <a href={`mailto:${email || "support@menwear.com"}`}>
                  Email: {email || "support@menwear.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr />

        {/* =========================== Social Media & Rights =========================== */}
        <div className="footer-social-media-links">
          <p className="rights">&copy; 2025 urbancore. All rights reserved.</p>
          <div>
            {socialLinks?.instagram && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                <img src={assets.instagram_icon} alt="LinkedIn" />
              </a>
            )}

            {socialLinks?.linkedin && (
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer">
                <img src={assets.linkedin_icon} alt="YouTube" />
              </a>
            )}

            {socialLinks?.twitter && (
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
                <img src={assets.twitter_icon} alt="Facebook" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
