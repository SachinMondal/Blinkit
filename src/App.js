import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./customer/Home/HomePage";
import SignUp from "./customer/auth/SignUp";
import CategoryPage from "./Components/CategoryDetails/CategoryPage";
import { useEffect, useRef, useState } from "react";
import LocationModal from "./Components/Location/LocationPopUp";
import Navbar from "./Components/Navigation/Navbar";
import Footer from "./Components/Footer/Footer";
import CartItem from "./Components/Cart/CartItems";
import ProductPage from "./Components/ProductDetails/ProductPage";

// Dummy Auth Function (Replace with actual auth logic)
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// Protected Route Wrapper
// const ProtectedRoute = ({ children }) => {
//   return isAuthenticated() ? children : <Navigate to="/signup" />;
// };

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
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
    <div className="App">
      {/* Location Modal */}
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
      <Routes>
        <Route path="/" element={<HomePage userLocation={userLocation} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<HomePage />} />

        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />

        {/* Catch-All Route (404 Page) */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
      <div
        className={`${
          isFooterVisible ? "hidden" : "fixed bottom-4 left-1/2"
        } transition-all duration-300 ease-out`}
      >
        <CartItem />
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}
function SignupModalRoute() {
  const navigate = useNavigate();
  
  return <SignUp isOpen={true} setIsOpen={() => navigate("/")} />;
}

export default App;
