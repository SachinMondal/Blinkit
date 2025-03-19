import React from "react";


const avatars = [
  
];

const CartItem = ({ max = 3 }) => {
  // If avatars array is empty, return null (hides the component)
  if (avatars.length === 0) return null;

  return (
    <div className="transform -translate-x-1/2">
      <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition hover:animate-bounce">
        {/* Display up to `max` avatars */}
        <div className="flex -space-x-2">
          {avatars.slice(0, max).map((avatar) => (
            <img
              key={avatar.id}
              src={avatar.src}
              alt={avatar.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
          ))}
        </div>

        {/* Show "+X" if more avatars exist */}
        {avatars.length > max && (
          <span className="text-gray-700 font-semibold text-sm px-2 py-1 bg-gray-200 rounded-full">
            +{avatars.length - max}
          </span>
        )}

        {/* Dropdown Carat (▼) */}
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

export default CartItem;
