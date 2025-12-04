import React from "react";
import PropTypes from "prop-types";
import "../../../assets/css/admin/common/CommonCard.css";

const CommonCard = ({ avatar, title, meta, onClick, compact = false }) => {
  return (
    <button
      type="button"
      className={`common-card ${compact ? "common-card--compact" : ""}`}
      onClick={onClick}
    >
      <div className="common-card__left">
        <div className="common-card__avatar">
          {avatar ? (
            <img src={avatar} alt={title} />
          ) : (
            <div className="common-card__avatar--placeholder" />
          )}
        </div>
      </div>

      <div className="common-card__body">
        <div className="common-card__title">{title}</div>
        <div className="common-card__meta">{meta || "-"}</div>
      </div>

      <div className="common-card__right">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
};

CommonCard.propTypes = {
  avatar: PropTypes.string,
  title: PropTypes.string.isRequired,
  meta: PropTypes.string,
  onClick: PropTypes.func,
  compact: PropTypes.bool,
};

export default CommonCard;
