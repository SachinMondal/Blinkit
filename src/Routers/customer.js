/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { fetchUserInfo } from "../redux/state/auth/Action"; 
import HomePage from "../customer/Home/HomePage";
import SignUp from "../customer/auth/SignUp";
import CategoryPage from "../Components/CategoryDetails/CategoryPage";
import LocationModal from "../Components/Location/LocationPopUp";
import Navbar from "../Components/Navigation/Navbar";
import Footer from "../Components/Footer/Footer";
import CartItem from "../Components/Cart/CartItems";
import ProductPage from "../Components/ProductDetails/ProductPage";
import ViewAll from "../Components/utils/viewAll/viewAll";
import Profile from "../customer/Profile/Profile";
import TermsAndConditions from "../customer/TermsCondition/Terms&Condition";
import PrivacyPolicy from "../customer/Privacy&Policy/PrivacyPolicy";
import Cart from "../Components/Cart/CartPage";
import PageNotFound from "../customer/PageNotFound/PageNotFound";
import AboutUs from "../Components/AboutUs/Aboutus";
import ScrollToTop from "../Components/utils/ScrollToTop/ScrollToTop";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token); 
  return token ? children : <Navigate to="/" />;
};

function Customer() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo(token)); 
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (user && user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

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
  if (user && user.location) {
    setUserLocation(user.location);
  } else {
    setIsModalOpen(true);
  }
}, [user]);


  const handleLocationSelect = (location) => {
    setUserLocation(location);
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      {isModalOpen && (
        <LocationModal
          onClose={() => setIsModalOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}

      <Navbar location={userLocation} isLoggedIn={!!token} isAdmin={isAdmin} setLocationModal={setIsModalOpen} />
<ScrollToTop />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage userLocation={userLocation} />} />
        <Route path="/:parentCategory/:category" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/categoryviewAll/:category" element={<ViewAll />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/termsconditions" element={<TermsAndConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />

        <Route
          path="/cart"
          element={
            
              <Cart />
            
          }
        />

        <Route path="/aboutUs" element={<AboutUs />} />

        {/* Catch-All Route (404 Page) */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Link
        to={"/cart"}
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

export default Customer;
