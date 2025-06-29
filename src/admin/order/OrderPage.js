import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import OrderTile from "./OrderTile";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import { getAllOrdersForAdmin } from "../../redux/state/order/Action";
import EmptyOrder from "../../images/emptyOrder.png";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.adminOrders || []);
  const [selectedTab, setSelectedTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        await dispatch(getAllOrdersForAdmin());
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [dispatch]);

  const tabs = [
    { label: "All", status: "All" },
    { label: "New Order", status: "PENDING" },
    { label: "Accepted Order", status: "ACCEPTED" },
    { label: "Shipping Order", status: "SHIPPED" },
    { label: "Delivered Order", status: "DELIVERED" },
    { label: "Cancelled Order", status: "CANCEL" },
    { label: "Rejected Order", status: "REJECT" },
  ];

  // Filter by selected tab
  const filteredByTab =
    selectedTab === "All"
      ? orders
      : orders.filter(
          (order) => order.orderStatus?.toUpperCase() === selectedTab
        );

  // Filter by search term (user name or order ID)
  const filteredBySearch = useMemo(() => {
    if (!searchTerm.trim()) return filteredByTab;

    const lowerTerm = searchTerm.toLowerCase();

    return filteredByTab.filter((order) => {
      const userName = order?.user?.name?.toLowerCase() || "";
      const orderId = order?._id?.toLowerCase() || "";
      return userName.includes(lowerTerm) || orderId.includes(lowerTerm);
    });
  }, [searchTerm, filteredByTab]);

  // Sort filtered orders by selected order
  const filteredOrders = useMemo(() => {
    if (sortOrder === "newest") {
      return [...filteredBySearch].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOrder === "oldest") {
      return [...filteredBySearch].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortOrder === "priceAsc") {
      return [...filteredBySearch].sort(
        (a, b) => (a.finalPrice || 0) - (b.finalPrice || 0)
      );
    } else if (sortOrder === "priceDesc") {
      return [...filteredBySearch].sort(
        (a, b) => (b.finalPrice || 0) - (a.finalPrice || 0)
      );
    }
    return filteredBySearch;
  }, [sortOrder, filteredBySearch]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await dispatch(getAllOrdersForAdmin());
      toast.success("Orders refreshed successfully");
    } catch (err) {
      toast.error("Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 mb-4">
      {/* Sticky Header */}
      <div className="fixed top-16 left-0 right-0 bg-white w-full z-20 shadow-sm border-b border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4 py-3">
          <h1 className="text-2xl font-bold text-green-700 whitespace-nowrap">
            Orders
          </h1>

          {/* Controls: Search, Sort, Refresh */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by user or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-green-500 focus:ring-1 focus:ring-green-500"
              aria-label="Search orders"
            />

            {/* Sort Select */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto focus:outline-green-500 focus:ring-1 focus:ring-green-500"
              aria-label="Sort orders"
            >
              <option value="">Sort orders</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 border whitespace-nowrap ${
                loading
                  ? "bg-green-100 text-green-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              } transition duration-200`}
              disabled={loading}
              title="Refresh Orders"
              aria-label="Refresh orders"
            >
              <i
                className={`fa-solid fa-arrows-rotate ${
                  loading ? "animate-spin" : ""
                }`}
              ></i>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide px-4 pb-2 space-x-3 border-t border-green-100">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setSelectedTab(tab.status)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
                selectedTab === tab.status
                  ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                  : "text-gray-500 hover:text-green-600"
              }`}
              aria-pressed={selectedTab === tab.status}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Padding top to prevent overlap with fixed header */}
      <div className="pt-[300px] sm:pt-[184px] md:pt-[160px] lg:pt-[150px] xl:pt-[150px] ">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="fa-solid fa-spinner animate-spin text-4xl text-green-600"></i>
            <p className="mt-3 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4 "
          >
            {/* AnimatePresence is always rendered */}
            <AnimatePresence mode="wait">
              {filteredOrders.length > 0
                ? filteredOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <OrderTile order={order} />
                    </motion.div>
                  ))
                : null}
            </AnimatePresence>

            {/* Show empty message only when no orders */}
            {filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <LazyImage
                  src={EmptyOrder}
                  alt="No Orders"
                  className="w-32 h-32 mb-4"
                />
                <p className="text-gray-600 text-lg">No orders available</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;