import React, { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useActiveUser } from "../../../context/ActiveUserContext";
import ExpandableCard from "../../../components/cards/ExpandableCard";


const SellList = () => {
  const [sells, setSells] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openHistories, setOpenHistories] = useState({});
  const [openRejections, setOpenRejections] = useState({});

  const { userId } = useActiveUser();
  const navigate = useNavigate();

  // fetch user
  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then(res => setClient(res.data));
  }, [userId]);

  useEffect(() => {
    api.get("/getsellproperties").then(res => setSells(res.data || []));
  }, []);

  const toggleHistory = (id) => {
    setOpenHistories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRejection = (sellId, payId) => {
    setOpenRejections(prev => ({
      ...prev,
      [`${sellId}-${payId}`]: !prev[`${sellId}-${payId}`]
    }));
  };

  const handleAddSell = () => navigate("/admin/salescard/addsell");

  const handleNavigateToSellForm = () => {
    navigate("/admin/salescard/addsell", { state: { client } });
  };

  const mockPayments = () => [
    { id: 1, amount: 10000, status: "Deleted", date: "11/11/2025", reason: "Hekk" },
    { id: 2, amount: 19998, status: "Completed", date: "12/11/2025" },
    { id: 3, amount: 1312, status: "Deleted", date: "11/11/2025" },
  ];

  return (
    <>
      <Sidebar />

      <div className="admin-panel-header-div no-navbar">
        {/* HEADER */}
        <div className="add-form-header">
          <Link to="/admin/user-dashboard" className="back-arrow-btn">
            <HiOutlineArrowLeft />
          </Link>
          <h5>{client?.name || "Client"}</h5>
          <button
            className="form-hamburger-btn"
            onClick={() => window.toggleAdminSidebar?.()}
          >
            <FiMenu />
          </button>
        </div>

        <div className="sales-page-container">
            <div className="sales-page-title-bar">
              <h2 className="sales-page-title">Sales</h2>
              <button className="primary-btn add-sell-btn" onClick={handleAddSell}>
                <Plus size={16} />
                Add Sell
              </button>
            </div>

            <div className="sales-divider" />

            {sells.map((item, index) => (
              <ExpandableCard
                key={item.id}
                id={item.id}
                index={index}
                title={item.title}
                amount={item.amount}
                date={new Date(item.created_at).toLocaleDateString()}
                status={item.status}
                payments={mockPayments()}
                isHistoryOpen={openHistories[item.id]}
                onToggleHistory={toggleHistory}
                openRejections={openRejections}
                onToggleRejection={toggleRejection}
                onAddPayment={() => navigate("/admin/add-payment", { state: { saleId: item.id } })}
                onCancel={() => console.log("Cancel Sale", item.id)}
              />
            ))}
          </div>
        </div>
      </>
      );
};

      export default SellList;
