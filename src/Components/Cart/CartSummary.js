import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAddresses } from "../../redux/state/address/Action";
import { createOrder } from "../../redux/state/order/Action";
import { clearCart } from "../../redux/state/cart/Action";
const CartSummary = ({ cartItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector((state) => state.address.addresses);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showDiscountDetails, setShowDiscountDetails] = useState(false);

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);


  const totalItemPrice = cartItems?.totalCartAmount || 0;
  const cartSize = cartItems?.totalCartSize || 0;
  const discount = cartItems?.totalCartDiscountAmount
    ? Number(cartItems?.totalCartDiscountAmount.toFixed(2))
    : 0;
  const handlingCharge = 10;
  const deliveryCharge = 40;
  const discountedTotal = Number(cartItems?.totalCartDiscountedPrice).toFixed(2) || 0;
  const rawTotal = Number(discountedTotal + handlingCharge + deliveryCharge).toFixed(2);
  const finalAmount = Math.floor(rawTotal);
  const roundedOffExtra = Number((rawTotal - finalAmount).toFixed(2));
  const productDiscountPrice = cartItems?.productDiscount||0;
  const categoryDiscountPrice = cartItems?.categoryDiscount||0;
  

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = () => {
    setIsAddressModalOpen(true);
  };

  const handleFinalPlaceOrder = async () => {
    if (!selectedAddress) {
      console.error("No address selected");
      return;
    }

    setIsPlacingOrder(true);
    const finalCartPayload = {
      ...cartItems,
      totalCartAmount: totalItemPrice,
      totalCartSize: cartSize,
      totalCartDiscountAmount: discount,
      discountedTotal,
      finalAmount,
      handlingCharge,
      deliveryCharge,
    };

    await dispatch(createOrder(finalCartPayload, selectedAddress));
    setIsPlacingOrder(false);
    setIsAddressModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleViewOrders = () => {
    navigate("/profile", { state: { active: "orders" } });
    dispatch(clearCart());
  };

  return (
    <>
      <div className="border rounded-lg shadow-sm bg-white p-4 w-80 right-0 mb-4">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        <div className="text-sm">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>₹{totalItemPrice}</span>
          </p>
          <p
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowDiscountDetails(!showDiscountDetails)}
          >
            <span>Discount:</span>
            <span className="text-green-500 flex items-center space-x-1">
              <span>- ₹{discount < 0 ? -discount : discount}</span>
              <span className="ml-1 text-xs">
                {showDiscountDetails ? "▲" : "▼"}
              </span>
            </span>
          </p>

          <div className="overflow-hidden transition-all duration-300 ease-in-out">
            <div
              className={`text-xs ml-2 space-y-1 transition-all duration-300 ease-in-out text-green-500 ${
                showDiscountDetails
                  ? "max-h-40 opacity-100 pt-2"
                  : "max-h-0 opacity-0 pt-0"
              }`}
            >
              <p>• Product Discount: ₹{productDiscountPrice.toFixed(2)}/each</p>
              <p>• Category Discount: ₹{categoryDiscountPrice.toFixed(2)}/each</p>
            </div>
          </div>

          <p className="flex justify-between">
            <span>Subtotal after Discount:</span>
            <span>₹{discountedTotal}</span>
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
          <p className="text-sm text-gray text-bold rounded-lg mt-2 bg-green-200">
            You Saved A Total of ₹{discount + roundedOffExtra}
          </p>
        </div>
        <button
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>

      {isAddressModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsAddressModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Select Delivery Address
            </h2>

            {addresses.length > 0 ? (
              <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400">
                {addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedAddress?._id === addr._id
                        ? "border-green-500 bg-green-100"
                        : ""
                    }`}
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <p className="font-bold">
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p className="text-gray-600">
                      {addr.streetAddress}, {addr.city}, {addr.state},{" "}
                      {addr.zipCode}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Mobile: {addr.mobile}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No saved addresses.</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() =>
                  navigate("/profile", { state: { active: "address" } })
                }
              >
                Add New Address
              </button>
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                  selectedAddress ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!selectedAddress}
                onClick={handleFinalPlaceOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-center text-green-600">
              🎉 Order Placed Successfully! 🎉
            </h2>
            <p className="text-center mt-2">Thank you for your purchase.</p>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              onClick={handleViewOrders}
            >
              View Orders
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSummary;
