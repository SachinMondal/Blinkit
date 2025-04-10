import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import ProductTile from "../ProductDetails/ProductTile";
import emptyCategory from "../../images/emptyCategory.jpg";
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
  useEffect(() => {
    dispatch(getCategoryAndProduct(category));
  }, [dispatch, categories.length, category]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const containerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    if (categories?.subcategories?.length > 0) {
      setSelectedCategory(categories.subcategories[0].name);
    }
  }, [categories]);
  const handleSort = (order) => {
    setSortOrder(order);
    console.log(order);
    setShowDropdown(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div className="max-w-5xl mx-auto p-0 sm:p-4 flex flex-row flex-wrap">
      
      {categories.length > 0 ? (
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
          <LazyImage src={emptyCategory} alt="Empty" className="w-48 h-48" />
        </div>
      ) : (
        <>
          <div className="w-1/5 sm:w-1/4 min-w-[4rem] border-r p-2 sm:p-8 min-h-screen lg:max-h-screen overflow-y-auto scrollbar-hide">
            <ul className="flex flex-col w-full">
              {categories?.subcategories?.map((cat, index) => (
                <div key={cat._id}>
                  <li
                    className={`p-2 cursor-pointer rounded flex flex-col items-left md:items-center relative md:flex-row w-full ${
                      selectedCategory === cat.name
                        ? "bg-green-200 font-bold"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <div
                      className={`absolute right-0 lg:left-0 top-0 h-full w-1 rounded-md transition-all duration-200 ease-in-out ${
                        selectedCategory === cat.name
                          ? "bg-green-700"
                          : "bg-transparent"
                      }`}
                    ></div>
                    <LazyImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-md"
                    />
                    <div className="flex flex-nowrap">
                      <span className="ml-0 md:ml-4 text-xs md:text-base truncate max-w-[100px] md:max-w-full whitespace-nowrap">
                        {cat.name}
                      </span>
                    </div>
                  </li>
                  {index !== categories.length - 1 && (
                    <hr className="border-gray-300 my-2" />
                  )}
                </div>
              ))}
            </ul>
          </div>

          <div className="w-3/4 p-1 sm:p-4 flex flex-col space-y-4" ref={containerRef}>
            <div className="text-sm text-gray-600 self-start">
              <Link to="/" className="text-blue-500 hover:underline">
                Home
              </Link>{" "}
              &gt;{" "}
              <span className="text-gray-900">
                {selectedCategory || "All Products"}
              </span>
            </div>

            
            <div className="flex justify-between items-center -mt-5">
              <h2 className="text-s md:text-lg font-semibold">
                {selectedCategory} Products
              </h2>

              {/* Sort Dropdown for Mobile */}
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

                {/* Default Sort Dropdown - Visible on Larger Screens */}
                <div className="hidden md:flex items-center border p-2 rounded-md">
                  <label className="mr-2 font-semibold">Sort By:</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border p-2 rounded-md"
                  >
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sorted Product List */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {categories?.subcategories?.flatMap((subcategory) =>
                Array.isArray(subcategory.products)
                  ? [...subcategory.products]
                      .sort((a, b) => {
                        const priceA = a.variants?.[0]?.price ?? 0;
                        const priceB = b.variants?.[0]?.price ?? 0;
                        return sortOrder === "asc"
                          ? priceA - priceB
                          : priceB - priceA;
                      })
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

          {/* Scroll to Top Button */}
          {showScrollButton && (
            <button
              className="fixed bottom-6 right-6 bg-green-200 text-white p-3 rounded-full shadow-lg hover:bg-green-700 flex items-center"
              onClick={scrollToTop}
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
