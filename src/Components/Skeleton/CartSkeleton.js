import React from "react";

const CartSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto mt-6 flex flex-col gap-8 overflow-hidden px-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="h-6 w-32 bg-gray-300 rounded"></div>
        <div className="h-9 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* Cart items skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-center sm:items-start justify-center sm:justify-start">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="w-full sm:w-64 h-48 bg-gray-200 rounded-lg shadow-sm"
          />
        ))}
      </div>

      {/* Summary skeleton */}
      <div className="flex flex-col items-center sm:items-end justify-center sm:justify-end">
        <div className="w-72 h-32 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};

export default CartSkeleton;
