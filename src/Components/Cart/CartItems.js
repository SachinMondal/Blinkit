import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const CartItem = ({ max = 3 }) => {
  const location = useLocation(); 
  const { cartItems } = useSelector((state) => state.cart);
  if (!cartItems || cartItems.length === 0 || location.pathname === "/cart") return null;
  return (
    <div className="transform -translate-x-1/2 hover:animate-pulse">
      <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
        {/* Display up to `max` cart items as avatars */}
        <div className="flex -space-x-2">
          {cartItems.slice(0, max).map((item, index) => (
            <LazyImage
              key={index}
              src={item.productId.image} 
              alt={item.productId.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
          ))}
        </div>

        {/* Show "+X" if more items exist */}
        {cartItems.length > max && (
          <span className="text-gray-700 font-semibold text-sm px-2 py-1 bg-gray-200 rounded-full">
            +{cartItems.length - max}
          </span>
        )}


        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

export default CartItem;
