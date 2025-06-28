import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CustomerRoutes from "./Routers/customer";
import AdminRouters from "./Routers/admin";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Error Boundary inside the same file
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("❌ ErrorBoundary caught an error:", error);
    console.error("📍 Component Stack:", info?.componentStack);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Something went wrong.
          </h2>
          <p className="text-gray-700 mb-2">
            {this.state.error?.message || "Unexpected error"}
          </p>
          <pre className="text-left text-xs max-w-full overflow-auto bg-gray-200 p-2 rounded text-red-500 mb-4">
            {this.state.info?.componentStack || "No component stack"}
          </pre>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/admin/*" element={<AdminRouters />} />
          <Route path="/*" element={<CustomerRoutesWithErrorBoundary />} />
        </Routes>
      </ErrorBoundary>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

// Wrapping CustomerRoutes in a separate ErrorBoundary to catch Navbar-related issues specifically
const CustomerRoutesWithErrorBoundary = () => (
  <ErrorBoundary>
    <CustomerRoutes />
  </ErrorBoundary>
);

export default App;
