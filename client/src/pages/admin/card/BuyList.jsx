import React, { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useActiveUser } from "../../../context/ActiveUserContext";
import ExpandableCard from "../../../components/cards/ExpandableCard";

const BuyList = () => {
  const [buys, setBuys] = useState([]);
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
    api.get("/getbuyproperties").then(res => setBuys(res.data || []));
  }, []);

  const toggleHistory = (id) => {
    setOpenHistories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRejection = (buyId, payId) => {
    setOpenRejections(prev => ({
      ...prev,
      [`${buyId}-${payId}`]: !prev[`${buyId}-${payId}`]
    }));
  };

  const handleAddBuy = () => navigate("/admin/buycard/buysell");

  if (loading) return <p>Loading...</p>;

  const mockPayments = () => [
    { id: 1, amount: 15000, status: "Completed", date: "10/11/2025" },
    { id: 2, amount: 5000, status: "Deleted", date: "12/11/2025", reason: "Invalid proof" },
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

        {/* PAGE CONTENT */}
        <div className="sales-page-container">
6          <div className="sales-page-title-bar">
            <h2 className="sales-page-title">Purchace</h2>
            <button className="primary-btn add-sell-btn" onClick={handleAddBuy}>
              Buy Sell
            </button>
          </div>

          <div className="sales-divider" />

          {buys.map((item, index) => (
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
              onAddPayment={() => navigate("/admin/add-payment", { state: { buyId: item.id } })}
              onCancel={() => console.log("Cancel Buy", item.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BuyList;