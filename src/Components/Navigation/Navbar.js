import { Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SignUp from "../../customer/auth/SignUp";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png";
import { getCategoriesAndSubCategories } from "../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/state/cart/Action";
import { searchProducts } from "../../redux/state/product/Action";
import LazyImage from "../utils/LazyLoading/LazyLoading";
import { toggleAuthModal } from "../../redux/state/ui/Action";
export default function Navbar({
  isLoggedIn,
  location,
  setLocationModal,
  isAdmin,
}) {
  const dispatch = useDispatch();
  const sideBarRef = useRef(null);
  const categories = useSelector((state) => state.category.categories);
  const cartSum = useSelector((state) => state.cart.cart);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSticky, setIsSticky] = useState(false);
  const [categoryTop, setCategoryTop] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const searchResult = useSelector((state) => state.product.searchResult);
  useEffect(() => {
    function handleClickOutside(event) {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSidebarOpen]);
  useEffect(() => {
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

  useEffect(() => {
    dispatch(getCategoriesAndSubCategories());
  }, [dispatch]);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  const handleCategorySelection = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory("");
      navigate("/");
    } else {
      setSelectedCategory(categoryName);
    }
    handleCategoryClick(categoryName);
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 1) {
      const debounceTimer = setTimeout(() => {
        dispatch(searchProducts(trimmedQuery));
        setShowDropdown(true);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      setShowDropdown(false);
    }
  }, [query, dispatch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className={`${isMobile ? "" : "sticky top-0"}  bg-gray-100 z-40 ${
        isSidebarOpen ? "overflow-hidden" : ""
      }`}
    >
      <nav
        className={`bg-[#F1C542] p-4 w-full relative z-40  ${
          isMobile
            ? "h-[30vh] flex flex-col items-center justify-around rounded-b-3xl"
            : "flex justify-center w-full"
        }`}
      >
        <div className={`flex justify-around w-full max-w-6xl md:max-2-5xl xl:max-w-full mx-auto `}>
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
                      <LazyImage src={Logo} alt="brand" className="w-12 h-12" />
                    </Link>
                  </div>

                  {isLoggedIn ? (
                    <div className="flex gap-2">
                      <Link to="/profile" className="text-white">
                        <i className="fa-solid fa-circle-user text-4xl"></i>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        to={"/cart"}
                        className="relative p-2 rounded-full transition"
                      >
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                          {cartSum?.totalItem || cartSum?.totalCartSize || 0}
                        </span>
                        <i className="fa-solid fa-cart-shopping"></i>
                      </Link>
                      <Button
                        onClick={() => dispatch(toggleAuthModal(true))}
                        className=" text-black px-4 py-2 rounded-lg"
                      >
                        SignUp/Login
                      </Button>
                    </div>
                  )}
                </div>
                <div className="">
                  <p className="text-black font-bold text-left">
                    Delivery in 15 min
                    <button
                      onClick={() => setLocationModal(true)}
                      className="ml-1 text-gray-600 hover:text-black"
                    >
                      <i className="fas fa-pen text-xs"></i>
                    </button>
                  </p>
                  {location ? (
                    <div className="relative w-full md:w-20 overflow-hidden h-6">
                      <div className="overflow-hidden w-full h-full">
                        <p className="whitespace-nowrap animate-marquee text-sm font-medium text-gray-800">
                          {location}
                        </p>
                      </div>
                    </div>
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
                <div ref={searchRef} className="relative w-full sm:w-full">
                  <div className="mt-4 bg-white rounded-md px-3 py-2 flex items-center sticky top-0 z-40">
                    <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="ml-2 outline-none w-full text-gray-800"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.trim() !== "") {
                          setShowDropdown(true);
                        } else {
                          setShowDropdown(false);
                        }
                      }}
                      onFocus={() => {
                        if (query.trim() !== "") setShowDropdown(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                    />
                  </div>

                  {showDropdown && query.trim().length > 0 && (
                    <div className="absolute w-full bg-white border mt-1 rounded-md z-50 shadow-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {searchResult?.categories?.length > 0 ||
                        searchResult?.products?.length > 0 ? (
                          <>
                            {searchResult.categories.length > 0 && (
                              <>
                                <div className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase">
                                  Categories
                                </div>
                                {searchResult.categories.map((category) => (
                                  <Link
                                    to={`/category/${category._id}`}
                                    key={category._id}
                                  >
                                    <div
                                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setQuery(category.name);
                                        setShowDropdown(false);
                                      }}
                                    >
                                      <LazyImage
                                        src={category.image}
                                        alt={category.name}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                      <span>{category.name}</span>
                                    </div>
                                  </Link>
                                ))}
                              </>
                            )}
                            {searchResult.products.length > 0 && (
                              <>
                                <div className="px-3 py-1 text-left text-xs text-gray-500 font-semibold uppercase mt-2">
                                  Products
                                </div>
                                {searchResult.products.map((item) => (
                                  <Link
                                    to={`/product/${item._id}`}
                                    key={item._id}
                                  >
                                    <div
                                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setQuery(item.name);
                                        setShowDropdown(false);
                                      }}
                                    >
                                      {Array.isArray(item?.images) &&
                                      item.images.length > 0 ? (
                                        <LazyImage
                                          src={item.images[0]}
                                          alt={item.name || "Product Image"}
                                          className="w-8 h-8 rounded object-cover"
                                        />
                                      ) : (
                                        <p className="text-xs text-gray-500">
                                          No Image to Preview
                                        </p>
                                      )}

                                      <span>{item.name}</span>
                                    </div>
                                  </Link>
                                ))}
                              </>
                            )}
                          </>
                        ) : (
                          <div className="p-2 text-gray-500">
                            No results found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-around gap-4 items-center">
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
                  <LazyImage src={Logo} alt="brand" className="w-12 h-12" />
                </Link>
                <div className="flex flex-col text-white text-sm items-start mr-2">
                  <p className="text-black font-bold flex items-center text-xs md:text-sm">
                    Delivery in 15 min
                    <button
                      onClick={() => setLocationModal(true)}
                      className="ml-1 text-gray-600 hover:text-black"
                    >
                      <i className="fas fa-pen text-xs"></i>
                    </button>
                  </p>

                  {location ? (
                    <div className="relative w-full max-w-90 sm:max-w-72 md:max-w-96 overflow-hidden h-6">
                      <div className="absolute whitespace-nowrap animate-marquee font-medium text-gray-800 text-xs md:text-sm">
                        {location}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setLocationModal(true)}
                      className="text-black underline text-xs md:text-sm"
                    >
                      Select Location
                    </button>
                  )}
                </div>
              </div>

              <div
                ref={searchRef}
                className="relative w-full ml-0 lg:-ml-20 sm:w-96"
              >
                <div className="bg-white rounded-md px-3 py-2 flex items-center w-full sticky top-0 z-40 shadow-sm">
                  <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 outline-none w-full text-gray-800"
                    value={query}
                    onChange={(e) => {
                      const value = e.target.value;
                      setQuery(value);
                      setShowDropdown(value.trim() !== "");
                    }}
                    onFocus={() => {
                      if (query.trim() !== "") setShowDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDropdown(false), 150);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                </div>
                {showDropdown && query.trim().length > 0 && (
                  <div className="absolute w-full bg-white border mt-1 rounded-md z-50 shadow-lg overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {searchResult?.categories?.length > 0 ||
                      searchResult?.products?.length > 0 ? (
                        <>
                          {searchResult.categories.length > 0 && (
                            <>
                              <div className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase">
                                Categories
                              </div>
                              {searchResult.categories.map((category) => (
                                <Link
                                  to={`/category/${category._id}`}
                                  key={category._id}
                                >
                                  <div
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      setQuery(category.name);
                                      setShowDropdown(false);
                                    }}
                                  >
                                    <LazyImage
                                      src={category.image}
                                      alt={category.name}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                    <span>{category.name}</span>
                                  </div>
                                </Link>
                              ))}
                            </>
                          )}
                          {searchResult.products.length > 0 && (
                            <>
                              <div className="px-3 py-1 text-left text-xs text-gray-500 font-semibold uppercase mt-2">
                                Products
                              </div>
                              {searchResult.products.map((item) => (
                                <Link
                                  to={`/product/${item._id}`}
                                  key={item._id}
                                >
                                  <div
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      setQuery(item.name);
                                      setShowDropdown(false);
                                    }}
                                  >
                                    {Array.isArray(item?.images) &&
                                    item.images.length > 0 ? (
                                      <LazyImage
                                        src={item.images[0]}
                                        alt={item.name || "Product Image"}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                    ) : (
                                      <p className="text-xs text-gray-500">
                                        No Image to Preview
                                      </p>
                                    )}

                                    <span>{item.name}</span>
                                  </div>
                                </Link>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <div className="p-2 text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className=" flex gap-4 ml-2 items-center justify-center">
                <Link
                  to={"/cart"}
                  className="relative p-2 rounded-full transition"
                >
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartSum?.totalItem || cartSum?.totalCartSize || 0}
                  </span>
                  <i className="fa-solid fa-cart-shopping"></i>
                </Link>

                {isLoggedIn ? (
                  <Link to="/profile" className="text-white">
                    <i className="fa-solid fa-circle-user text-4xl"></i>
                  </Link>
                ) : (
                  <Button
                    onClick={() => dispatch(toggleAuthModal(true))}
                    className=" text-black px-4 py-2 rounded-lg"
                  >
                    SignUp/Login
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {isMobile && (
          <p className="text-[10px] sm:text-xs md:text-s text-gray-700 text-center mt-1">
            Welcome to our store! Find the best deals here.
          </p>
        )}
      </nav>
      <div
        id="category-list"
        className={`container max-w-5xl xl:max-w-6xl mx-auto flex space-x-6 transition-all duration-300 ${
          isMobile ? "overflow-x-auto p-2 whitespace-nowrap scrollbar-hide" : ""
        } ${
          isSticky && isMobile
            ? "fixed top-0 left-0 w-full bg-white shadow-md z-40"
            : ""
        }`}
      >
        {isMobile
          ? categories
              ?.filter((category) => category.isVisible === true)
              ?.flatMap((category) =>
                category?.subcategories?.map((sub) => ({
                  categoryId: category._id,
                  id: sub._id,
                  name: sub.name,
                }))
              )
              ?.map((sub, idx) => {
                return (
                  <div
                    key={`${sub?.id}-${idx}`}
                    onClick={() => handleCategorySelection(sub?.name)}
                    className={`shadow-md rounded-md px-4 py-2 text-gray-800 text-sm mt-2 cursor-pointer transition-all duration-300 ${
                      selectedCategory === sub?.name
                        ? "bg-green-600 border-b-4 border-green-950 text-white"
                        : "bg-white"
                    }`}
                  >
                    <Link to={`/${sub?.categoryId}/${sub?.id}`} state={{selectedCategoryName:sub.name}}>
                      {sub?.name}
                    </Link>
                  </div>
                );
              })
          : categories
              ?.filter((category) => category?.isVisible)
              ?.map((category) => (
                <div
                  key={category?._id}
                  className="relative cursor-pointer group"
                >
                  {/* Parent Category Name */}
                  <div className="inline-flex items-center">
                    <span className="font-semibold px-4 py-2 cursor-pointer transition-all duration-300 text-xs">
                      <Link to={`/categoryviewAll/${category?._id}`}>
                        {category?.name}
                      </Link>
                      {category?.subcategories?.length > 0 && (
                        <i className="fa-solid fa-angle-down ml-2 transition-transform duration-300 group-hover:rotate-180"></i>
                      )}
                    </span>
                  </div>
                  {category?.subcategories?.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-40">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub?._id}
                          to={`/${category?._id}/${sub?._id}`}
                          state={{selectedCategoryName:sub.name}}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left text-xs"
                        >
                          {sub?.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
      </div>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform rounded-r-xl z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        ref={sideBarRef}
      >
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-50">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
          <nav className="p-4 space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="border-b">
                <p
                  className={`text-gray-700 font-semibold cursor-pointer flex justify-between items-center py-2 ${
                    category.subcategories?.length ? "" : "cursor-default"
                  }`}
                  onClick={() =>
                    category.subcategories?.length &&
                    handleCategoryClick(category.name)
                  }
                >
                  {category.name}

                  {category.subcategories?.length > 0 && (
                    <i
                      className={`fa-solid fa-chevron-down transform transition-transform duration-300 ${
                        activeCategory === category.name
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    ></i>
                  )}
                </p>

                <ul
                  className={`ml-4 overflow-hidden transition-all text-left duration-300 ${
                    activeCategory === category.name
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {category?.subcategories?.map((cat, idx) => (
                    <li
                      key={idx}
                      className="text-gray-600 hover:text-green-500 cursor-pointer py-1"
                    >
                      <Link to={`/${category._id}/${cat._id}`}>{cat.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {isAdmin && (
            <div className="p-4">
              <Link to={"/admin/admin"}>Admin</Link>
            </div>
          )}
        </div>

        <SignUp />
      </div>
    </div>
  );
}
