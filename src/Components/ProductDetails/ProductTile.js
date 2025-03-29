import React, { useState } from "react";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const ProductTile = ({ product,onClick }) => {
  const { name, image, price, discount, quantity, variants } = product;

  const [count, setCount] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    variants && variants.length > 0 ? variants[0] : null
  );

  const handleAdd = (e) => {
    e.stopPropagation();
    setCount(1);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (count < 3) setCount(count + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    setCount(count > 1 ? count - 1 : 0);
  };

  return (
    <div className="border rounded-lg p-3 shadow-md w-[140px] bg-white flex flex-col items-left h-56 cursor-pointer relative" >
      {/* Product Image with Discount Tag */}
      <div className="w-full h-20 bg-gray-100 flex justify-center items-center relative" onClick={onClick}>
        <LazyImage
          src={image}
          alt={name}
          className="w-full h-full object-contain rounded-md"
        />
        {discount && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="text-left mt-2 w-full">
        <h3 className="text-sm font-medium">{name}</h3>

        {/* Variant Selection */}
        {variants && variants.length > 0 ? (
          <div className="mt-1 flex flex-col space-y-1">
            <label className="text-xs font-medium text-gray-700">Select Variant:</label>
            <select
              className="w-full text-xs border rounded-md p-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-400"
              value={selectedVariant?._id}
              onChange={(e) => {
                const variant = variants.find((v) => v._id === e.target.value);
                setSelectedVariant(variant);
              }}
            >
              {variants.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.qty} {variant.unit} - ₹{variant.discountPrice}  
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Quantity: {quantity || "N/A"}</p>
        )}
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center w-full mt-2 h-16">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            ₹{selectedVariant ? selectedVariant.discountPrice : price ?? "N/A"}
          </p>
          <p className="text-xs font-semibold text-gray-500 line-through">
            ₹{selectedVariant ? selectedVariant.price : (price * 1.2).toFixed(2)}
          </p>
        </div>

        {count === 0 ? (
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-lg w-16 h-8 shadow-md hover:bg-green-600"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center space-x-1 bg-green-500 text-white rounded-lg w-16 h-8 shadow-md">
            <button
              onClick={handleDecrease}
              className="px-2 py-1 font-bold"
            >
              -
            </button>
            <span className="text-sm font-semibold">{count}</span>
            <button
              onClick={handleIncrease}
              className={`px-2 py-1 font-bold ${
                count < 3 ? "cursor-pointer" : "text-gray-300 cursor-not-allowed"
              }`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTile;
