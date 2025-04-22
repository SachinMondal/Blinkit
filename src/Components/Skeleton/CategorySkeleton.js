import React from "react";

const CategorySkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto flex gap-4 flex-col overflow-hidden min-h-screen animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 bg-gray-300 rounded w-40"></div>

      {/* Category Name */}
      <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>

      {/* Simulating 2-3 subcategories */}
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="mb-8">
          {/* Subcategory Title */}
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>

          {/* Product Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-1">
            {[...Array(7)].map((_, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-200 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
