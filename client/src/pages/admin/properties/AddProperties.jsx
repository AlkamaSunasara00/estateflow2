import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { MdSave } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/css/admin/common/form.css";

const AddProperty = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    status: "available",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(""); // For live preview
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setForm((p) => ({ ...p, image: file }));
    setPreviewUrl(URL.createObjectURL(file)); // Generate preview
  };

  const isValid = () => form.title.trim() && form.price && form.address.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return toast.warn("Please fill required fields");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("address", form.address);
      fd.append("price", form.price);
      fd.append("status", form.status);
      if (form.image) fd.append("image", form.image);

      await api.post("/addproperty", fd);
      toast.success("Property added successfully");
      setTimeout(() => navigate("/admin/properties"), 800);
    } catch (err) {
      const message = err?.response?.data?.error || "Failed to add property";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleHamburgerClick = () => {
    if (window.toggleAdminSidebar) window.toggleAdminSidebar();
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <>
      <Sidebar />

      <main className="admin-panel-header-div no-navbar">
        {/* Header */}
        <div className="add-form-header">
          <Link to="/admin/properties" className="back-arrow-btn">
            <HiOutlineArrowLeft />
          </Link>
          <h5>Add Property</h5>
          <button className="form-hamburger-btn" onClick={handleHamburgerClick} aria-label="Toggle sidebar">
            <FiMenu />
          </button>
        </div>

        {/* Form Content */}
        <div className="form-content-after-header">
          <form onSubmit={handleSubmit} className="form-layout">
            {/* Left Column */}
            <div>
              <div className="form-card">
                <h6>General Information</h6>
                <div className="form-group">
                  <label>Property Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Type property title here..." />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Type property description here..." />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Type property address..." />
                </div>
              </div>

              <div className="form-card">
                <h6>Media</h6>
                <div className="upload-box" onClick={() => fileRef.current?.click()}>
                  {previewUrl ? (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={previewUrl}
                        alt="Property preview"
                        style={{
                          width: "100%",
                          maxWidth: 300,
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 16,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                          margin: "0 auto",
                          display: "block",
                        }}
                      />
                      <p style={{ marginTop: 14, fontSize: 13, color: "#555", textAlign: "center" }}>
                        Image selected – Click to change
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
                          alt="upload"
                        />
                      </div>
                      <p className="upload-text">Click to upload image</p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="form-card">
                <h6>Pricing & Status</h6>
                <div className="form-group">
                  <label>Base Price *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Type base price here..." />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Desktop Save Button */}
              <div className="desktop-save-wrapper">
                <button className="desktop-save-btn" onClick={handleSubmit} disabled={!isValid() || loading}>
                  <MdSave />
                  {loading ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Mobile Sticky Save Button */}
        <div className="sticky-bottom-save">
          <button onClick={handleSubmit} disabled={!isValid() || loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  );
};

export default AddProperty;