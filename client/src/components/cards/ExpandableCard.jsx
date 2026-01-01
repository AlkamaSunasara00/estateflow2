import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaFileDownload,
  FaTrashAlt,
  FaEllipsisV,
} from "react-icons/fa";
import "../../assets/css/components/cards/ExpandableCard.css";

const ExpandableCard = ({
  id,
  index,
  title,
  amount,
  date,
  description = "2BHK, Family Friendly Property",
  payments = [], // array of { amount, status, date, reason }
  onAddPayment,
  onEdit,
  onDelete,
  onAddBroker,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openReject, setOpenReject] = useState({});
  const [openMenu, setOpenMenu] = useState(false);

  const toggleReject = (payId) => {
    setOpenReject((prev) => ({ ...prev, [payId]: !prev[payId] }));
  };

  return (
    <div className="client-property-sale">
      {/* TOP HEADER */}
      <div
        className="client-property-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="client-property-name">{title}</span>
        <span className="client-property-date">{date}</span>
      </div>

      {/* PRICE */}
      <p className="client-sale-price">₹{Number(amount).toLocaleString()}</p>

      {/* DESCRIPTION + ACTIONS */}
      <div className="client-sale-plan">
        <p className="client-sale-note">{description}</p>

        <div className="sale-actions">
          {/* Expand Toggle */}
          <button
            className="sale-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {/* Three-dot Menu */}
          <button
            className="sale-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(!openMenu);
            }}
          >
            <FaEllipsisV />
          </button>

          {/* Dropdown Menu */}
          {openMenu && (
            <div className="sale-menu-dropdown">
              <button onClick={(e) => { e.stopPropagation(); onEdit?.(id); }}>
                Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}>
                Delete
              </button>
              <button onClick={(e) => { e.stopPropagation(); onAddBroker?.(id); }}>
                Add Broker
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      {isOpen && (
        <div className="client-transaction-box">
          <div className="client-transaction-header">
            <h5>Transaction History</h5>
            <button className="client-add-payment-btn" onClick={(e) => {
              e.stopPropagation();
              onAddPayment?.(id);
            }}>
              Add Payment
            </button>
          </div>

          <table className="client-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td data-label="S.No">{idx + 1}</td>
                    <td data-label="Amount">₹{Number(pay.amount).toLocaleString()}</td>
                    <td data-label="Status">
                      <span className={`client-badge ${pay.status?.toLowerCase()}`}>
                        {pay.status || "Pending"}
                      </span>
                    </td>
                    <td data-label="Payment Date">{pay.date}</td>
                    <td data-label="Actions">
                      <div className="action-btn-group">
                        <button className="client-download-btn">
                          <FaFileDownload />
                        </button>
                        <button className="client-delete-btn">
                          <FaTrashAlt />
                        </button>
                        {pay.reason && (
                          <button
                            className="reject-toggle-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReject(idx);
                            }}
                          >
                            {openReject[idx] ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Rejection Reason Row */}
                  {pay.reason && openReject[idx] && (
                    <tr className="reject-detail-row">
                      <td colSpan="5" className="reject-cell">
                        <div className="reject-wrapper">
                          <span className="reject-label">Rejection Reason:</span>
                          <span className="reject-text">{pay.reason}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;