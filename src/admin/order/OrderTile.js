import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder, fetchOrders } from "../../redux/state/order/Action";
import toast from "react-hot-toast";

const OrderTile = ({ order }) => {
  const dispatch = useDispatch();

  const updatedOrder = useSelector(
    (state) => state.orders?.find((o) => o._id === order._id) || order
  );

  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(() =>
    order?.deliveryTime === "PENDING" ? "" : order?.deliveryTime || ""
  );
  const [customTimeInput, setCustomTimeInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingShip, setLoadingShip] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const [localOrderStatus, setLocalOrderStatus] = useState(
    order?.orderStatus || "PENDING"
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (updatedOrder && updatedOrder._id === order._id) {
      setLocalOrderStatus(updatedOrder.orderStatus);
    }
  }, [updatedOrder, order]);

  const isPending = localOrderStatus === "PENDING";

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (order?.deliveryTime) {
      setSelectedDeliveryOption(order.deliveryTime);
    }
  }, [order]);

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason cannot be empty.");
      return;
    }

    try {
      setLoadingReject(true);
      await dispatch(
        updateOrder(order._id, {
          orderStatus: "REJECT",
          rejectReason: rejectionReason.trim(),
        })
      );
      setLocalOrderStatus("REJECT");
      await dispatch(fetchOrders());
      toast.success("Order rejected successfully.");
      setIsModalOpen(false);
      setRejectionReason("");
    } catch (err) {
      toast.error("Failed to reject order. Please try again.");
    } finally {
      setLoadingReject(false);
    }
  };

  const handleDeliveryTimeChange = async (value) => {
    if (!isPending) return;
    setSelectedDeliveryOption(value);

    if (value !== "") {
      try {
        await dispatch(
          updateOrder(order._id, {
            deliveryTime: value,
            orderStatus: "ACCEPTED",
          })
        );
        toast.success("Delivery time updated and order accepted.");
        setLocalOrderStatus("ACCEPTED"); // Also update local status
      } catch (err) {
        toast.error("Failed to update delivery time.");
      }
    }
  };

  const getNextStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "ACCEPTED";
      case "ACCEPTED":
        return "SHIPPED";
      case "SHIPPED":
        return "DELIVERED";
      default:
        return null;
    }
  };

  const handleStatusAdvance = async () => {
    if (
      selectedDeliveryOption?.toLowerCase() === "pending" ||
      !selectedDeliveryOption
    ) {
      setError("Please select a delivery time before proceeding.");
      return;
    }

    setError("");

    const next = getNextStatus(localOrderStatus);
    if (!next) return;

    const loadingSetter = {
      ACCEPTED: setLoadingAccept,
      SHIPPED: setLoadingShip,
      DELIVERED: setLoadingDeliver,
    }[next];

    loadingSetter(true);

    try {
      await dispatch(updateOrder(order._id, { orderStatus: next }));
      setLocalOrderStatus(next);
      toast.success(`Order ${next}.`);
    } catch (err) {
      toast.error("Failed to update order status.");
    } finally {
      loadingSetter(false);
    }
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200 transition hover:shadow-lg w-full max-w-xl mx-auto max-h-48">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          <i className="fa-solid fa-user mr-2 text-green-600"></i>
          {order?.user?.name || "Unknown"}
        </h2>
        <span className="text-green-600 font-bold text-lg">
          ₹{order?.finalPrice || "N/A"}
        </span>
      </div>

      <p className="text-sm sm:text-xs text-gray-500 mt-1">
        Order ID: <span className="font-medium">#{order?._id || "N/A"}</span>
      </p>

      <p className="text-xs text-gray-600 mt-2 truncate">
        <i className="fa-solid fa-hand-holding-dollar mr-2 text-green-500"></i>
        {order?.orderItems
          ?.map((o) => `${o?.productId?.name} x ${o?.quantity}`)
          .join(", ")}
      </p>

      {/* Delivery Time Selection */}
      <div className="flex items-center gap-2 mt-4 w-full flex-wrap">
        {/* Select dropdown */}
        <select
          value={selectedDeliveryOption}
          onChange={(e) => {
            const val = e.target.value;
            if (val !== "custom") {
              setCustomTimeInput(""); // clear input on normal selection
              handleDeliveryTimeChange(val);
            } else {
              setSelectedDeliveryOption("custom");
            }
          }}
          className={`p-2 border rounded-md text-sm focus:outline-none transition-all ${
            selectedDeliveryOption === "custom" ? "w-1/3" : "w-full"
          }`}
          disabled={!isPending}
        >
          <option value="" disabled>
            Select delivery option
          </option>
          {["same-day", "1-day", "2-days", "3-days"].map((option) => (
            <option key={option} value={option}>
              {option
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
          {selectedDeliveryOption &&
            !["same-day", "1-day", "2-days", "3-days"].includes(
              selectedDeliveryOption
            ) &&
            selectedDeliveryOption !== "custom" && (
              <option value={selectedDeliveryOption}>
                {selectedDeliveryOption
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            )}
          <option value="custom">Custom</option>
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {/* Show these only when 'custom' is selected */}
        {selectedDeliveryOption === "custom" && (
          <>
            <input
              type="text"
              placeholder="Enter custom time"
              value={customTimeInput}
              onChange={(e) => setCustomTimeInput(e.target.value)}
              className="w-1/3 p-2 border rounded-md text-sm"
            />
            <button
              onClick={() => {
                if (customTimeInput.trim() && isPending) {
                  handleDeliveryTimeChange(customTimeInput.trim());
                  setCustomTimeInput("");
                }
              }}
              disabled={!customTimeInput.trim() || !isPending}
              className={`w-1/4 px-2 py-2 rounded text-white text-sm ${
                !customTimeInput.trim() || !isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Submit
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-between items-center">
        <Link
          to={`/admin/orders/${order?._id}`}
          className="text-blue-500 hover:underline text-sm"
        >
          View Details
        </Link>

        {localOrderStatus === "PENDING" && (
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-red-500 hover:underline text-sm"
            >
              Reject
            </button>
            <button
              onClick={handleStatusAdvance}
              className={`text-green-600 hover:underline text-sm ${
                !selectedDeliveryOption || loadingAccept
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={!selectedDeliveryOption || loadingAccept}
            >
              {loadingAccept ? "Accepting..." : "Accept"}
            </button>
          </>
        )}

        {localOrderStatus === "ACCEPTED" && (
          <button
            onClick={handleStatusAdvance}
            className={`text-yellow-600 hover:underline text-sm ${
              loadingShip ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loadingShip}
          >
            {loadingShip ? "Shipping..." : "Ship"}
          </button>
        )}

        {localOrderStatus === "SHIPPED" && (
          <button
            onClick={handleStatusAdvance}
            className={`text-green-700 hover:underline text-sm ${
              loadingDeliver ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loadingDeliver}
          >
            {loadingDeliver ? "Delivering..." : "Deliver"}
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800">
              Reject Order
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Please provide a reason for rejection.
            </p>

            <textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full mt-3 p-2 border rounded text-sm"
            />

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRejectionReason("");
                }}
                className="text-gray-500 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white px-4 py-1.5 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                disabled={loadingReject || !rejectionReason.trim()}
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
