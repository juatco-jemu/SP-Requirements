import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { CustomButton } from "./ui/CustomButton.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T) => JSX.Element; // Add optional render function for dynamic cells
};

type CustomTableProps<T> = {
  columns: Array<Column<T>>;
  data: Array<T>;
  itemsPerPage?: number; // Optional prop for customizing the number of items per page
  boldColumns?: string[];
};

export function CustomTable<T>({ columns, data, itemsPerPage = 10, boldColumns }: CustomTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "ascending" | "descending" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (key: keyof T) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key ? (sortConfig.direction === "ascending" ? "sort-asc" : "sort-desc") : undefined;
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfMaxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - halfMaxPagesToShow) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - halfMaxPagesToShow + 1; i <= currentPage + halfMaxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className={`py-2 px-4 border-b border-gray-200 bg-up_green text-left text-md font-semibold text-white cursor-pointer ${getClassNamesFor(
                  column.accessor
                )}`}
                onClick={() => requestSort(column.accessor)}
              >
                {column.header}
                {sortConfig && sortConfig.key === column.accessor && (
                  <FontAwesomeIcon icon={sortConfig.direction === "ascending" ? faSortUp : faSortDown} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              {columns.map((column) => (
                <td
                  key={String(column.accessor)}
                  className={`py-2 px-4 border-b border-gray-200 ${
                    boldColumns?.includes(String(column.accessor)) ? "font-bold" : ""
                  }`}
                >
                  {column.render ? column.render(row) : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4">
        <CustomButton
          size="icon"
          variant="ghost"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="disabled:opacity-50 mr-2"
        >
          <ChevronLeft />
        </CustomButton>
        <div className="flex space-x-2">
          {generatePageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => typeof pageNumber === "number" && handlePageClick(pageNumber)}
              className={`px-4 py-2 rounded ${
                currentPage === pageNumber ? "bg-up_green text-white" : "bg-gray-300 text-gray-700"
              }`}
              disabled={pageNumber === "..."}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <CustomButton
          size="icon"
          variant="ghost"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className=" disabled:opacity-50 ml-2"
        >
          <ChevronRight />
        </CustomButton>
      </div>
    </div>
  );
}
