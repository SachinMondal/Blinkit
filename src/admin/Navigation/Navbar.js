import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../images/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col mt-12">
      {/* Top Navbar */}
      <nav className="bg-[#F1C542] text-white shadow-md fixed top-0 left-0 w-full h-16 z-50 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white text-lg font-semibold cursor-pointer">
          <img src={Logo} alt="brand" className="w-12 h-12" />
        </Link>

        {/* Navigation Links - Desktop View */}
        <div className="hidden md:flex space-x-6 transition-all duration-300">
        <NavLink to="/admin/admin" text="Dashboard" path={location.pathname} mobile onClick={() => setIsOpen(false)} /> 
          <NavLink to="/admin/orders" text="Orders" path={location.pathname} />
          <NavLink to="/admin/category" text="Category" path={location.pathname} />
          <NavLink to="/admin/products" text="Products" path={location.pathname} />
          <NavLink to="/admin/settings" text="Settings" path={location.pathname} />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </nav>

      {/* Mobile Sidebar Menu (opens from right) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#F1C542] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-white text-xl focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Navigation Links */}
        <div className="mt-16 flex flex-col space-y-4 px-6">
        <NavLink to="/" text="Dashboard" path={location.pathname} mobile onClick={() => setIsOpen(false)} /> 
          <NavLink to="/admin/" text="Dashboard" path={location.pathname} mobile onClick={() => setIsOpen(false)} />
          <NavLink to="/admin/orders" text="Orders" path={location.pathname} mobile onClick={() => setIsOpen(false)} />
          <NavLink to="/admin/category" text="Category" path={location.pathname} mobile onClick={() => setIsOpen(false)} />
          <NavLink to="/admin/products" text="Products" path={location.pathname} mobile onClick={() => setIsOpen(false)} />
          <NavLink to="/admin/settings" text="Settings" path={location.pathname} mobile onClick={() => setIsOpen(false)} />
        </div>
      </div>
    </div>
  );
};

// Reusable NavLink Component
const NavLink = ({ to, text, path, mobile, onClick }) => (
  <Link
    to={to}
    className={`block px-6 py-2 rounded-b-md transition duration-300 ${
      mobile ? "text-center w-full" : ""
    } ${path === to ? "border-b-4 border-green-500" : "hover:bg-yellow-500 hover:rounded-md"}`}
    onClick={onClick}
  >
    {text}
  </Link>
);

export default Navbar;
