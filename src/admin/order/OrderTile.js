import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder, fetchOrders } from "../../redux/state/order/Action";

const OrderTile = ({ order }) => {
  const dispatch = useDispatch();

  const updatedOrder = useSelector(
    (state) => state.orders?.find((o) => o._id === order._id) || order
  );

  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(order.deliveryTime || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);

  const orderStatus = updatedOrder?.orderStatus || "PENDING";

  useEffect(() => {
    if (
      updatedOrder &&
      (updatedOrder._id !== currentOrder._id ||
        updatedOrder.orderStatus !== currentOrder.orderStatus)
    ) {
      setCurrentOrder(updatedOrder);
    }
  }, [currentOrder._id, currentOrder.orderStatus, updatedOrder]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (order?.deliveryTime) {
      setSelectedDeliveryOption(order.deliveryTime);
    }
  }, [order]);

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

  const handleDeliveryTimeChange = (value) => {
    if (order.orderStatus !== "PENDING") return; 
    setSelectedDeliveryOption(value);
  
    if (value !== "") {
      dispatch(updateOrder(order._id, { deliveryTime: value }));
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col space-y-3 transition hover:shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 pl-4">
          <i className="fa-solid fa-user mr-2"></i>{" "}
          {order?.user?.name || "Unknown"}
        </h2>
        <span className="text-lg font-bold text-blue-600">
          {order?.totalCartAmount || "N/A"}
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Order ID: <span className="font-medium">#{order?._id || "N/A"}</span>
      </p>

      <p className="text-gray-600 text-sm truncate pl-4 flex items-center">
        <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
        {order?.orderItems?.map((o) => `${o.productId.name} x ${o.quantity}`).join(", ")}
      </p>

      <select
  value={selectedDeliveryOption}
  onChange={(e) => handleDeliveryTimeChange(e.target.value)}
  className={`mt-2 w-full p-2 border rounded-md text-sm focus:outline-none 
    ${order.orderStatus !== "PENDING" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
  disabled={order.orderStatus !== "PENDING"}
>
  <option value="" disabled>Select Delivery Option</option>
  {["same-day", "1-day", "2-days", "3-days"].map((option) => (
    <option key={option} value={option}>
      {option.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </option>
  ))}
  {selectedDeliveryOption &&
    !["same-day", "1-day", "2-days", "3-days"].includes(selectedDeliveryOption) && (
      <option value={selectedDeliveryOption}>
        {selectedDeliveryOption.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </option>
    )}
  <option value="custom">Custom</option>
</select>




      {selectedDeliveryOption === "custom" && (
        <input
          type="text"
          placeholder="Enter custom time (e.g., 5 days)"
          className="mt-2 w-full p-2 border rounded-md text-sm"
          onBlur={async (e) => {
            const value = e.target.value.trim();
            if (value) {
              setSelectedDeliveryOption(value);
              await dispatch(updateOrder(order._id, { deliveryTime: value }));
            }
          }}
        />
      )}

      <div className="mt-3 flex flex-col sm:flex-row justify-between gap-2">
        <Link
          to={`/admin/orders/${order?._id}`}
          className="text-blue-500 font-medium hover:underline text-center"
        >
          View
        </Link>

        {orderStatus === "PENDING" && (
          <>
            <button
              className="text-red-500 font-medium hover:underline text-center"
              onClick={() => setIsModalOpen(true)}
            >
              Reject
            </button>
            <button
              className="text-green-500 font-medium hover:underline text-center"
              onClick={handleAccept}
              disabled={loadingAccept}
            >
              {loadingAccept ? "Accepting..." : "Accept"}
            </button>
          </>
        )}

        {orderStatus === "SHIPPED" && (
          <button
            className="text-green-500 font-medium hover:underline text-center"
            onClick={handleDeliver}
            disabled={loadingDeliver}
          >
            {loadingDeliver ? "Delivering..." : "Delivered"}
          </button>
        )}
      </div>

      {/* Modal for Rejection Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Rejection
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to reject this order?
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleReject}
                disabled={loadingReject}
              >
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
