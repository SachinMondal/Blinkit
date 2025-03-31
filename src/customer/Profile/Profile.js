import { useEffect, useState } from "react";
import { Modal } from "../../Components/AddressModalComponent/AddressModal";
import { Link } from "react-router-dom";
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
const Profile = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("personalInfo");
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
    <div className="max-w-5xl xl:max-w-6xl mx-auto mt-6 flex gap-16 xl:gap-24 flex-col overflow-hidden">
      {/* Breadcrumb - Now Fixed at the Top */}
      <nav className="w-full mb-3 text-sm text-gray-600 text-left">
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
      <div className="md:hidden flex justify-evenly items-center mb-3 ">
        <h2 className="text-lg font-bold">My Profile</h2>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
      {/* Main Layout - Flex Without Breadcrumb Impacting Layout */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Mobile View: My Profile Heading */}
        <h2 className="text-lg md:hidden font-bold text-center mb-3 md:block hidden">
          My Profile
        </h2>

        {/* Sidebar - Fixed Width */}
        <div className="md:w-1/4 w-full md:min-w-[200px] md:border-r p-3 rounded-lg text-sm md:text-base">
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
        <div className="flex-1 p-3 md:p-6 rounded-lg overflow-x-hidden overflow-y-auto scrollbar-hide text-sm md:text-base text-left transition-all duration-300">
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
                  addresses.map((addr) => (
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
                            {addr.streetAddress}, {addr.city}, {addr.state},{" "}
                            {addr.zipCode}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Mobile: {addr.mobile}
                          </p>
                        </div>

                        {/* Edit/Delete Menu */}
                        <div className="col-span-2 flex justify-end relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
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
                    <img
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

              {/* Delete Confirmation Modal */}
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
              <h2 className="text-lg md:text-xl font-bold mb-3">My Orders</h2>

              {loading ? (
                <p>Loading orders...</p>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-12 items-center py-3 border-b border-gray-300"
                  >
                    <div className="col-span-1 flex justify-center">
                      <i className="fa-solid fa-bowl-food text-base md:text-xl text-gray-600"></i>
                    </div>
                    <div className="col-span-6 text-left">
                      <p className="font-bold">
                        {order.id|| null} - ₹{order.totalPrice} | Ordered on:{" "}
                        {order.orderDate} {order.time}
                      </p>
                      <p className="text-gray-500">{order.orderStatus}</p>
                    </div>
                    <div className="col-span-5 flex justify-end">
                      <button
                        className="text-green-600 font-semibold hover:underline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </div>
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

      {/* Add Address Modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          editingAddress={editingAddress}
        />
      )}
    </div>
  );
};

export default Profile;
