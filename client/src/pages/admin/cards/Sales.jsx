// SalesCard.jsx
import React, { useState } from 'react';
import { ChevronDown, Calendar, X, Plus } from 'lucide-react';
import '../../../assets/css/admin/cards/SalesCard.css';
import Sidebar from '../layout/Sidebar';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const SalesCard = () => {
  const handleHamburgerClick = () => {
    if (window.toggleAdminSidebar) window.toggleAdminSidebar();
  };

  const [sales, setSales] = useState([
    {
      id: 22,
      complex: 'Diamond Complex',
      date: 'Aug 25, 2025',
      amount: '10,000/-',
      requests: 2,
      open: true,
    },
  ]);



  const toggleCard = (id) => {
    setSales(prev =>
      prev.map(sale =>
        sale.id === id ? { ...sale, open: !sale.open } : sale
      )
    );
  };

  return (
    <>
      <Sidebar />

      {/* TOP HEADER */}
      <div className="admin-panel-header-div no-navbar">
        <div className="add-form-header">
          <Link to="/admin/user-dashboard" className="back-arrow-btn">
            <HiOutlineArrowLeft />
          </Link>

          <h5>John Doe</h5>

          <button
            className="form-hamburger-btn"
            onClick={() =>
              window.toggleAdminSidebar && window.toggleAdminSidebar()
            }
          >
            <FiMenu />
          </button>
        </div>

        <div className="sales-page-container">
          {/* SALES TITLE BAR */}
          <div className="sales-card-header sales-header">
            <h2 className="sales-title">Sales</h2>
            <button className="primary-btn add-sell-button">
              <Plus size={16} />
              Add Sell
            </button>
          </div>

          <div className="sales-divider" />

          {/* SALES CARDS */}
          {sales.map(sale => (
            <div
              key={sale.id}
              className="sales-booking-card"
              style={{
                padding: sale.open ? '20px' : '20px 20px',
              }}
            >
              {/* CARD HEADER */}
              <div
                className="sales-card-header"
                style={{ marginBottom: sale.open ? '20px' : '0' }}
              >
                <div>
                  <div className="booking-id">#{sale.id}</div>
                  <div className="complex-name">{sale.complex}</div>
                </div>

                <button
                  className={`sales-toggle-btn ${sale.open ? 'expanded' : ''}`}
                  onClick={() => toggleCard(sale.id)}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* COLLAPSIBLE CONTENT */}
              {sale.open && (
                <>
                  <div className="booking-date">
                    <Calendar size={16} />
                    <span>{sale.date}</span>
                  </div>

                  <div className="booking-amount-section">
                    <div className="booking-amount">
                      Amount:{' '}
                      <span className="amount-value">{sale.amount}</span>
                    </div>
                    <button className="primary-btn view-requests-btn">
                      View {sale.requests} Requests
                    </button>
                  </div>

                  <button className="cancel-booking-btn">
                    <X size={18} />
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div >
    </>
  );
};

export default SalesCard;
