import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrder } from "../../redux/state/order/Action";
import AdminUserMap from "../../Components/utils/Map/AdminUserMap";
import { fetchUserInfo } from "../../redux/state/auth/Action";

const OrderView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.order) || {};
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
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
    console.log(user);

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
    await dispatch(updateOrder(id, { orderStatus: newStatus }));
    await dispatch(getOrderById(id)); 
    setLoadingUpdate(false);
  };
  
  const handleReject = async () => {
    setLoadingReject(true);
    await dispatch(updateOrder(order._id, { orderStatus: "REJECT" }));
    await dispatch(getOrderById(id));
    setLoadingReject(false);
    setShowRejectModal(false);
  };
  const adminLocation = {
    lat: user?.locationPin?.coordinates?.[1],
    lng: user?.locationPin?.coordinates?.[0],
  };
  
  return (
    <div className="p-4 md:p-8 w-full max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Order #{order._id}</h1>
        <Link to="/admin/orders" className="text-white hover:underline bg-gray-700 p-2 rounded-md cursor-pointer"> 
        Back
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Customer Details</h2>
        <p className="text-gray-700 font-medium text-xl">
          Status: {loadingUpdate ? "Updating..." : order.orderStatus}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-medium text-xl">
              {order.user?.name}
            </p>
            <p className="text-gray-500">{order.user?.mobileNo}</p>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <a
              href={`tel:${order.user?.mobileNo}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center"
            >
              Call
            </a>
            <a
              href={`sms:${order.user?.mobileNo}`}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center"
            >
              Message
            </a>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-600 font-medium">Delivery Address</h3>
          {order.shippingAddress ? (
            <p className="text-gray-800">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              ,<br />
              {order.shippingAddress.streetAddress},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
              {order.shippingAddress.zipCode}
            </p>
          ) : (
            <p className="text-gray-500">No shipping address available</p>
          )}


          {order?.user?.locationPin &&(
             <div className="mt-6">
             <h3 className="text-gray-600 font-medium mb-2">Delivery Route</h3>
             <div className="h-64 w-full rounded-lg overflow-hidden border z-10">
               <AdminUserMap
                 userLocation={order.user.locationPin}
                 adminLocation={adminLocation} 
               />
             </div>
           </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-gray-600 font-medium">Order Date & Time</h3>
          <p className="text-gray-800">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Delivery Time: {order.deliveryTime || "Not specified"}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md md:mb-12 mb-16">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-2 border-t pt-2">
          {order?.orderItems?.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <div>
                <p className="text-gray-700">
                  {item.name || item.productId?.name}
                </p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="text-gray-900 font-semibold">
                ₹{(item.subtotalPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-700">
          <div className="flex justify-between py-1">
            <p>Subtotal:</p>
            <p>₹{order.totalCartAmount?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between py-1">
            <p>Discount:</p>
            <p className="text-green-600">
              -₹{order.totalCartDiscountAmount?.toFixed(2) || 0}
            </p>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <p>Total Amount:</p>
            <p>₹{order.totalCartDiscountedPrice?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex justify-between shadow-md">
        {order.orderStatus !== "DELIVERED" && (
          <>
            <button
              onClick={() => setShowRejectModal(true)}
              className="bg-red-500 text-white py-2 px-6 rounded-lg"
              disabled={loadingReject}
            >
              {loadingReject ? "Rejecting..." : "Reject"}
            </button>
            <button
              onClick={updateStatus}
              className="bg-green-500 text-white py-2 px-6 rounded-lg"
              disabled={loadingUpdate}
            >
              {loadingUpdate
                ? "Updating..."
                : order.orderStatus === "REJECTED"
                ? "Accept"
                : getNextStatus(order.orderStatus)}
            </button>
          </>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Reject Order</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to reject this order?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                disabled={loadingReject}
              >
                {loadingReject ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderView;
