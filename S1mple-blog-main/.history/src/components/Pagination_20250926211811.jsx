import React from "react";

const Pagination = ({ articlesCount, limit, currentPage, onPageChange }) => {
  const pages = Math.ceil(articlesCount / limit);

  return (
    <ul className="pagination">
      {Array.from({ length: pages }, (_, i) => (
        <li
          key={i}
          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
          onClick={() => onPageChange(i + 1)}
        >
          <span className="page-link">{i + 1}</span>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;