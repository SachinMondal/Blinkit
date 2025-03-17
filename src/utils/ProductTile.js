import React, { useState } from "react";

const ProductTile = ({ image, name, quantity, price }) => {
  const [count, setCount] = useState(0);
  const handleAdd = () => setCount(1);
  const handleIncrease = () => setCount(count + 1);
  const handleDecrease = () => setCount(count > 1 ? count - 1 : 0);

  return (
    <div className="border rounded-lg p-3 shadow-md w-[140px] bg-white flex flex-col items-left h-48 cursor-pointer">
      {/* Product Image */}
      <div className="w-full h-20 bg-gray-100 flex justify-center items-center">
        <img src={image} alt={name} className="w-full h-full object-cover rounded-md" />
      </div>

      {/* Product Details */}
      <div className="text-left mt-2 w-full">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">Quantity: {quantity || "N/A"}</p>
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center w-full mt-2 h-16">
        <div>
        <p className="text-sm font-semibold text-gray-800">₹{price ?? "N/A"}</p>
        <p className="text-xs font-semibold text-gray-800 line-through ">₹{price ?? "N/A"}</p>

        </div>

        {count === 0 ? (
          <button
            onClick={handleAdd}
            className="bg-green-300 text-green-900 font-bold text-xs px-3 py-1 rounded-lg w-16 h-8"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center space-x-1 bg-green-300 rounded-lg w-16 h-8">
            <button
              onClick={handleDecrease}
              className=" text-green-900 font-bold px-2 py-1 rounded-md"
            >
              -
            </button>
            <span className="text-sm font-semibold">{count}</span>
            <button
              onClick={handleIncrease}
              className=" text-green-900 font-bold px-2 py-1 rounded-lg w-16 h-8"
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
