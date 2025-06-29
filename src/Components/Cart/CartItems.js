import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const CartItem = ({ max = 3 }) => {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);

  if (
    !cartItems ||
    cartItems.length === 0 ||
    location.pathname === "/cart" ||
    location.pathname === "/profile"
  ) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]"
      style={{ pointerEvents: "auto" }}
    >
      <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-all">
        <div className="flex -space-x-2">
          {cartItems?.slice(0, max).map((item, index) =>
            item?.product?.images?.length > 0 ? (
              <LazyImage
                key={item.product?.id || item.product?._id || index}
                src={item.product?.images[0]}
                alt={item.product?.name || "Product Image"}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
            ) : (
              <div
                key={
                  item.product?.id || item.product?._id || `no-image-${index}`
                }
                className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-gray-200 flex items-center justify-center text-xs text-gray-500"
              >
                N/A
              </div>
            )
          )}
        </div>

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
