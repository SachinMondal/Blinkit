const OrderModel = ({ order, onBack }) => {
    return (
      <div className="overflow-x-hidden overflow-y-auto scrollbar-hide">
        <button
          className="text-blue-500 hover:underline mb-4"
          onClick={onBack}
        >
          &larr; Back to Orders
        </button>
  
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="border p-4 rounded-md">
          <p className="font-bold">Order ID: {order.id}</p>
          <p className="text-gray-600">Price: ₹{order.price}</p>
          <p className="text-gray-600">Date: {order.date} {order.time}</p>
          <p className="text-gray-600">Status: {order.status}</p>
        </div>
      </div>
    );
  };
  
  export default OrderModel;
  