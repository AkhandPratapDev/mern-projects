import React, { useState, useEffect, useRef, useContext } from "react";
import "./ContactFormPopup.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { successToast, errorToast, warningToast } from "../../utils/toast";

const ContactFormPopup = ({ onClose }) => {
  const { url, token } = useContext(StoreContext);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    reason: "",
  });

  // State to track submission status
  const [submitted, setSubmitted] = useState(false);

  // Reference for popup container (can be used for outside click detection if needed)
  const popupRef = useRef(null);

  //  Effect: Close popup when user scrolls
  useEffect(() => {
    const handleScroll = () => onClose();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onClose]);

  //  Handle form input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block submission if user not authenticated
    if (!token) {
      warningToast("Please sign up or login first!");
      return;
    }

    try {
      // API call to send contact form
      const response = await axios.post(`${url}/api/contact`, formData, {
        headers: { token }, // raw token as middleware expects
      });

      if (response.data.success) {
        setSubmitted(true);

        // Auto-close after 2 seconds
        setTimeout(() => onClose(), 2000);
      } else {
        errorToast(response.data.message);
      }
    } catch (error) {
      errorToast("Something went wrong!");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        {/* Close button */}
        <button className="popup-close" onClick={onClose}>
          ✖
        </button>

        <div className="popup-content">
          {/*  Left Section: Contact Form */}
          <div className="popup-form-section">
            {!submitted ? (
              <>
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit} className="popup-form">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="reason"
                    placeholder="Reason for contacting us..."
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </form>
              </>
            ) : (
              //  Show message after successful submission
              <p className="thank-you">
                  ✅ Thank you! Our team will contact you soon.
              </p>
            )}
          </div>

          {/*  Right Section: Illustration Image */}
          <div className="popup-image-section">
            <img src={assets.contact_form_img} alt="Contact Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
 