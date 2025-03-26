import { Routes, Route, BrowserRouter } from "react-router-dom";
import CustomerRoutes from "./Routers/customer";
import AdminRouters from "./Routers/admin";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route path="/admin/*" element={<AdminRouters />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;