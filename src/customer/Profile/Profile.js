import { useState } from "react";
import { Modal } from "../../Components/AddressModalComponent/AddressModal";
import { Link } from "react-router-dom";
import OrderModel from "../../Components/OrderModel/OrderModel";
import PersonalInfo from "../../Components/PersonalInfo/PersonalInfo";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("address");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  // Dummy Data
  const [addresses, setAddresses] = useState([
    { id: 1, name: "Home", details: "123 Main St, City, Country" },
    { id: 2, name: "Work", details: "456 Office Rd, City, Country" },
    { id: 2, name: "Work", details: "456 Office Rd, City, Country" },
    { id: 2, name: "Work", details: "456 Office Rd, City, Country" },
    { id: 2, name: "Work", details: "456 Office Rd, City, Country" },
    { id: 2, name: "Work", details: "456 Office Rd, City, Country" },
    { id: 2, name: "Work", details: "456 Office Rd, City, Country" },
  ]);

  const orders = [
    {
      id: 1,
      item: "Apple",
      qty: "1 kg",
      price: 120,
      date: "2024-03-18",
      status: "Delivered",
    },
    {
      id: 2,
      item: "Banana",
      qty: "1 dozen",
      price: 80,
      date: "2024-03-17",
      status: "Delivered",
    },
    {
      id: 3,
      item: "Tomato",
      qty: "2 kg",
      price: 60,
      date: "2024-03-16",
      status: "Delivered",
    },
    {
      id: 1,
      item: "Apple",
      qty: "1 kg",
      price: 120,
      date: "2024-03-18",
      status: "Delivered",
    },
    {
      id: 2,
      item: "Banana",
      qty: "1 dozen",
      price: 80,
      date: "2024-03-17",
      status: "Delivered",
    },
    {
      id: 3,
      item: "Tomato",
      qty: "2 kg",
      price: 60,
      date: "2024-03-16",
      status: "Delivered",
    },
  ];

  // Function to Add New Address
  const addAddress = (newAddress) => {
    setAddresses([...addresses, { id: addresses.length + 1, ...newAddress }]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto flex gap-2 flex-col overflow-hidden">
      {/* Breadcrumb - Now Fixed at the Top */}
      <nav className="w-full mb-3 text-sm text-gray-600 text-left">
        <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt;
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
        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
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

            <button className="w-full bg-red-500 text-white p-2 rounded-md text-sm md:text-base mt-3 md:block hidden">
              Logout
            </button>
          </div>
        </div>

        {/* Right Content - Stays in Position */}
        <div className="flex-1 p-3 md:p-6 rounded-lg overflow-x-hidden overflow-y-auto scrollbar-hide text-sm md:text-base text-left">
          {activeSection === "personalInfo" ? (
     <PersonalInfo user={{ name: "cc", email: "example@example.com" }} />

          ) : 
          activeSection === "address" ? (
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

              <ul>
                {addresses.map((addr) => (
                  <li
                    key={addr.id}
                    className="border-b p-2 md:p-3 rounded-md my-2"
                  >
                    <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                      <div className="col-span-1 flex justify-center items-start">
                        <i className="fa-solid fa-house-user text-base md:text-xl text-gray-600"></i>
                      </div>
                      <div className="col-span-9">
                        <p className="font-bold">{addr.name}</p>
                        <p className="text-gray-600">{addr.details}</p>
                      </div>
                      <div className="col-span-2 flex justify-end relative">
                        <button
                          onClick={() =>
                            setMenuOpen(menuOpen === addr.id ? null : addr.id)
                          }
                          className="text-gray-600"
                        >
                          <i className="fa-solid fa-ellipsis-vertical text-base md:text-xl"></i>
                        </button>
                        {menuOpen === addr.id && (
                          <div className="absolute right-0 top-8 bg-white border shadow-md rounded-md w-20 z-10">
                            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                              Edit
                            </button>
                            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : selectedOrder ? (
            <OrderModel
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
            />
          ) : (
            <div className="overflow-x-hidden overflow-y-auto scrollbar-hide">
              <h2 className="text-lg md:text-xl font-bold mb-3">My Orders</h2>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-12 items-center py-3 border-b border-gray-300"
                >
                  <div className="col-span-1 flex justify-center">
                    <i className="fa-solid fa-bowl-food text-base md:text-xl text-gray-600"></i>
                  </div>
                  <div className="col-span-6 text-left">
                    <p className="font-bold">
                      {order.id} - ₹{order.price} | Ordered on: {order.date}{" "}
                      {order.time}
                    </p>
                    <p className="text-gray-500">{order.status}</p>
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} onSave={addAddress} />
      )}
    </div>
  );
};

export default Profile;
