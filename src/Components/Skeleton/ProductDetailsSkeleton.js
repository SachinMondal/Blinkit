import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetailsSkeleton = () => {
  return (
    <div className="animate-pulse px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Skeleton width={150} />
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:space-x-6">
        {/* Left: Image and Product Info */}
        <div className="w-full lg:w-1/2 p-2 border-r">
          <div className="w-full h-96 bg-gray-200 rounded mb-6" />

          <div className="space-y-4 border-t pt-4">
            <Skeleton height={24} width={`60%`} />
            <Skeleton height={20} width={`40%`} />
            <Skeleton height={28} width={`30%`} />

            <div>
              <Skeleton height={24} width={`50%`} />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
              </div>
            </div>

            <div className="border-t pt-4">
              <Skeleton height={24} width={`50%`} />
              <Skeleton count={4} height={18} className="mt-2" />
            </div>
          </div>
        </div>

        {/* Right: Variant Selector & Cart Buttons */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          <div className="hidden lg:block mb-4 text-sm text-gray-500">
            <Skeleton width={180} />
          </div>

          <Skeleton height={24} width={`30%`} className="mb-2" />
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  {[...Array(4)].map((_, i) => (
                    <th key={i} className="px-3 py-2">
                      <Skeleton width={60} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(2)].map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {[...Array(4)].map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-3 py-2 border border-gray-300"
                      >
                        <Skeleton width={70} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Skeleton width={160} height={40} borderRadius={8} />
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-20">
        <Skeleton height={28} width={`30%`} className="mb-4" />
        <div className="flex flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-36 h-52 rounded-lg bg-gray-200"
            >
              <Skeleton height={`100%`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
