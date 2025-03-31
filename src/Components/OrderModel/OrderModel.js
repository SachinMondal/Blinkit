const OrderModel = ({ order, onBack }) => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        className="text-blue-600 hover:underline flex items-center mb-4"
        onClick={onBack}
      >
        &larr; Back to Orders
      </button>

      {/* Order Details */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="space-y-2">
          <p className="font-semibold">
            Order ID: <span className="text-gray-700">{order.id}</span>
          </p>
          <p className="text-gray-600">
            Price: <span className="font-semibold">₹{order.totalPrice}</span>
          </p>
          <p className="text-gray-600">Date: {order.orderDate} {order.time}</p>
          <p
            className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
              order.orderStatus === "Delivered"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {order.orderStatus}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
        <ul className="space-y-4">
          {order.orderItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 border-b pb-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Address */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <p className="bg-gray-100 p-3 rounded-md text-gray-700">
          {order.shippingAddress}
        </p>
      </div>
    </div>
  );
};

export default OrderModel;
