import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import LocationModal from "./LocationPopUp";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setUserLocation(storedLocation);
    } else {
      setIsModalOpen(true);
    }
  }, []);
  const handleLocationSelect = (location) => {
    setUserLocation(location);
    localStorage.setItem("userLocation", location); 
    setIsModalOpen(false); 
  };
  return (
    <>
      {/* //location popup */}
      {isModalOpen && (
        <LocationModal
          onClose={() => setIsModalOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
      <Navbar
        location={userLocation}
        isLoggedIn={false}
        setLocationModal={setIsModalOpen}
      />
    </>
  );
};

export default HomePage;
