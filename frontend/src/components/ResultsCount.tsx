import React from "react";
import { TrendingUpIcon } from "lucide-react";

interface ResultsCountProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const ResultsCount: React.FC<ResultsCountProps> = ({
  startIndex,
  endIndex,
  totalItems,
}) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-gray-600 dark:text-gray-400">
        Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
        <span className="font-semibold">{endIndex}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> cars
      </p>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <TrendingUpIcon className="w-4 h-4" />
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ResultsCount;
