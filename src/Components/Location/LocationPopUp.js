import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserLocation } from "../../redux/state/auth/Action";

const LocationModal = ({ onClose, onLocationSelect }) => {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          if (data && data.display_name) {
            setLocation(data.display_name);
            setLatitude(latitude);
            setLongitude(longitude);
          } else {
            alert("Unable to fetch location details.");
          }
        } catch (err) {
          alert("Error fetching location from OpenStreetMap.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert("Location access denied or unavailable.");
        setLoading(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (location.trim() !== "") {
      try {
        await dispatch(updateUserLocation(location,latitude, longitude)); 
        onLocationSelect(location);
        onClose(); 
      } catch (error) {
        console.error("Location update failed", error);
        alert("Failed to save location. Please try again.");
      }
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50">
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-96 border border-gray-300 m-4 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✖
        </button>

        <h4 className="text-lg font-semibold">Welcome to ....</h4>

        <div className="flex flex-row justify-around items-center mt-4">
          <i className="fa-solid fa-location-dot text-4xl animate-bounce text-red-500"></i>

          <div className="ml-4 w-full">
            <p className="text-gray-700 mb-1">Please provide your delivery location</p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded-lg whitespace-nowrap"
                onClick={fetchLocation}
                disabled={loading}
              >
                {loading ? "Locating..." : "Use GPS"}
              </button>
            </div>

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
