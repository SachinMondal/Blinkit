import { useEffect, useState } from "react";
import { Modal } from "../../Components/AddressModalComponent/AddressModal";
import { Link, useLocation } from "react-router-dom";
import OrderModel from "../../Components/OrderModel/OrderModel";
import PersonalInfo from "../../Components/PersonalInfo/PersonalInfo";
import emptyAddress from "../../images/emptyAddress.png";
import emptyOrder from "../../images/emptyOrder.png";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import { logout } from "../../redux/state/auth/Action";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  getAllAddresses,
} from "../../redux/state/address/Action";
import { fetchOrders } from "../../redux/state/order/Action";
import OrderSkeleton from "../../Components/Skeleton/OrderSkeleton";

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const activeTab = location.state?.active;
  const [activeSection, setActiveSection] = useState(
    activeTab ? activeTab : "personalInfo"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const addresses = useSelector((state) => state.address.addresses || []);
  const orders = useSelector((state) => state.order.orders || []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const logoutUser = () => {
    dispatch(logout());
  };
  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch, addresses.length]);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };
  useEffect(() => {
    dispatch(fetchOrders()).finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <OrderSkeleton />
      ) : (
        <div className="max-w-5xl xl:max-w-6xl mx-auto mt-6 flex gap-4 xl:gap-24 flex-col overflow-hidden">
          <nav className="w-full mb-3 ml-8 text-sm text-gray-600 text-left">
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>{" "}
            &gt;
            <span className="text-gray-500"> My Profile </span> &gt;
            <span className="text-green-600 font-medium">
              {activeSection === "personalInfo"
                ? " Personal Information"
                : activeSection === "address"
                ? " Address"
                : " My Orders"}
            </span>
          </nav>

          <div className="md:hidden flex justify-evenly items-center">
            <h2 className="text-lg font-bold">My Profile</h2>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
          <div className="flex flex-col md:flex-row flex-grow">
            {/* Mobile View: My Profile Heading */}
            <h2 className="text-lg md:hidden font-bold text-center mb-3 md:block hidden">
              My Profile
            </h2>

            <div className="md:w-1/4 w-full md:min-w-[200px] md:border-r p-3 rounded-lg text-sm md:text-base ">
              <div className="flex md:block justify-around md:justify-start">
                <div
                  className={`p-2 text-center md:text-left cursor-pointer transition-all duration-300 rounded-lg mt-3 ${
                    activeSection === "personalInfo" ? "bg-green-200" : ""
                  }`}
                  onClick={() => setActiveSection("personalInfo")}
                >
                  Personal Information
                </div>
                <div
                  className={`p-2 text-center md:text-left cursor-pointer transition-all duration-300 rounded-lg mt-3 ${
                    activeSection === "address" ? "bg-green-200" : ""
                  }`}
                  onClick={() => setActiveSection("address")}
                >
                  Address
                </div>
                <div
                  className={`p-2 text-center md:text-left cursor-pointer transition-all duration-300 rounded-lg mt-3 ${
                    activeSection === "orders" ? "bg-green-200" : ""
                  }`}
                  onClick={() => setActiveSection("orders")}
                >
                  My Orders
                </div>

                <button
                  className="w-full bg-red-500 text-white p-2 rounded-md text-sm md:text-base mt-3 md:block hidden"
                  onClick={logoutUser}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Right Content - Stays in Position */}
            <div className="flex-1 p-3 md:p-6 rounded-lg overflow-x-hidden overflow-y-auto scrollbar-hide text-sm md:text-base text-left transition-all duration-300 h-screen">
              {activeSection === "personalInfo" ? (
                <PersonalInfo />
              ) : activeSection === "address" ? (
                <div>
                  <div className="flex flex-row justify-between">
                    <h2 className="text-lg md:text-xl font-bold mb-3">
                      My Saved Addresses
                    </h2>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Add New Address
                    </button>
                  </div>

                  <ul className="min-h-screen overflow-y-auto max-h-screen scrollbar-hide">
                    {addresses.length > 0 ? (
                      addresses
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((addr) => (
                          <li
                            key={addr._id}
                            className="border-b p-2 md:p-3 rounded-md my-2"
                          >
                            <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                              {/* Address Icon */}
                              <div className="col-span-1 flex justify-center items-start">
                                <i className="fa-solid fa-house-user text-base md:text-xl text-gray-600"></i>
                              </div>

                              {/* Address Details */}
                              <div className="col-span-9">
                                <p className="font-bold">
                                  {addr.firstName} {addr.lastName}
                                </p>
                                <p className="text-gray-600">
                                  {addr.streetAddress}, {addr.city},{" "}
                                  {addr.state}, {addr.zipCode}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Mobile: {addr.mobile}
                                </p>
                              </div>

                              {/* Edit/Delete Menu */}
                              <div className="col-span-2 flex justify-end relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(
                                      menuOpen === addr._id ? null : addr._id
                                    );
                                  }}
                                  className="text-gray-600"
                                >
                                  <i className="fa-solid fa-ellipsis-vertical text-base md:text-xl"></i>
                                </button>

                                {menuOpen === addr._id && (
                                  <div className="absolute right-0 top-8 bg-white border shadow-md rounded-md w-20 z-10 dropdown-menu">
                                    <button
                                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                      onClick={() => {
                                        handleEdit(addr);
                                        setMenuOpen(null);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600"
                                      onClick={() => {
                                        setDeleteConfirm(addr._id);
                                        setMenuOpen(null);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[300px] p-5 rounded-md">
                        <LazyImage
                          src={emptyAddress}
                          alt="Empty Address"
                          className="w-40 h-40 object-contain mb-3"
                        />
                        <p className="text-gray-500 text-center text-lg">
                          No addresses saved yet.
                        </p>
                      </div>
                    )}
                  </ul>

                  {deleteConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-700 text-center">
                          Confirm Deletion
                        </h2>
                        <p className="text-gray-600 text-center mt-2">
                          Are you sure you want to delete this address?
                        </p>

                        <div className="flex justify-between mt-6">
                          <button
                            className="bg-gray-400 text-white px-4 py-2 rounded-md w-1/3"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md w-1/3"
                            onClick={() => {
                              dispatch(deleteAddress(deleteConfirm));
                              setDeleteConfirm(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedOrder ? (
                <OrderModel
                  order={selectedOrder}
                  onBack={() => setSelectedOrder(null)}
                />
              ) : (
                <div className="overflow-x-hidden overflow-y-auto scrollbar-hide">
                  <h2 className="text-lg md:text-xl font-bold mb-3">
                    My Orders
                  </h2>

                  {loading ? (
                    <p>Loading orders...</p>
                  ) : orders?.length > 0 ? (
                    orders
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((order) => (
                        <div
                          key={order._id}
                          className="mb-6 border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                            <div>
                              <p className="font-bold text-left mb-1">
                                Order ID: {order._id}
                              </p>
                              <p className="text-gray-500 text-left mb-1">
                                Ordered on:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}{" "}
                                {new Date(order.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                              <p className="text-gray-500 text-left mb-1 capitalize">
                                Status:{" "}
                                {order.orderStatus?.toLowerCase() || "pending"}
                              </p>
                              <p className="font-semibold text-left mb-4">
                                Delivery Time:{" "}
                                {order.deliveryTime === "Pending"
                                  ? "Waiting from Admin..."
                                  : order.deliveryTime}
                              </p>
                            </div>

                            <div className="text-left md:text-right">
                              <button
                                className="text-green-600 font-semibold hover:underline text-sm md:text-base"
                                onClick={() => setSelectedOrder(order)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          {/* Pricing Summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm mb-4">
                            <p>Items: {order.totalItems}</p>
                            <p>Cart Amount: ₹{order.totalCartAmount}</p>
                            <p className="text-green-600">
                              Discount: ₹{order.totalCartDiscountAmount}
                            </p>
                            <p>
                              Discounted Price: ₹
                              {order.totalCartDiscountedPrice}
                            </p>
                            <p>Delivery Charge: ₹{order.deliveryCharge}</p>
                            <p>Handling Charge: ₹{order.handlingCharge}</p>
                            <p className="font-extrabold text-lg sm:col-span-2">
                              Final Price: ₹{order.finalPrice}
                            </p>
                          </div>

                          {/* Order Items */}
                          {order.orderItems?.map((item) => (
                            <div
                              key={item._id}
                              className="grid grid-cols-12 items-center py-3 border-t border-gray-200"
                            >
                              <div className="col-span-3 sm:col-span-2 flex justify-center">
                                <LazyImage
                                  src={item?.productId?.image}
                                  alt={item?.productId?.name}
                                  className="w-14 h-14 object-cover rounded"
                                />
                              </div>

                              <div className="col-span-9 sm:col-span-10 text-left">
                                <div className="flex justify-between items-start flex-wrap">
                                  <div>
                                    <p className="font-bold">
                                      {item?.productId?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Weight: {item?.variantDetails?.qty}
                                      {item?.variantDetails?.unit}
                                    </p>
                                  </div>
                                  <div className="text-sm font-semibold mt-1 sm:mt-0">
                                    x {item?.quantity}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] p-5 rounded-md">
                      <LazyImage
                        src={emptyOrder}
                        alt="Empty Orders"
                        className="w-40 h-40 object-contain mb-3"
                      />
                      <p className="text-gray-500 text-center text-lg">
                        No orders placed yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isModalOpen && (
            <Modal
              onClose={() => setIsModalOpen(false)}
              editingAddress={editingAddress}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
