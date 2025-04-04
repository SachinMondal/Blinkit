import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, clearCart } from "../../redux/state/cart/Action"; 
import CartProduct from "./CartProduct";
import CartSummary from "./CartSummary";
import CartImage from "../../images/emptycart.avif";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, cart } = useSelector((state) => state.cart); 

  useEffect(() => {
    dispatch(fetchCart()); 
  }, [dispatch]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 flex flex-col gap-8 overflow-hidden px-4">
      
      {/* Clear Cart Button */}
      {!loading && cartItems && cartItems.length > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button 
            onClick={handleClearCart} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm sm:text-base"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500 text-lg font-semibold">Loading...</p>
        </div>
      )}

      {/* Product List */}
      {!loading && (
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartProduct
                key={item._id}
                item={item}
                variantIndex={index} 
              />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center min-h-[400px] w-full">
              <div className="flex flex-col items-center justify-center p-5 rounded-md">
                <LazyImage
                  src={CartImage}
                  alt="Empty Cart"
                  className="object-contain mb-3 h-48 w-48"
                />
                <p className="text-gray-500 text-center text-lg">
                  Your cart is empty
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cart Summary */}
      {!loading && cartItems && cartItems.length > 0 && (
        <div className="flex flex-col flex-1 items-end justify-end">
          <CartSummary cartItems={cart?.data} /> 
        </div>
      )}
    </div>
  );
};

export default Cart;
