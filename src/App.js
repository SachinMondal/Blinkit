import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./customer/Home/HomePage";
import SignUp from "./customer/auth/SignUp";


// Dummy Auth Function (Replace with actual auth logic)
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null; 
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signup" />;
};

function App() {
  return (
    
      <div className="App">
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />

          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        

          {/* Catch-All Route (404 Page) */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    
  );
}

export default App;
