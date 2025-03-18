import { useState } from "react";
import CartProduct from "./CartProduct";
import CartSummary from "./CartSummary";

const dummyItems = [
  {
    id: 1,
    name: "Apple",
    price: 50,
    qty: 2,
    image: "https://via.placeholder.com/50", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Banana",
    price: 30,
    qty: 3,
    image: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    name: "Mango",
    price: 80,
    qty: 1,
    image: "https://via.placeholder.com/50",
  },
];

const Cart = ({ items = dummyItems }) => {
  const [cartItems, setCartItems] = useState(items);

  const handleQuantityChange = (id, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 flex gap-16 flex-col overflow-hidden">
      {/* Product List */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartProduct
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-[50vh] w-[90vw]">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="flex flex-col flex-1 items-end justify-end">
          <CartSummary cartItems={cartItems} />
        </div>
      )}
    </div>
  );
};

export default Cart;
