import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCart } from "../../redux/state/cart/Action"; 
import CartProduct from "./CartProduct";
import CartSummary from "./CartSummary";
import CartImage from "../../images/emptycart.avif";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const Cart = () => {
  const dispatch = useDispatch();

  
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const cartSum=useSelector((state)=>state.cart.cart);

  useEffect(() => {
    dispatch(fetchCart()); 
  }, [dispatch]);


  const handleQuantityChange = (productId, variantIndex, currentQty, count) => {
    const newQty = currentQty + count;
    if (newQty > 0) {
      dispatch(updateCart(productId, variantIndex, currentQty, count)); 
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 flex gap-16 flex-col overflow-hidden">
      {/* Product List */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartProduct
              key={item._id}
              item={item}
              variantIndex={index} 
              onQuantityChange={handleQuantityChange} 
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

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="flex flex-col flex-1 items-end justify-end">
          <CartSummary cartItems={cartSum.data} />
        </div>
      )}
    </div>
  );
};

export default Cart;
