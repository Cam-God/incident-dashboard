function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="page-section">
      <div
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || currentPage < 1}
        className="page-arrow"
      >
        &lt;
      </div>

      {currentPage > 1 && (
        <div
          onClick={() => onPageChange(currentPage - 1)}
          className="page-number"
        >
          {currentPage - 1}
        </div>
      )}

      <span className="page-number current-page-number">{currentPage}</span>

      {currentPage < totalPages && (
        <div
          onClick={() => onPageChange(currentPage + 1)}
          className="page-number"
        >
          {currentPage + 1}
        </div>
      )}

      <div
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="page-arrow"
      >
        &gt;
      </div>
    </div>
  );
}

export default Pagination;
