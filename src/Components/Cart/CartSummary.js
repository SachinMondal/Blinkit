import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAddresses } from "../../redux/state/address/Action";

const CartSummary = ({ cartItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector((state) => state.address.addresses);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  
  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);

  if (!cartItems || Object.keys(cartItems).length === 0) {
    return <p className="text-center text-gray-500">Cart is empty.</p>;
  }

  // Extracting values from cartItems
  const totalItemPrice = cartItems.totalCartAmount || 0;
  const cartSize = cartItems.totalCartSize || 0;
  const discount = cartItems.totalCartDiscountAmount || 0;
  const handlingCharge = 10;
  const deliveryCharge = 40;
  const discountedTotal = totalItemPrice - discount;
  const finalAmount = discountedTotal + handlingCharge + deliveryCharge;

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = () => {
    setIsAddressModalOpen(true);
  };

  return (
    <>
      <div className="border rounded-lg shadow-sm bg-white p-4 w-80 right-0">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        <div className="text-sm">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>₹{totalItemPrice}</span>
          </p>
          <p className="flex justify-between">
            <span>Discount:</span>{" "}
            <span className="text-green-500">- ₹{discount}</span>
          </p>
          <p className="flex justify-between">
            <span>Subtotal after Discount:</span>{" "}
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
        </div>
        <button
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>

      {isAddressModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
              <ul>
                {addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className={`p-3 border rounded-md cursor-pointer mb-2 ${
                      selectedAddress?._id === addr._id
                        ? "border-green-500 bg-green-100"
                        : ""
                    }`}
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                      {/* Address Icon */}
                      <div className="col-span-1 flex justify-center items-start">
                        <i className="fa-solid fa-house-user text-base md:text-xl text-gray-600"></i>
                      </div>

                      {/* Address Details */}
                      <div className="col-span-9">
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
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No saved addresses.</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => navigate("/profile")}
              >
                Add New Address
              </button>
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                  selectedAddress ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!selectedAddress}
              >
                Confirm & Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
        <p className="text-gray-600 text-sm mt-2">
          You can cancel your order within 30 minutes of placing it. After that,
          a cancellation fee may apply. For further details, please refer to our
          full cancellation policy.
        </p>
      </div>
    </>
  );
};

export default CartSummary;
