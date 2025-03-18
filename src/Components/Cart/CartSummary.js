const CartSummary = ({ cartItems }) => {
    const totalItemPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    const handlingCharge = 10; // Fixed per order
    const deliveryCharge = 40; // Fixed per order
    const finalAmount = totalItemPrice + handlingCharge + deliveryCharge;
  
    return (
        <>
      <div className="border rounded-lg shadow-sm bg-white p-4 w-80 right-0">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        <div className="text-sm">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>₹{totalItemPrice}</span>
          </p>
          <p className="flex justify-between">
            <span>Handling Charges:</span> <span>₹{handlingCharge}</span>
          </p>
          <p className="flex justify-between">
            <span>Delivery Charges:</span> <span>₹{deliveryCharge}</span>
          </p>
          <p className="flex justify-between font-semibold text-base mt-2">
            <span>Total:</span> <span>₹{finalAmount}</span>
          </p>
        </div>
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
          Proceed to Checkout
        </button>
        
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
        <p className="text-gray-600 text-sm mt-2">
          You can cancel your order within 30 minutes of placing it. After that, a cancellation fee
          may apply. For further details, please refer to our full cancellation policy.
        </p>
      </div>
      </>
    );
  };
  
  export default CartSummary;
  