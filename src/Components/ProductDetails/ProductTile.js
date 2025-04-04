import React, { useState, useEffect } from "react";
import LazyImage from "../utils/LazyLoading/LazyLoading";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  fetchCart,
} from "../../redux/state/cart/Action";

const ProductTile = ({ product, onClick }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { name, image, price, discount, quantity, variants } = product;
  const [selectedVariant, setSelectedVariant] = useState(
    variants?.length > 0 ? variants[0] : null
  );
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch(fetchCart()); 
  }, [dispatch]);

  useEffect(() => {
    if (!selectedVariant || !cartItems || !Array.isArray(cartItems)) return;
  
    const cartItem = cartItems.find((item) =>
      item?.product?._id === product?._id &&
      item?.variantIndex === variants?.findIndex((v) => v?._id === selectedVariant?._id)
    );
  
    setCount(cartItem ? cartItem.quantity : 0);
  }, [cartItems, selectedVariant, product?._id, variants]);
  

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!selectedVariant) return;
  
    const variantIndex = variants.findIndex((v) => v._id === selectedVariant._id);
    if (variantIndex === -1) return;
  
    setLoading(true);
    try {
      const result = await dispatch(addToCart(product._id, variantIndex, 1));
      if (result) {
        setCount(1);  
        dispatch(fetchCart());
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleIncrease = async (e) => {
    e.stopPropagation();
    if (!selectedVariant || count >= 3) return;

    const variantIndex = variants.findIndex((v) => v._id === selectedVariant._id);
    if (variantIndex === -1) return;

    setLoading(true);
    try {
      const result = await dispatch(addToCart(product._id, variantIndex, count + 1));
      if (result) {
        dispatch(fetchCart());
        setCount(count + 1);
      }
    } catch (error) {
      console.error("Error updating cart", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    if (!selectedVariant || count === 0) return;

    const variantIndex = variants.findIndex((v) => v._id === selectedVariant._id);
    if (variantIndex === -1) return;

    setLoading(true);
    try {
      if (count > 1) {
        const result = await dispatch(addToCart(product._id, variantIndex, count - 1));
        if (result) {
          dispatch(fetchCart());
          setCount(count - 1);
        }
      } else {
        const result = await dispatch(removeFromCart(product._id, variantIndex));
        console.log(result);
        if (result) {
          dispatch(fetchCart());
          setCount(0);
        }
      }
    } catch (error) {
      console.error("Error updating cart", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-3 shadow-md w-[140px] bg-white flex flex-col items-left h-56 cursor-pointer relative">
      <div className="w-full h-20 bg-gray-100 flex justify-center items-center relative" onClick={onClick}>
        <LazyImage src={image} alt={name} className="w-full h-full object-contain rounded-md" />
        {discount && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="text-left mt-2 w-full">
        <h3 className="text-sm font-medium">{name}</h3>
        {variants?.length > 0 ? (
          <div className="mt-1 flex flex-col space-y-1">
            <label className="text-xs font-medium text-gray-700">Select Variant:</label>
            <select
              className="w-full text-xs border rounded-md p-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-400"
              value={selectedVariant?._id || ""}
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
            disabled={loading}
          >
            {loading ? "..." : "Add"}
          </button>
        ) : (
          <div className="flex items-center space-x-1 bg-green-500 text-white rounded-lg w-16 h-8 shadow-md">
            <button onClick={handleDecrease} className="px-2 py-1 font-bold" disabled={loading}>-</button>
            <span className="text-sm font-semibold">{count}</span>
            <button
              onClick={handleIncrease}
              className={`px-2 py-1 font-bold ${count < 3 ? "cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}
              disabled={loading || count >= 3}
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
