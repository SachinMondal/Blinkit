import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import SignUp from "../../customer/auth/SignUp";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png"

export default function Navbar({ isLoggedIn, location, setLocationModal }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSticky, setIsSticky] = useState(false);
  const [categoryTop, setCategoryTop] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Get initial position of the category list
    const categoryList = document.getElementById("category-list");
    if (categoryList) {
      setCategoryTop(categoryList.offsetTop);
    }

    const handleScroll = () => {
      if (window.scrollY > categoryTop + 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categoryTop]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = [
    {
      name: "Electronics",
      products: ["Laptops", "Mobile Phones", "Headphones", "Smart Watches"],
    },
    {
      name: "Fashion",
      products: ["Men's Wear", "Women's Wear", "Footwear", "Accessories"],
    },
    {
      name: "Home & Kitchen",
      products: ["Furniture", "Kitchenware", "Home Decor", "Lighting"],
    },
  ];
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory((prev) => (prev === categoryName ? null : categoryName));
  };
  const handleCategorySelection = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(""); // Unselect category
      navigate("/"); // Redirect to home
    } else {
      setSelectedCategory(categoryName); // Select new category
    }
    handleCategoryClick(categoryName);
  };

  return (
    <div
      className={`${isMobile ? "" : "sticky top-0"}  bg-gray-100 z-40 ${
        isSidebarOpen ? "overflow-hidden" : ""
      }`}
    >
      <nav
        className={`bg-[#F1C542] p-4 w-full relative z-40 ${
          isMobile
            ? "h-[30vh] flex flex-col items-center justify-around rounded-b-3xl"
            : "flex justify-center"
        }`}
      >
        <div className={`flex justify-around w-full max-w-5xl lg:max-w-6xl `}>
          {isMobile ? (
            <>
              <div className="w-full">
                <div className="flex w-full justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="text-white text-xl"
                    >
                      <i className="fa-solid fa-bars"></i>
                    </button>
                    <Link
                      to={"/"}
                      className="text-white text-lg font-semibold cursor-pointer"
                    >
                      <img src={Logo} alt="brand" className="w-12 h-12" />
                    </Link>
                  </div>

                  {isLoggedIn ? (
                    <Link to="/profile" className="text-white">
                      <i className="fa-solid fa-circle-user text-4xl"></i>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-primary text-black px-4 py-2 rounded-lg"
                    >
                      SignUp/Login
                    </Button>
                  )}
                </div>
                <div className="">
                  <p className="text-black font-bold text-left">
                    Delivery in 15 min
                  </p>
                  {location ? (
                    <p className="font-semibold">{location}</p>
                  ) : (
                    <button
                      onClick={() => setLocationModal(true)}
                      className="text-black underline"
                    >
                      Select Location
                    </button>
                  )}
                </div>
                {/* Search Bar Moved Below */}
                <div className="mt-4 bg-white rounded-md px-3 py-2 items-center w-full  sm:w-full flex sticky top-0 z-40">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-around gap-2 items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-white text-xl"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
                <Link
                  to={"/"}
                  className="text-white text-lg font-semibold cursor-pointer"
                >
                  <img src={Logo} alt="brand" className="w-12 h-12" />
                </Link>
                <div className="flex flex-col text-white text-sm items-start ml-5">
                  <p className="text-black font-bold">Delivery in 15 min</p>
                  {location ? (
                    <p className="font-semibold">{location}</p>
                  ) : (
                    <button
                      onClick={() => setLocationModal(true)}
                      className="text-black underline"
                    >
                      Select Location
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-md px-3 py-2 items-center w-full sm:w-96 flex sticky top-0 z-40">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 outline-none w-full text-gray-800"
                />
              </div>
              <div className=" flex gap-8 items-center justify-center">
                <Link
                  to={"/cart"}
                  className="relative p-2 rounded-full transition"
                >
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    17
                  </span>
                  <i className="fa-solid fa-cart-shopping"></i>
                </Link>

                {isLoggedIn ? (
                  <Link to="/profile" className="text-white">
                    <i className="fa-solid fa-circle-user text-4xl"></i>
                  </Link>
                ) : (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-black px-4 py-2 rounded-lg"
                  >
                    SignUp/Login
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {isMobile && (
          <p className="text-sm text-gray-700 text-center">
            Welcome to our store! Find the best deals here.
          </p>
        )}
      </nav>
      <div
        id="category-list"
        className={`container max-w-5xl xl:max-w-6xl mx-auto flex space-x-6 transition-all duration-300 ${
          isMobile ? "overflow-x-auto p-2 whitespace-nowrap scrollbar-hide" : ""
        } ${
          isSticky && isMobile ? "fixed top-0 left-0 w-full bg-white shadow-md z-40" : ""
        }`}
      >
        {isMobile
          ? categories
              .flatMap((category) =>
                category.products.map((product) => ({
                  product,
                  categoryName: category.name,
                }))
              )
              .map(({ product }, idx) => (
                <div
                  key={`${product}-${idx}`}
                  onClick={() => handleCategorySelection(product)}
                  className={`shadow-md rounded-md px-4 py-2 text-gray-800 text-sm mt-2 cursor-pointer transition-all duration-300 ${
                    selectedCategory === product
                      ? "bg-green-600 border-b-4 border-green-950 text-white"
                      : "bg-white"
                  }`}
                >
                  <Link to={`/category/${product}`}>{product}+1</Link>
                </div>
              ))
          : categories.map((category, index) => (
              <div key={index} className="relative cursor-pointer group">
                <div className="inline-flex items-center">
                  <span
                    className={`font-semibold px-4 py-2 cursor-pointer transition-all duration-300`}
                  >
                    {category.name}
                    <i className="fa-solid fa-angle-down ml-2 transition-transform duration-300 group-hover:rotate-180"></i>
                  </span>
                </div>

                {/* Dropdown menu */}
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-40">
                  {category.products.map((product, idx) => (
                    <button
                      key={idx}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                    >
                      <Link to={`/${category.name}/${product}`}>{product}</Link>
                    </button>
                  ))}
                </div>
              </div>
            ))}
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform rounded-r-xl z-44 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="border-b">
              <p
                className="text-gray-700 font-semibold cursor-pointer flex justify-between items-center py-2"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
                <i
                  className={`fa-solid fa-chevron-down transition-transform ${
                    activeCategory === category.name ? "rotate-180" : "rotate-0"
                  }`}
                ></i>
              </p>
              <ul
                className={`ml-4 overflow-hidden transition-all text-left duration-300 ${
                  activeCategory === category.name
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {category.products.map((product, idx) => (
                  <li
                    key={idx}
                    className="text-gray-600 hover:text-blue-500 cursor-pointer py-1"
                  >
                    <Link to={`/${category.name}/${product}`}>{product}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <SignUp isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </div>
    </div>
  );
}
