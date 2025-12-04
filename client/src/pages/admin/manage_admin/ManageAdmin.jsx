import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { IoIosEye } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
import { TbTrashOff } from "react-icons/tb";

import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import Breadcrumb from "../layout/Breadcrumb";
import api from "../../../api/axiosInstance";

const PAGE_SIZE = 5;

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [rolesMap, setRolesMap] = useState({});
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("All"); // 👉 All | Trash
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const usersRes = await api.get("/users");
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        setAdmins(users);

        const rolesRes = await api.get("/user-roles");
        const mappings = Array.isArray(rolesRes.data) ? rolesRes.data : [];

        const map = {};
        mappings.forEach((row) => {
          if (!map[row.user_id]) map[row.user_id] = [];
          map[row.user_id].push(row.role_name);
        });

        Object.keys(map).forEach((id) => {
          map[id] = map[id].join(", ");
        });

        setRolesMap(map);
      } catch (err) {
        console.error("Error loading admins:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const moveToTrash = async (id) => {
    await api.put(`/trash-user/${id}`, { status: "trash" });
    alert("User gone to trash")
    setAdmins((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "trash" } : u
      )
    );
  };

  const restoreUser = async (id) => {
    await api.put(`/trash-user/${id}`, { status: "active" });
     alert("User untrash")

    setAdmins((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "active" } : u
      )
    );
  };

  const deleteUserForever = async (id) => {
    if (!window.confirm("Delete permanently?")) return;

    await api.delete(`/users/${id}`);
    setAdmins((prev) => prev.filter((u) => u.id !== id));
  };


  const filteredAdmins = admins.filter((admin) => {
    if (activeTab === "All") return admin.status !== "trash";
    if (activeTab === "Trash") return admin.status === "trash";
    return true;
  });

  const totalPages = Math.ceil(filteredAdmins.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filteredAdmins.slice(start, start + PAGE_SIZE);

  const changePage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };


  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Sidebar />
      <Navbar />

      <main className="admin-panel-header-div">
        <Breadcrumb
          title="Clients"
          breadcrumbText="Clients List"
          button={{ link: "/admin/add-new_client", text: "Add New Client" }}
        />

        {/* TABS */}
        <div className="admin-panel-header-tabs">
          {["All", "Trash"].map((tab) => (
            <button
              key={tab}
              className={`admin-panel-header-tab ${activeTab === tab ? "active" : ""
                }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="dashboard-table-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Roles</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        No data found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((user) => (
                      <tr key={user.id}>
                        <td className="product-info admin-profile">
                          <img src={`/uploads/${user.img}`} alt="profile" />
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.number}</td>
                        <td>{rolesMap[user.id] || "-"}</td>
                       <td>
                      <span
                        className={`status ${user.status === "active"
                          ? "published"
                          : "out-of-stock"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                        <td>{formatDate(user.created_at)}</td>

                        <td className="actions">
                          {activeTab === "All" && (
                            <>
                              <IoPencil
                                onClick={() =>
                                  navigate("/admin/edit-client", {
                                    state: { admin: user },
                                  })
                                }
                              />
                              <IoIosEye />

                              {/* MOVE TO TRASH */}
                              <MdDeleteForever
                                onClick={() => moveToTrash(user.id)}
                              />
                            </>
                          )}

                          {activeTab === "Trash" && (
                            <>
                              {/* RESTORE */}
                              <TbTrashOff
                                onClick={() => restoreUser(user.id)}
                              />

                              {/* DELETE PERMANENT */}
                              <MdDeleteForever
                                onClick={() => deleteUserForever(user.id)}
                                style={{ marginLeft: 10 }}
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="table-footer-pagination">
                <span>
                  Showing {filteredAdmins.length === 0 ? 0 : start + 1}-
                  {Math.min(start + PAGE_SIZE, filteredAdmins.length)} of{" "}
                  {filteredAdmins.length}
                </span>

                <ul className="pagination">
                  <li onClick={() => changePage(currentPage - 1)}>
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

                  <li onClick={() => changePage(currentPage + 1)}>
                    <HiOutlineArrowRight />
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ManageAdmin;
