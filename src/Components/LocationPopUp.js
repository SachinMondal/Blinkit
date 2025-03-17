import React, { useState } from "react";

const LocationModal = ({ onClose, onLocationSelect }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (location.trim() !== "") {
      onLocationSelect(location);
      onClose(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50">
      {/* Modal Content */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-96 border border-gray-300 m-4 relative">
        {/* Close Button */}
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✖
        </button>

        <h4 className="text-lg font-semibold">Welcome to ....</h4>

        <div className="flex flex-row justify-around items-center mt-4">
          {/* Location Icon */}
          <i className="fa-solid fa-location-dot text-4xl animate-bounce text-red-500"></i>

          {/* Input Section */}
          <div className="ml-4">
            <p className="text-gray-700">Please provide your delivery location</p>
            <input
              type="text"
              className="border rounded-lg p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={handleSubmit}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
