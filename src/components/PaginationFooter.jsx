import { IoIosArrowForward } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";

const PaginationFooter = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      if (currentPage > 2) pages.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages)
        pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push(currentPage + 1);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-3 py-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`min-w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border caret-transparent border-[#B0BAC3] ${
            currentPage === page
              ? "bg-[#2EB67D] text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="flex flex-wrap items-center w-full justify-between text-[#9A9A9A] caret-transparent p-4 gap-4 md:gap-6 mt-2">
      <p className="text-sm sm:text-base">
        Showing {startIndex} to {endIndex} of {totalItems} entries
      </p>
      <div className="flex items-center gap-2 text-black">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`min-w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <IoChevronBack />
        </button>
        {renderPagination()}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`min-w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <IoIosArrowForward />
        </button>
      </div>

      <div className="flex items-center gap-2 text-black">
        <p>Show</p>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-[80px] h-[50px] border border-gray-300 rounded-[8px] text-center bg-white cursor-pointer"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <p>entries</p>
      </div>
    </div>
  );
};

export default PaginationFooter;
