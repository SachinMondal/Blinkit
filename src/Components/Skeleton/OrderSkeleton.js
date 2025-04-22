import React from "react";

const OrderSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-40"></div>
              <div className="h-4 bg-gray-300 rounded w-56"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="space-y-2 md:text-right">
              <div className="h-4 bg-gray-300 rounded w-24 md:ml-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-32 md:ml-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSkeleton;
