import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const CartProduct = ({ item, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.qty);

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(item.id, newQty);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(item.id, newQty);
    }
  };

  // Product total price
  const itemTotal = item.price * quantity;

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 w-72 h-40">
      {/* Product Details */}
      <div className="flex items-center space-x-3">
        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-contain" />

        <div className="flex-1">
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-600">₹{item.price} each</p>
        </div>

        {/* Quantity Control */}
        <div className="flex items-center space-x-1 bg-green-200 rounded-md w-16">
          <button onClick={handleDecrease} className="p-1 bg-green-200 rounded hover:bg-green-500 w-7">
          -
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button onClick={handleIncrease} className="p-1 bg-green-200 rounded hover:bg-green-500 w-7">
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="mt-3 border-t pt-2 text-sm flex justify-between font-semibold">
        <span>Subtotal:</span> <span>₹{itemTotal}</span>
      </div>
    </div>
  );
};

export default CartProduct;
