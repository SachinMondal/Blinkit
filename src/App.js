import { Routes, Route, BrowserRouter } from "react-router-dom";
import CustomerRoutes from "./Routers/customer";
import AdminRouters from "./Routers/admin";
import { Toaster } from "react-hot-toast"; 
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route path="/admin/*" element={<AdminRouters />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
