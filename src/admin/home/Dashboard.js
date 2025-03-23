import { useState, useEffect } from "react";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

// Mock API Fetch Function (Replace with actual API)
const fetchLiveOrders = async () => {
  return [
    { id: 1, customer: "John Doe", items: 3, status: "Processing", amount: "$45.00" },
    { id: 2, customer: "Jane Smith", items: 2, status: "Shipped", amount: "$30.50" },
    { id: 3, customer: "Alice Brown", items: 5, status: "Delivered", amount: "$75.20" },
  ];

  // Uncomment to test empty state
  // return [];
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryTimes, setDeliveryTimes] = useState({});

  useEffect(() => {
    const getOrders = async () => {
      const data = await fetchLiveOrders();
      setOrders(data);
    };

    getOrders();

    // Poll for new orders every 5 seconds
    const interval = setInterval(getOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  // Function to handle delivery time selection
  const handleDeliveryTimeChange = (orderId, value) => {
    setDeliveryTimes((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Product Stats */}
      <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
        <i className="fa-brands fa-product-hunt text-4xl text-blue-500"></i>
        <div>
          <h3 className="text-xl font-semibold">Total Products</h3>
          <p className="text-gray-500">250</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
        <i className="fa-solid fa-cart-shopping text-4xl text-green-500"></i>
        <div>
          <h3 className="text-xl font-semibold">Total Orders</h3>
          <p className="text-gray-500">1,200</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
        <i className="fa-solid fa-user text-4xl text-purple-500"></i>
        <div>
          <h3 className="text-xl font-semibold">Total Customers</h3>
          <p className="text-gray-500">850</p>
        </div>
      </div>

      {/* Live Orders with Delivery Time Selection */}
      <div className="bg-white p-5 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-3 min-h-[250px] flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold mb-4">Live Orders</h3>
        {orders.length > 0 ? (
          <div className="max-h-60 overflow-y-auto w-full">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="flex justify-between items-center p-3">
                  <div>
                    <h4 className="font-semibold">{order.customer}</h4>
                    <p className="text-gray-500">
                      {order.items} items - {order.status}
                    </p>
                  </div>
                  <span className="text-gray-700">{order.amount}</span>
                  {/* Delivery Time Selection */}
                  <select
                    value={deliveryTimes[order.id] || ""}
                    onChange={(e) => handleDeliveryTimeChange(order.id, e.target.value)}
                    className="ml-4 p-2 border rounded bg-gray-100 text-sm"
                  >
                    <option value="" disabled>Select Time</option>
                    <option value="30 mins">30 mins</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="custom">Custom</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <LazyImage
              src="https://i.imgur.com/qIufhof.png"
              alt="No orders"
              className="w-40 h-40 opacity-75"
            />
            <p className="mt-4 text-gray-600 text-lg italic">
              "No orders yet. Stay patient, great things take time."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
