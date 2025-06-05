import { Routes, Route, BrowserRouter } from "react-router-dom";
import CustomerRoutes from "./Routers/customer";
import AdminRouters from "./Routers/admin";
import "./App.css";
import { useEffect } from "react";
import { loadTokenFromStorage } from "./redux/state/auth/Action";
import { useDispatch } from "react-redux";
function App() {
  const dispatch=useDispatch();
  useEffect(() => {
  dispatch(loadTokenFromStorage());
}, [dispatch]);

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