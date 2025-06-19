import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrder } from "../../redux/state/order/Action";
import AdminUserMap from "../../Components/utils/Map/AdminUserMap";
import { fetchUserInfo } from "../../redux/state/auth/Action";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const OrderView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.order) || {};
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { user = {}, token } = useSelector((state) => state.auth);
  const isFirstRender = useRef(true);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (token && isFirstRender.current) {
      dispatch(fetchUserInfo(token));
      isFirstRender.current = false;
    }
  }, [token, dispatch]);

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "PENDING":
        return "ACCEPTED";
      case "ACCEPTED":
        return "SHIPPED";
      case "SHIPPED":
        return "DELIVERED";
      case "DELIVERED":
      case "REJECT":
      case "CANCEL":
        return null;
      default:
        return null;
    }
  };

  const updateStatus = async () => {
    const newStatus = getNextStatus(order.orderStatus);
    if (!newStatus) return;

    setLoadingUpdate(true);
    try {
      await dispatch(updateOrder(id, { orderStatus: newStatus }));
      await dispatch(getOrderById(id));
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    setLoadingReject(true);
    try {
      await dispatch(updateOrder(order._id, { orderStatus: "REJECT", rejectReason }));
      await dispatch(getOrderById(id));
      toast.success("Order rejected successfully");
      setShowRejectModal(false);
      setRejectReason(""); // Clear reject reason after modal close
    } catch (error) {
      toast.error("Failed to reject order");
    } finally {
      setLoadingReject(false);
    }
  };

  const adminLocation = {
    lat: user?.locationPin?.coordinates?.[1],
    lng: user?.locationPin?.coordinates?.[0],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-green-500 mt-2 rounded-b-xl text-white shadow sticky top-0 z-30">
        <h1 className="text-2xl font-extrabold tracking-wide">Order #{order._id}</h1>
        <Link
          to="/admin/orders"
          className="bg-green-100 hover:bg-green-200 text-green-700 rounded-md px-4 py-2 font-medium shadow"
        >
          &larr; Back
        </Link>
      </header>

      {/* Main Content Container */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl mb-28 md:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Customer Details + Map */}
          <section className="md:col-span-2 bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Details</h2>

              <p className="mb-4 font-semibold text-lg text-gray-700">
                Status:{" "}
                <span
                  className={`${
                    loadingUpdate
                      ? "text-yellow-600"
                      : order.orderStatus === "DELIVERED"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                >
                  {loadingUpdate ? "Updating..." : order.orderStatus}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{order.user?.name}</p>
                  <p className="text-gray-500 text-sm">{order.user?.mobileNo}</p>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={`tel:${order.user?.mobileNo}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm flex items-center justify-center shadow"
                    aria-label="Call Customer"
                  >
                    <i className="fa-solid fa-phone mr-2"></i> Call
                  </a>
                  <a
                    href={`sms:${order.user?.mobileNo}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm flex items-center justify-center shadow"
                    aria-label="Message Customer"
                  >
                    <i className="fa-solid fa-comment mr-2"></i> Message
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-gray-700 font-medium mb-1">Delivery Address</h3>
                {order.shippingAddress ? (
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {`${order.shippingAddress.firstName} ${order.shippingAddress.lastName},
${order.shippingAddress.streetAddress},
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No shipping address available</p>
                )}
              </div>

              {order?.user?.locationPin && (
                <div className="mt-8">
                  <h3 className="text-gray-700 font-medium mb-2">Delivery Route</h3>
                  <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <AdminUserMap
                      userLocation={order.user.locationPin}
                      adminLocation={adminLocation}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-1">
                <h3 className="text-gray-700 font-medium">Order Date & Time</h3>
                <p className="text-gray-800">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  Delivery Time: {order.deliveryTime || "Not specified"}
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Order Summary */}
          <section className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-200 flex-grow overflow-auto">
              {order?.orderItems?.map((item, index) => (
                <div key={index} className="flex justify-between py-3 items-center">
                  <div>
                    <p className="text-gray-900 font-medium">
                      {item.name || item.productId?.name}
                    </p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 line-through text-sm">
                      ₹{(item.subtotalPrice * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-green-600 font-semibold text-lg">
                      ₹{(item.subtotalDiscountedPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-gray-700 space-y-1 text-sm">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>₹{order.totalCartAmount?.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Discount:</p>
                <p className="text-green-600">-₹{order.totalCartDiscountAmount?.toFixed(2) || 0}</p>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between font-semibold text-lg">
                <p>Total Amount:</p>
                <p>₹{order.finalPrice?.toFixed(2)}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Fixed Action Buttons */}
  <footer className="fixed bottom-0 left-0 w-full bg-white p-4 flex flex-col md:flex-row justify-between gap-2 shadow-lg border-t border-gray-200 z-50 ">
  {order.orderStatus !== "DELIVERED" && (
    <>
      <motion.button
        whileHover={{ scale: order.orderStatus === "REJECT" ? 1 : 1.05 }}
        whileTap={{ scale: order.orderStatus === "REJECT" ? 1 : 0.95 }}
        onClick={() => setShowRejectModal(true)}
        className={`${
          order.orderStatus === "REJECT"
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        } text-white py-2 px-6 rounded-lg font-semibold shadow w-full md:w-auto`}
        disabled={loadingReject || order.orderStatus === "REJECT"}
      >
        {order.orderStatus === "REJECT"
          ? "Rejected"
          : loadingReject
          ? "Rejecting..."
          : "Reject"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={updateStatus}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 px-6 rounded-lg font-semibold shadow w-full md:w-auto"
        disabled={loadingUpdate}
      >
        {loadingUpdate
          ? "Updating..."
          : order.orderStatus === "REJECTED"
          ? "Accept"
          : getNextStatus(order.orderStatus)}
      </motion.button>
    </>
  )}
</footer>


      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">Reject Order</h2>
              <p className="text-gray-700 mb-2">Are you sure you want to reject this order?</p>

              <p className="text-gray-700 mb-2">Please provide a reason for rejection:</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Enter reject reason here..."
                className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-5 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loadingReject}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-md font-semibold disabled:bg-red-300"
                >
                  {loadingReject ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderView;
