import React from "react";
import LazyImage from "../utils/LazyLoading/LazyLoading";
import { Link } from "react-router-dom";

const CategoryTile = ({ image, name, discount, subId }) => {
  return (
    <Link to={`/categoryviewAll/${subId}`}>
      <div className="relative rounded-lg overflow-hidden shadow-sm w-[140px] cursor-pointer">
        {discount>0 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-semibold px-1 py-0.5 rounded-md z-10">
            {discount}% OFF
          </span>
        )}
        <div className="w-full h-24">
          <LazyImage
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-1 text-center">
          <h3 className="text-sm font-medium">{name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryTile;
