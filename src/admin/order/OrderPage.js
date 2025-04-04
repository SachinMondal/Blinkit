import { useEffect, useState } from "react";
import OrderTile from "./OrderTile"; // Importing OrderTile Component
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import { getAllOrdersForAdmin } from "../../redux/state/order/Action";
import { useDispatch, useSelector } from "react-redux";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.adminOrders);
  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // ✅ Corrected Tabs List
  const tabs = [
    { label: "All", status: "All" },
    { label: "New Order", status: "PENDING" },
    { label: "Accepted Order", status: "ACCEPTED" },
    { label: "Processing Order", status: "PROCESSING" },
    { label: "Delivered Order", status: "DELIVERED" },
  ];

  // ✅ Filter Orders Based on Status
  const filteredOrders =
    selectedTab === "All"
      ? orders
      : orders.filter((order) => order.orderStatus.toUpperCase() === selectedTab);

  return (
    <div className="flex flex-col overflow-hidden mx-auto w-full md:max-w-7xl px-4">
      {/* Sticky Scrollable Tab Bar */}
      <div className="fixed top-16 bg-white border-b w-full z-10">
        <h1 className="text-xl font-semibold p-4">Orders</h1>

        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b pb-2 space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition ${
                selectedTab === tab.status
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setSelectedTab(tab.status)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-28">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderTile key={order.id} order={order} />)
        ) : (
          <div className="col-span-full text-center p-10">
            <LazyImage
              src="https://via.placeholder.com/150"
              alt="No Orders"
              className="w-32 h-32 mb-4 mx-auto"
            />
            <p className="text-gray-600">No orders available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
