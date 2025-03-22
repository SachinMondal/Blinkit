import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const OrderView = () => {
  const { id } = useParams(); // Get Order ID from URL
  const [order, setOrder] = useState({
    id: id,
    customer: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, New York, NY",
    orderDate: "March 20, 2025 | 12:30 PM",
    status: "Pending",
    items: [
      { name: "Apples", quantity: 2, price: 5.0 },
      { name: "Milk", quantity: 1, price: 3.5 },
      { name: "Bread", quantity: 1, price: 2.0 },
    ],
    discount: 2.0,
    deliveryCharge: 3.0,
  });

  const [showRejectModal, setShowRejectModal] = useState(false);

  const totalPrice = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalAmount = totalPrice - order.discount + order.deliveryCharge;

  // Function to update order status
  const updateStatus = () => {
    let newStatus = order.status === "Pending" ? "Shipped" : "Delivered";
    setOrder({ ...order, status: newStatus });
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Order #{order.id}</h1>
        <Link to="/orders" className="text-blue-500 hover:underline">
          ← Back to Orders
        </Link>
      </div>

      {/* Customer Details */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Customer Details</h2>
        <div className="mt-2 flex items-center justify-between">
          {/* Customer Name and Phone */}
          <div>
            <p className="text-gray-700 font-medium text-xl">
              {order.customer}
            </p>
            <p className="text-gray-500">{order.phone}</p>
          </div>

          {/* Call & Message Buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <a
              href={`tel:${order.phone}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center"
            >
              Call
            </a>
            <a
              href={`sms:${order.phone}`}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center"
            >
              Message
            </a>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-600 font-medium">Delivery Address</h3>
          <p className="text-gray-800">{order.address}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-600 font-medium">Order Date & Time</h3>
          <p className="text-gray-800">{order.orderDate}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white p-4 rounded-lg shadow-md md:mb-12 mb-16">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-2 border-t pt-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <div>
                <p className="text-gray-700">{item.name}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="text-gray-900 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="mt-4 text-sm text-gray-700">
          <div className="flex justify-between py-1">
            <p>Subtotal:</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between py-1">
            <p>Discount:</p>
            <p className="text-green-600">-${order.discount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between py-1">
            <p>Delivery Charges:</p>
            <p>${order.deliveryCharge.toFixed(2)}</p>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <p>Total Amount:</p>
            <p>${totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex justify-between shadow-md">
        <button
          onClick={() => setShowRejectModal(true)}
          className="bg-red-500 text-white py-2 px-6 rounded-lg"
        >
          Reject
        </button>
        <button
          onClick={updateStatus}
          className="bg-green-500 text-white py-2 px-6 rounded-lg"
        >
          Accept
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Reject Order</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to reject this order?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  // Handle rejection logic here
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderView;
