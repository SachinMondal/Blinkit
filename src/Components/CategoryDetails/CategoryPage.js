import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import ProductTile from "../ProductDetails/ProductTile";

// Sample categories and products data
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 2,
    name: "Clothing",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 3,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 4,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 5,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 6,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 7,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 8,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 9,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
  {
    id: 10,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },

  {
    id: 11,
    name: "Books",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
  },
];

const mockProducts = {
  Electronics: [
    {
      id: 1,
      name: "Laptop",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 800,
    },
    {
      id: 2,
      name: "Smartphone",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 500,
    },
    {
      id: 3,
      name: "Headphones",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 150,
    },
  ],
  Clothing: [
    {
      id: 4,
      name: "T-Shirt",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 20,
    },
    {
      id: 5,
      name: "Jeans",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 40,
    },
    {
      id: 6,
      name: "Jacket",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 80,
    },
  ],
  Books: [
    {
      id: 7,
      name: "Novel",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 15,
    },
    {
      id: 8,
      name: "Textbook",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 50,
    },
    {
      id: 9,
      name: "Magazine",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
      price: 10,
    },
  ],
};

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(
    category || "Electronics"
  );
  const [sortedProducts, setSortedProducts] = useState([
    ...mockProducts[selectedCategory],
  ]);

  const containerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const[showScollButton,setShowScrollButton]=useState(false);
  
  const handleSort = (order) => {
    setSortOrder(order);
    setShowDropdown(false); 
  };
  useEffect(() => {
    if (mockProducts[selectedCategory]) {
      setSortedProducts(
        [...mockProducts[selectedCategory]].sort((a, b) =>
          sortOrder === "asc" ? a.price - b.price : b.price - a.price
        )
      );
    } else {
      setSortedProducts([]);
    }
  }, [selectedCategory, sortOrder]);

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
    <div className="max-w-5xl mx-auto p-4 flex flex-row flex-wrap">
      {/* Left Sidebar - Categories */}
      <div className="w-1/4 min-w-[4rem] border-r p-4 min-h-screen lg:max-h-screen overflow-y-auto scrollbar-hide">
        <ul className="flex flex-col w-full">
          {mockCategories.map((cat, index) => (
            <div key={cat.id}>
              <li
                className={`p-2 cursor-pointer rounded flex flex-col items-left md:items-center relative md:flex-row w-full ${
                  selectedCategory === cat.name
                    ? "bg-green-200 font-bold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {/* Dark Green Side Bar for Selected Category */}
                <div
                  className={`absolute right-0 lg:left-0 top-0 h-full w-1 rounded-md transition-all duration-200 ease-in-out ${
                    selectedCategory === cat.name
                      ? "bg-green-700"
                      : "bg-transparent"
                  }`}
                ></div>

                <img
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

              {/* Add <hr> after every category except the last one */}
              {index !== mockCategories.length - 1 && (
                <hr className="border-gray-300 my-2" />
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Right Side - Sorted Products */}
      <div className="w-3/4 p-4 flex flex-col space-y-4" ref={containerRef}>
        <div className="text-sm text-gray-600 self-start">
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>{" "}
          &gt; <span className="text-gray-900">{category}</span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-between items-center -mt-5">
          <h2 className="text-s md:text-lg font-semibold">
            {selectedCategory} Products
          </h2>

          {/* Sort Dropdown for Mobile */}
          <div className="relative">
            {/* Dropdown Button */}
            <button
              className="md:hidden p-2 rounded-md flex items-center text-sm font-semibold"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Sort By ▼
            </button>

            {/* Dropdown Menu - Positioned to the Left */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedProducts.map((product, index) => (
            <ProductTile
              key={index}
              image={product.image}
              name={product.name}
              quantity={30}
              price={product.price}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      </div>

      {showScollButton &&(
        <button
        className="fixed bottom-6 right-6 bg-green-200 text-white p-3 rounded-full shadow-lg hover:bg-green-700 flex items-center"
        onClick={scrollToTop}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      )}
      
    </div>
  );
};

export default CategoryPage;
