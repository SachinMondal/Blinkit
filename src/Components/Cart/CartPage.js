import { useState } from "react";
import CartProduct from "./CartProduct";
import CartSummary from "./CartSummary";
import CartImage from "../../images/emptycart.avif";
import LazyImage from "../utils/LazyLoading/LazyLoading";
const dummyItems = [];

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
          <div className="flex flex-1 items-center justify-center min-h-[400px] w-full">
          <div className=" flex flex-col items-center justify-center p-5 rounded-md">
            <LazyImage
              src={CartImage}
              alt="Empty Cart"
              className="object-contain mb-3 h-48 w-48"
            />
            <p className="text-gray-500 text-center text-lg">Your cart is empty</p>
          </div>
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
