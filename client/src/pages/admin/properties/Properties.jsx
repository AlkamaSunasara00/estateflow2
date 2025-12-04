// src/pages/admin/properties/Properties.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { IoPencil } from "react-icons/io5";

import "../../../assets/css/admin/product.css";
// reuse/manage admin responsive card styles (needed for card-list)
import "../../../assets/css/admin/pages/manageAdmin.css";

import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import Breadcrumb from "../layout/Breadcrumb";
import api from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CommonCard from "../common/CommonCard";

const PAGE_SIZE = 6; // same as before

const Properties = () => {
  const [activeTab, setActiveTab] = useState("All Properties");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // keep JS detection for when to render table vs cards
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // fetch
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get("/getproperties");
      setProperties(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("fetchProperties error:", err);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // responsive handler
  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleDeleteClick = async (e, property) => {
    e.stopPropagation();
    const ok = window.confirm(
      `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
    );
    if (!ok) return;

    try {
      await api.delete(`/deleteproperty/${property.id}`);
      toast.success("Property deleted successfully");
      await fetchProperties();
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err?.response?.data?.error || "Failed to delete property";
      toast.error(msg);
    }
  };

  const openDetails = (property) => {
    navigate(`/admin/property/${property.id}`, { state: { item: property } });
  };

  const onEdit = (e, property) => {
    e.stopPropagation();
    navigate(`/admin/properties/edit/${property.id}`);
  };

  // filters
  const filtered = properties.filter((p) =>
    activeTab === "All Properties"
      ? true
      : activeTab === "Available"
      ? p.status === "available"
      : activeTab === "Reserved"
      ? p.status === "reserved"
      : activeTab === "Sold"
      ? p.status === "sold"
      : true
  );

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const changePage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="admin-panel-header-div">
        <Breadcrumb
          title="Properties"
          breadcrumbText="Property List"
          button={{ link: "/admin/addproperty", text: "Add Property" }}
        />

        <div className="admin-panel-header-tabs" style={{ marginTop: 12 }}>
          <button
            className={`admin-panel-header-tab ${
              activeTab === "All Properties" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("All Properties");
              setCurrentPage(1);
            }}
          >
            All
          </button>

          <button
            className={`admin-panel-header-tab ${
              activeTab === "Available" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("Available");
              setCurrentPage(1);
            }}
          >
            Available
          </button>

          <button
            className={`admin-panel-header-tab ${
              activeTab === "Reserved" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("Reserved");
              setCurrentPage(1);
            }}
          >
            Reserved
          </button>

          <button
            className={`admin-panel-header-tab ${
              activeTab === "Sold" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("Sold");
              setCurrentPage(1);
            }}
          >
            Sold
          </button>
        </div>

        <div className="dashboard-table-container" style={{ marginTop: 18 }}>
          {/* Desktop / Large: show table */}
          {!isMobile && !isTablet && (
            <table>
              <thead>
                <tr>
                  <th style={{ width: "24%" }}>Property</th>
                  <th style={{ width: "22%" }}>Address</th>
                  <th style={{ width: "8%" }}>Price</th>
                  <th style={{ width: "8%" }}>Status</th>
                  <th style={{ width: "14%" }}>Added</th>
                  <th style={{ width: "12%" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                      Loading...
                    </td>
                  </tr>
                ) : paginated.length > 0 ? (
                  paginated.map((p) => (
                    <tr
                      key={p.id}
                      className="clickable-row"
                      onClick={() => openDetails(p)}
                    >
                      <td className="product-info">
                        <img
                          src={`/uploads/${p.image || "defaultpropertyimage.png"}`}
                          alt={p.title}
                          style={{
                            width: 72,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 6,
                            marginRight: 12,
                          }}
                        />
                        <span>{p.title}</span>
                      </td>

                      <td>{p.address}</td>

                      <td
                        style={{
                          fontWeight: 600,
                          color: "var(--primary-btn-bg)",
                        }}
                      >
                        ₹{p.price}
                      </td>

                      <td>
                        <span
                          className={`status ${
                            p.status === "available"
                              ? "published"
                              : p.status === "reserved"
                              ? "low-stock"
                              : "out-of-stock"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                      </td>

                      {/* DESKTOP ACTIONS - keep icons */}
                      <td className="actions">
                        <IoPencil
                          onClick={(e) => onEdit(e, p)}
                          style={{ cursor: "pointer", marginRight: 10 }}
                          title="Edit"
                        />
                        <IoIosEye
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(p);
                          }}
                          style={{ cursor: "pointer", marginRight: 10 }}
                          title="View"
                        />
                        <MdDeleteForever
                          onClick={(e) => handleDeleteClick(e, p)}
                          style={{
                            cursor: "pointer",
                            color: "var(--red-color)",
                          }}
                          title="Delete"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center", padding: 40, opacity: 0.6 }}
                    >
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Tablet / Mobile: card-list (uses CommonCard) */}
          {(isMobile || isTablet) && (
            <div className="card-list" style={{ padding: 12 }}>
              {paginated.length > 0 ? (
                paginated.map((p) => {
                  const avatar = p.image ? `/uploads/${p.image}` : null;
                  // Title top, address as subtitle, price as meta
                  return (
                    <CommonCard
                      key={p.id}
                      avatar={avatar}
                      title={p.title}
                      subtitle={p.address}
                      meta={`₹${p.price}`}
                      onClick={() => openDetails(p)}
                      compact={true}
                    />
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: 16 }}>No properties found</div>
              )}
            </div>
          )}

          {/* Footer pagination */}
          <div className="table-footer-pagination" style={{ marginTop: 12 }}>
            <span>
              Showing {filtered.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + PAGE_SIZE, filtered.length)} from {filtered.length}
            </span>

            <ul className="pagination">
              <li className="arrow" onClick={() => changePage(currentPage - 1)}>
                <HiOutlineArrowLeft />
              </li>

              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => changePage(i + 1)}
                >
                  {String(i + 1).padStart(2, "0")}
                </li>
              ))}

              <li className="arrow" onClick={() => changePage(currentPage + 1)}>
                <HiOutlineArrowRight />
              </li>
            </ul>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
      </main>
    </>
  );
};

export default Properties;
