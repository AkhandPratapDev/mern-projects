import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./ContactInfoAdmin.css";

const DEFAULT_CONTACT = {
  email: "example@gmail.com",
  phone: "+1 (555) 123-4567",
  socialLinks: {
    instagram: "https://instagram.com/example",
    twitter: "https://twitter.com/example",
    linkedin: "https://linkedin.com/company/example",
  },
};

const ContactInfoAdmin = () => {
  const { contactInfo, fetchContactInfo, updateContactInfo } =
    useContext(StoreContext);
  const [form, setForm] = useState(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchContactInfo();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (contactInfo && Object.keys(contactInfo).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...contactInfo,
        socialLinks: { ...prev.socialLinks, ...contactInfo.socialLinks },
      }));
    }
  }, [contactInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.socialLinks) {
      setForm({
        ...form,
        socialLinks: { ...form.socialLinks, [name]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateContactInfo(form);
  };

  if (loading) return <p className="loading">Loading contact info...</p>;

  return (
    <>
      {/* === Contact Info Card === */}
      <div className="card contact-card">
        <h3>📞 Contact Information</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <button type="submit" className="save-btn">
            Save Contact Info
          </button>
        </form>
      </div>

      {/* === Social Links Card === */}
      <div className="card social-card">
        <h3>🌐 Social Media Links</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          {Object.keys(form.socialLinks).map((key) => (
            <div className="form-row" key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="url"
                name={key}
                value={form.socialLinks[key] || ""}
                onChange={handleChange}
                placeholder={`Enter ${key} link`}
              />
            </div>
          ))}

          <button type="submit" className="save-btn">
            Save Social Links
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactInfoAdmin;
