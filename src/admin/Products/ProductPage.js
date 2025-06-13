import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  deleteProduct,
} from "../../redux/state/product/Action";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";
const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.product);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filters, setFilters] = useState({
    veg: false,
    nonveg: false,
    inStock: false,
    hasVariants: false,
    hasDescription: false,
  });
  const [deletingProductId, setDeletingProductId] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    try {
      if (productToDelete?._id) {
        setDeletingProductId(productToDelete._id);
        dispatch(deleteProduct(productToDelete._id)).then(() => {
          dispatch(getAllProducts());
          setDeletingProductId(null);
        });
      }
      toast.success("Product Deleted Successfully");
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Error in Deleting Product", e);
    }
  };

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const safeToLower = (str) =>
    typeof str === "string" ? str.toLowerCase() : "";

  const search = safeToLower(searchQuery);

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      safeToLower(product.name).includes(search) ||
      safeToLower(product.description).includes(search) ||
      safeToLower(product.brand).includes(search) ||
      (typeof product.category === "object"
        ? safeToLower(product.category.name).includes(search)
        : safeToLower(product.category).includes(search));

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Archive" && product.isArchive === true) ||
      (statusFilter === "Non-Archive" && product.isArchive === false);

    const matchesFilter =
      (!filters.veg || product.type === "veg") &&
      (!filters.nonveg || product.type === "nonveg") &&
      (!filters.inStock || product.stock > 0) &&
      (!filters.hasVariants ||
        (product.variants && product.variants.length > 0)) &&
      (!filters.hasDescription || !!product.description);

    return matchesSearch && matchesStatus && matchesFilter;
  });

  return (
    <div
      className="w-full min-h-screen px-4 sm:px-8 py-10 text-gray-900"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1
          className="text-2xl sm:text-3xl font-bold text-green-800"
          style={{ color: "#166534" }}
        >
          Manage Products
        </h1>
        <button
          onClick={() => navigate("/admin/products/addProduct")}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform hover:scale-105 cursor-pointer"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sn:items-start">
        <input
          type="text"
          placeholder="Search by name, description, brand, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-1 flex-grow min-w-[200px] px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed"
          disabled={products.length === 0}
          style={{ backgroundColor: "#ffffff" }}
        />

        <div className="relative " ref={dropdownRef}>
          <button
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400 focus:outline-none text-white px-4 py-2 rounded-md shadow-md transition disabled:cursor-not-allowed"
            aria-controls="filter-dropdown"
            aria-expanded={showFilterDropdown}
            disabled={products.length === 0}
          >
            <Filter size={18} />
            Filters
          </button>

          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 right-0 mt-2 bg-white dark:bg-green-300 shadow-xl rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 w-[90vw] sm:w-64 md:w-72 max-h-[90vh] overflow-auto"
              >
                <div>
                  <p className="mb-5">
                    Status
                  </p>
                  {["All", "Archive", "Non-Archive"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center space-x-3 text-sm text-gray-700 mb-2 cursor-pointer hover:text-green-600 transition"
                    >
                      <input
                        type="radio"
                        name="statusFilter"
                        value={status}
                        checked={statusFilter === status}
                        onChange={() => setStatusFilter(status)}
                        className="accent-green-500 cursor-pointer"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>

                <hr className="my-3 border-black" />

                <div>
                  <h3 className="font-semibold text-black mb-3 text-md pb-1 border-gray-300 dark:border-gray-600">
                    Tags
                  </h3>
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                    {[
                      { label: "Veg", key: "veg" },
                      { label: "Non-Veg", key: "nonveg" },
                      { label: "In Stock", key: "inStock" },
                      { label: "Has Variants", key: "hasVariants" },
                      { label: "Has Description", key: "hasDescription" },
                    ].map(({ label, key }) => (
                      <label
                        key={key}
                        className="flex items-center space-x-3 text-sm text-gray-700 mb-3 cursor-pointer hover:text-green-600 transition"
                      >
                        <input
                          type="checkbox"
                          checked={filters[key]}
                          onChange={() => handleFilterChange(key)}
                          className="accent-green-500 cursor-pointer"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="shadow rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm sm:text-base table-auto overflow-hidden">
          <thead className="text-center border-b bg-green-100 text-green-800">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4 hidden md:table-cell">Category</th>
              <th className="p-4 hidden lg:table-cell">No of Variants</th>
              <th className="p-4 hidden lg:table-cell">Stock</th>
              <th className="p-4 hidden md:table-cell">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !deletingProductId ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-7 h-7 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-green-700 font-semibold text-lg">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-600">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No products found.</p>
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              <AnimatePresence>
                {filteredProducts.map((product) => {
                  const isDeleting = deletingProductId === product._id;
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className={`text-center border-b hover:bg-green-50 transition ${
                        isDeleting ? "animate-pulse bg-red-300" : ""
                      }`}
                    >
                      <td className="p-4 text-sm sm:text-base">
                        {product.name}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {typeof product?.category === "object"
                          ? product?.category?.name
                          : product?.category}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {product?.variants?.length || 0}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {product?.stock}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {product?.isArchive ? (
                          <span className="text-red-600 font-semibold">
                            Archive
                          </span>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            Non-Archive
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex justify-center space-x-4 text-sm sm:Text-base">
                        <Link
                          to={`/admin/products/${product?._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/products/editProduct/${product?._id}`}
                          className="text-yellow-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:underline"
                          disabled={deletingProductId !== null}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-600">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No categories match the current filters/search.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold text-gray-800">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete{" "}
                <strong>{productToDelete?.name}</strong>?
              </p>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
