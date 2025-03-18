import "./App.css";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import HomePage from "./customer/Home/HomePage";
import SignUp from "./customer/auth/SignUp";
import CategoryPage from "./Components/CategoryDetails/CategoryPage";
import { useEffect, useRef, useState } from "react";
import LocationModal from "./Components/Location/LocationPopUp";
import Navbar from "./Components/Navigation/Navbar";
import Footer from "./Components/Footer/Footer";
import CartItem from "./Components/Cart/CartItems";
import ProductPage from "./Components/ProductDetails/ProductPage";
import ViewAll from "./Components/viewAll/viewAll";
import Profile from "./customer/Profile/Profile";
import TermsAndConditions from "./customer/TermsCondition/Terms&Condition";
import PrivacyPolicy from "./customer/Privacy&Policy/PrivacyPolicy";
import Cart from "./Components/Cart/CartPage";

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

  const allProducts = [
    {
      category: "Electronics",
      products: [
        {
          id: 1,
          name: "Fresh Apple",
          qty: "1 kg",
          image: "https://via.placeholder.com/150",
          price: 120,
          discount: 10, // in percentage
        },
        {
          id: 2,
          name: "Banana",
          qty: "1 dozen",
          image: "https://via.placeholder.com/150",
          price: 80,
          discount: 5,
        },
        {
          id: 3,
          name: "Tomato",
          qty: "2 kg",
          image: "https://via.placeholder.com/150",
          price: 60,
          discount: 15,
        },
        {
          id: 4,
          name: "Potato",
          qty: "5 kg",
          image: "https://via.placeholder.com/150",
          price: 100,
          discount: 8,
        },
        {
          id: 5,
          name: "Carrot",
          qty: "1 kg",
          image: "https://via.placeholder.com/150",
          price: 50,
          discount: 12,
        },
        {
          id: 6,
          name: "Broccoli",
          qty: "1 piece",
          image: "https://via.placeholder.com/150",
          price: 90,
          discount: 7,
        },
        {
          id: 7,
          name: "Orange",
          qty: "1 dozen",
          image: "https://via.placeholder.com/150",
          price: 150,
          discount: 10,
        },
        {
          id: 8,
          name: "Strawberry",
          qty: "500g",
          image: "https://via.placeholder.com/150",
          price: 200,
          discount: 5,
        },
      ],
    },
  ];
  
  

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
        isLoggedIn={true}
        setLocationModal={setIsModalOpen}
      />
      <Routes>
        
        <Route path="/" element={<HomePage userLocation={userLocation} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<HomePage />} />

        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/categoryviewAll/:category" element={<ViewAll products={allProducts} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/termsconditions" element={<TermsAndConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/cart" element={<Cart />} />

        {/* Catch-All Route (404 Page) */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
      <Link to={'/cart'}
        className={`${
          isFooterVisible ? "hidden" : "fixed bottom-4 left-1/2"
        } transition-all duration-300 ease-out`}
      >
        <CartItem />
      </Link>

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
