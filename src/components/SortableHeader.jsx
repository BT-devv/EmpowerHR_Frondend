import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const SortableHeader = ({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = "",
}) => {
  const handleSort = () => {
    onSort(sortKey);
  };

  const renderSortIcon = () => {
    if (sortConfig?.key !== sortKey) return <FaSort className="ml-1" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  return (
    <th
      onClick={handleSort}
      className={`${className} cursor-pointer select-none`}
    >
      <div className="flex items-center gap-1">
        {label}
        {renderSortIcon()}
      </div>
    </th>
  );
};

export default SortableHeader;
