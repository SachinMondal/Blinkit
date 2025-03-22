import { Routes, Route } from "react-router-dom";
import Dashboard from "../admin/home/Dashboard";
import Navbar from "../admin/Navigation/Navbar";
import OrdersPage from "../admin/order/OrderPage";
import Settings from "../admin/Setting/Settings";
import OrderView from "../admin/order/OrderView";
import Category from "../admin/Category/Category";
import AddCategory from "../admin/Category/AddCategory";
import ProductsPage from "../admin/Products/ProductPage";
import EditCategory from "../admin/Category/EditCategory";
import AddProduct from "../admin/Products/AddProduct";
import Summary from "../admin/Products/Summary";
import ViewProduct from "../admin/Products/ViewProduct";
import EditProduct from "../admin/Products/Edit Product";

const AdminRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Now all routes start with /admin */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/orders/:id" element={<OrderView />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/addCategory" element={<AddCategory />} />
        <Route path="/category/edit/:id" element={<EditCategory />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/addProduct" element={<AddProduct />} />
        <Route path="/products/summary" element={<Summary />} />
        <Route path="/products/:id" element={<ViewProduct />} />
        <Route path="/products/editProduct/:id" element={<EditProduct />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
};

export default AdminRoutes;
