import { Routes, Route } from "react-router-dom";
import CustomerRoutes from "./Routers/customer";
import AdminRouters from "./Routers/admin";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route path="/admin/*" element={<AdminRouters />} />
      </Routes>
    </div>
  );
}

export default App;