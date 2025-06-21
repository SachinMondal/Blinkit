import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import ProductTile from "../ProductDetails/ProductTile";
import LazyImage from "../utils/LazyLoading/LazyLoading";
import { getCategoryAndProduct } from "../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";

const CategoryPage = () => {
  const { parentCategory } = useParams();
  const category = parentCategory;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = useSelector(
    (state) => state.category.categoryAndProduct || []
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(getCategoryAndProduct(category));
  }, [dispatch, category]);

  useEffect(() => {
    if (categories?.subcategories?.length > 0) {
      setSelectedCategory(categories.subcategories[0].name);
    }
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setShowDropdown(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (name) => {
    setSelectedCategory(name);
  };
  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-4 flex flex-col md:flex-row">
      {/* Left Sidebar on Desktop */}
      <div className="hidden md:block w-1/4 min-w-[4rem] border-r p-2 sm:p-6 min-h-screen lg:max-h-screen overflow-y-auto scrollbar-hide">
        <ul className="flex flex-col w-full">
          {categories?.subcategories?.map((cat, index) => (
            <div key={cat._id}>
              <li
                className={`p-2 cursor-pointer rounded flex items-center w-full relative ${
                  selectedCategory === cat.name
                    ? "bg-green-200 font-bold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div
                  className={`absolute right-0 lg:left-0 top-0 h-full w-1 rounded-md transition-all duration-200 ${
                    selectedCategory === cat.name
                      ? "bg-green-700"
                      : "bg-transparent"
                  }`}
                ></div>
                <LazyImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-10 h-10 object-contain rounded-md"
                />
                <span className="ml-4 text-sm truncate">
                  {index === 0 ? "All" : cat.name}
                </span>
              </li>
              {index !== categories.subcategories.length - 1 && (
                <hr className="border-gray-200 my-2" />
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Top Horizontal Scroll for Mobile */}
      <div className="md:hidden w-full overflow-x-auto scrollbar-hide border-b py-3">
        <div className="flex gap-4 px-2">
          {categories?.subcategories?.map((cat, index) => (
            <motion.div
              whileTap={{ scale: 0.95 }}
              key={cat._id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center cursor-pointer min-w-[70px] p-2 rounded-md ${
                selectedCategory === cat.name
                  ? "bg-green-100 border border-green-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <LazyImage
                src={cat.image}
                alt={cat.name}
                className="w-12 h-12 object-contain rounded-full"
              />
              <span className="text-xs mt-1 text-center max-w-[60px] truncate">
                {index === 0 ? "All" : cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="w-full md:w-3/4 flex flex-col px-2 sm:px-4 space-y-4 mb-4 mx-auto"
        ref={containerRef}
      >
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 self-start">
          <Link to="/" className="text-green-500 hover:underline">
            Home
          </Link>{" "}
          &gt;{" "}
          <span className="text-gray-900">
            {selectedCategory || "All Products"}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-sm md:text-lg font-semibold">
            {selectedCategory} Products
          </h2>

          <div className="relative">
            <button
              className="md:hidden p-2 rounded-md flex items-center text-sm font-semibold"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Sort By ▼
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border rounded-md shadow-md z-50">
                <ul className="text-sm">
                  <li
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSort("asc")}
                  >
                    Price: Low to High
                  </li>
                  <li
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSort("desc")}
                  >
                    Price: High to Low
                  </li>
                </ul>
              </div>
            )}

            <div className="hidden md:flex items-center border p-2 rounded-md">
              <label className="mr-2 font-semibold">Sort By:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border p-1 rounded-md text-sm"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 ">
          {categories?.subcategories
            ?.filter((subcategory, index) => {
              if (selectedCategory === categories.subcategories?.[0]?.name) {
                return index !== 0;
              }
              return subcategory.name === selectedCategory;
            })
            ?.flatMap((subcategory) =>
              Array.isArray(subcategory.products)
                ? [...subcategory.products]
                    .sort((a, b) => {
                      const priceA = a.variants?.[0]?.price ?? 0;
                      const priceB = b.variants?.[0]?.price ?? 0;
                      return sortOrder === "asc"
                        ? priceA - priceB
                        : priceB - priceA;
                    })
                    .filter((product) => product.isArchive !== true)
                    .map((product, index) => (
                      <ProductTile
                        key={product._id || index}
                        product={product}
                        onClick={() => handleProductClick(product._id)}
                      />
                    ))
                : []
            )}
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollButton && (
        <button
          className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-700 flex items-center"
          onClick={scrollToTop}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default CategoryPage;
