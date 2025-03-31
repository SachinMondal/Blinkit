import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder, fetchOrders } from "../../redux/state/order/Action";

const OrderTile = ({ order }) => {
  const dispatch = useDispatch();
  
  // Fetch updated order from Redux store
  const updatedOrder = useSelector((state) =>
    state.orders?.find((o) => o._id === order._id) || order
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);

  const orderStatus = updatedOrder?.orderStatus || "PENDING";

  // Ensure the component updates when the order status changes
  useEffect(() => {
    if (updatedOrder && updatedOrder.orderStatus !== currentOrder.orderStatus) {
      setCurrentOrder(updatedOrder);
    }
  }, [updatedOrder, currentOrder.orderStatus]);

  // Fetch orders only on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const handleReject = async () => {
    setLoadingReject(true);
    await dispatch(updateOrder(order._id, { orderStatus: "REJECTED" }));
    setLoadingReject(false);
    dispatch(fetchOrders());
  };

  const handleAccept = async () => {
    setLoadingAccept(true);
    await dispatch(updateOrder(order._id, { orderStatus: "SHIPPED" }));
    setLoadingAccept(false);
    dispatch(fetchOrders());
  };

  const handleDeliver = async () => {
    setLoadingDeliver(true);
    await dispatch(updateOrder(order._id, { orderStatus: "DELIVERED" }));
    setLoadingDeliver(false);
    dispatch(fetchOrders());
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col space-y-3 transition hover:shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
      {/* Top Section: Customer Name & Total Amount */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 pl-4">
          <i className="fa-solid fa-user mr-2"></i> {order?.user?.name || "Unknown"}
        </h2>
        <span className="text-lg font-bold text-blue-600">{order?.totalCartAmount || "N/A"}</span>
      </div>

      {/* Order ID */}
      <p className="text-sm text-gray-500">
        Order ID: <span className="font-medium">#{order?._id || "N/A"}</span>
      </p>

      {/* Order Items */}
      <p className="text-gray-600 text-sm truncate pl-4 flex items-center">
        <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
        {order?.orderItems?.map((o) => `${o.name} x ${o.quantity}`).join(", ")}
      </p>

      {/* Delivery Time Dropdown */}
      <select className="mt-2 w-full p-2 border rounded-md text-sm focus:outline-none">
        <option value="same-day">Same Day</option>
        <option value="1-day">1 Day</option>
        <option value="2-days">2 Days</option>
        <option value="3-days">3 Days</option>
      </select>

      {/* Buttons Based on Order Status */}
      <div className="mt-3 flex flex-col sm:flex-row justify-between gap-2">
        <Link to={`/admin/orders/${order?._id}`} className="text-blue-500 font-medium hover:underline text-center">
          View
        </Link>

        {orderStatus === "PENDING" && (
          <>
            <button className="text-red-500 font-medium hover:underline text-center" onClick={() => setIsModalOpen(true)}>
              Reject
            </button>
            <button className="text-green-500 font-medium hover:underline text-center" onClick={handleAccept} disabled={loadingAccept}>
              {loadingAccept ? "Accepting..." : "Accept"}
            </button>
          </>
        )}

        {orderStatus === "SHIPPED" && (
          <button className="text-green-500 font-medium hover:underline text-center" onClick={handleDeliver} disabled={loadingDeliver}>
            {loadingDeliver ? "Delivering..." : "Delivered"}
          </button>
        )}
      </div>

      {/* Modal for Rejection Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Rejection</h2>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to reject this order?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleReject} disabled={loadingReject}>
                {loadingReject ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTile;
