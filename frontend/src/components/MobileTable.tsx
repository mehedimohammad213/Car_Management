import React from "react";

interface MobileTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
  }[];
  onRowClick?: (item: any) => void;
  className?: string;
}

const MobileTable: React.FC<MobileTableProps> = ({
  data,
  columns,
  onRowClick,
  className = "",
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {data.map((item, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${
            onRowClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
          }`}
          onClick={() => onRowClick?.(item)}
        >
          <div className="space-y-2">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex justify-between items-start"
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0 flex-shrink-0 mr-2">
                  {column.label}:
                </span>
                <div className="text-sm text-gray-900 dark:text-white text-right min-w-0 flex-1">
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileTable;
