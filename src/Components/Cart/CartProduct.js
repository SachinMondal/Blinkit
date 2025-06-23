import { useState } from "react";
import LazyImage from "../utils/LazyLoading/LazyLoading";
import { useDispatch } from "react-redux";
import {
  addToCart,
  fetchCart,
  removeFromCart,
} from "../../redux/state/cart/Action";

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const price = item.subtotalDiscountedPrice / item.quantity;

  const handleIncrease = async () => {
    if (quantity >= 3) return;
    const newQty = quantity + 1;
    setQuantity(newQty);

    try {
      const result = await dispatch(
        addToCart(item.product._id, item.variantIndex, newQty)
      );
      if (result) {
        dispatch(fetchCart());
      } else {
        setQuantity(quantity);
      }
    } catch (error) {
      console.error("Error updating cart", error);
      setQuantity(quantity);
    }
  };

  const handleDecrease = async () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);

      try {
        const result = await dispatch(
          addToCart(item.product._id, item.variantIndex, newQty)
        );
        if (result) {
          dispatch(fetchCart());
        } else {
          setQuantity(quantity);
        }
      } catch (error) {
        console.error("Error updating cart", error);
        setQuantity(quantity);
      }
    } else {
      try {
        const result = await dispatch(
          removeFromCart(item.product._id, item.variantIndex)
        );
        if (result) {
          dispatch(fetchCart());
        }
      } catch (error) {
        console.error("Error removing from cart", error);
      }
    }
  };

  // Product total price
  const itemTotal = price * quantity;

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 w-72 h-40">
      {/* Product Details */}
      <div className="flex items-center space-x-3">
        {item?.product?.images?.length > 0 ? (
          <LazyImage
            src={item?.product?.images[0] || "/images/default-product.jpg"}
            alt={item?.product?.name || "Unnamed Product"}
            className="w-14 h-14 rounded-md object-contain"
          />
        ) : (
          <p>No Image to Preview</p>
        )}

        <div className="flex-1">
          <h3 className="text-xs font-semibold">
            {item?.product?.name || "Unnamed Product"}
          </h3>
          <p className="text-xs line-through text-gray-600">
            ₹{Number(item.subtotalPrice).toFixed(2)} /each
          </p>
          <p className="text-xs text-gray-600">
            ₹{Number(price).toFixed(2)} /each
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-green-200 rounded-md w-16">
          <button
            onClick={handleDecrease}
            className="p-1 bg-green-200 rounded hover:bg-green-500 w-7"
          >
            -
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button
            onClick={handleIncrease}
            className={`p-1 bg-green-200 rounded w-7 ${
              quantity >= 3
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-green-500"
            }`}
            disabled={quantity >= 3}
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="mt-3 border-t pt-2 text-sm flex justify-between font-semibold">
        <span>Subtotal:</span> <span>₹{Number(itemTotal).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartProduct;
