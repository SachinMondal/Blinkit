import { useState } from "react";
import OrderTile from "./OrderTile"; // Importing OrderTile Component
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

const OrdersPage = () => {
  const [orders] = useState([
    { id: 1, customer: "John Doe", items: ["Burger", "Fries", "Coke"], total: "$45.99", status: "New Order", deliveryTime: "2 Days" },
    { id: 2, customer: "Jane Smith", items: ["Pizza", "Garlic Bread"], total: "$22.50", status: "Accepted Order", deliveryTime: "1 Day" },
    { id: 3, customer: "David Johnson", items: ["Pasta", "Salad"], total: "$88.75", status: "Processing Order", deliveryTime: "Same Day" },
    { id: 4, customer: "Alice Brown", items: ["Sushi", "Miso Soup"], total: "$30.00", status: "Delivered Order", deliveryTime: "3 Days" },
    { id: 5, customer: "Bob White", items: ["Steak", "Mashed Potatoes"], total: "$70.00", status: "Accepted Order", deliveryTime: "4 Days" }
  ]);

  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "New Order", "Accepted Order", "Processing Order", "Delivered Order"];

  const filteredOrders =
    selectedTab === "All"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === selectedTab.toLowerCase());

  return (
    <div className="flex flex-col overflow-hidden mx-auto w-full md:max-w-7xl px-4">
  {/* Sticky Scrollable Tab Bar */}
  <div className="fixed top-16 bg-white border-b w-full">
    <h1 className="text-xl font-semibold p-4">Orders</h1>

    {/* Scrollable Tabs on Mobile (FlatMap Style) */}
    <div className="flex lg:justify-start overflow-x-auto scrollbar-hide border-b pb-2 space-x-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${
            selectedTab === tab ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>

  {/* Orders Grid (Fully Responsive) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-28">
    {filteredOrders.length > 0 ? (
      filteredOrders.map((order) => <OrderTile key={order.id} order={order} />)
    ) : (
      <div className="col-span-full text-center p-10">
        <LazyImage src="https://via.placeholder.com/150" alt="No Orders" className="w-32 h-32 mb-4 mx-auto" />
        <p className="text-gray-600">No orders available</p>
      </div>
    )}
  </div>
</div>


  );
};

export default OrdersPage;
