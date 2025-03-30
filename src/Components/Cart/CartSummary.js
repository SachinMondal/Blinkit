const CartSummary = ({ cartItems }) => {
  if (!cartItems || Object.keys(cartItems).length === 0) {
    return <p className="text-center text-gray-500">Cart is empty.</p>;
  }

  console.log(cartItems);

  // Extracting values from cartItems
  const totalItemPrice = cartItems.totalCartAmount || 0;
  const cartSize = cartItems.totalCartSize || 0;
  const discount = cartItems.totalCartDiscountAmount || 0;
  const handlingCharge = 10; 
  const deliveryCharge = 40; 
  const discountedTotal = totalItemPrice - discount;
  const finalAmount = discountedTotal + handlingCharge + deliveryCharge;

  return (
    <>
      <div className="border rounded-lg shadow-sm bg-white p-4 w-80 right-0">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        <div className="text-sm">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>₹{totalItemPrice}</span>
          </p>
          <p className="flex justify-between">
            <span>Discount:</span> <span className="text-green-500">- ₹{discount}</span>
          </p>
          <p className="flex justify-between">
            <span>Subtotal after Discount:</span> <span>₹{discountedTotal}</span>
          </p>
          <p className="flex justify-between">
            <span>Handling Charges:</span> <span>₹{handlingCharge}</span>
          </p>
          <p className="flex justify-between">
            <span>Delivery Charges:</span> <span>₹{deliveryCharge}</span>
          </p>
          <p className="flex justify-between font-semibold text-base mt-2">
            <span>Final Total:</span> <span>₹{finalAmount}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">Total Items: {cartSize}</p>
        </div>
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
          Place Order
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
