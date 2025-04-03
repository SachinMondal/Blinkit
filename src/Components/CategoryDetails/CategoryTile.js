import React from "react";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const CategoryTile = ({ image, name, discount ,onClick}) => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-sm w-[140px] cursor-pointer" onClick={onClick}>
      {/* Discount Tag */}
      {discount && (
        <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-semibold px-1 py-0.5 rounded-md z-40">
          {discount}% OFF
        </span>
      )}

      {/* Image */}
      <div className="w-full h-24">
        <LazyImage src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Product Name */}
      <div className="p-1 text-center">
        <h3 className="text-sm font-medium">{name}</h3>
      </div>
    </div>
  );
};

export default CategoryTile;
