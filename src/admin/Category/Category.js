import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../../redux/state/category/Action";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, Filter } from "lucide-react";
import toast from "react-hot-toast";

const tagFilters = [
  { label: "Bestseller", type: "isBestseller" },
  { label: "Featured", type: "isFeatured" },
  { label: "On Sale", type: "isSale" },
  { label: "Visible", type: "isVisible" },
  { label: "New Arrivals", type: "newArrivals" },
  { label: "Special", type: "isSpecial" },
  { label: "Home Page Visible", type: "isHomePageVisible" },
  { label: "Parent Category", type: "isParent" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const Category = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const filterRef = useRef();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    if (filterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterDropdownOpen]);

  const toggleTag = (tagType) => {
    setSelectedTags((prev) =>
      prev.includes(tagType)
        ? prev.filter((tag) => tag !== tagType)
        : [...prev, tagType]
    );
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (cat.name?.toLowerCase() || "").includes(searchLower) ||
        (cat.description?.toLowerCase() || "").includes(searchLower) ||
        (cat.seoTitle?.toLowerCase() || "").includes(searchLower);

      if (!matchesSearch) return false;

      if (
        selectedStatus === "active" &&
        cat.status.toLowerCase() !== "active"
      ) {
        return false;
      }

      if (
        selectedStatus === "inactive" &&
        cat.status.toLowerCase() === "active"
      ) {
        return false;
      }

      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) => cat[tag]);
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [categories, searchTerm, selectedStatus, selectedTags]);

  const openModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCategoryToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      const id = categoryToDelete._id;
      setDeletingCategoryId(id);
      closeModal();
      try {
        await dispatch(deleteCategory(id));
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete category");
      } finally {
        setDeletingCategoryId(null);
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen px-4 sm:px-8 py-10 text-gray-900"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: "#166534" }}
        >
          Manage Categories
        </h1>
        <button
          onClick={() => navigate("/admin/category/addCategory")}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform hover:scale-105"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-6 items-start">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow min-w-[200px] px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed"
          disabled={!categories.length>0?true:false}
          style={{ backgroundColor: "#ffffff" }}
        />
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterDropdownOpen((prev) => !prev)}
            aria-expanded={filterDropdownOpen}
            aria-controls="filter-dropdown"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400 focus:outline-none text-white px-4 py-2 rounded-md shadow-md transition disabled:cursor-not-allowed"
            disabled={!categories.length>0?true:false}
          >
            <Filter size={18} />
            Filters
          </button>

     <AnimatePresence>
  {filterDropdownOpen && (
    <motion.div
      id="filter-dropdown"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="absolute z-50 right-0 mt-2 bg-white dark:bg-green-300 shadow-xl rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 w-[90vw] sm:w-64 md:w-72 max-h-[90vh] overflow-auto"
    >
      {/* Status Filter */}
      <div className="mb-5">
        <h3 className="font-semibold text-black dark:text-black mb-3 text-base sm:text-lg border-b pb-1 border-gray-300 dark:border-gray-600">
          Status
        </h3>
        {statusOptions.map((status) => (
          <label
            key={status.value}
            className="flex items-center gap-3 mb-2 cursor-pointer select-none text-black hover:text-green-900 dark:hover:text-green-900 transition text-sm sm:text-base"
          >
            <input
              type="radio"
              name="status"
              value={status.value}
              checked={selectedStatus === status.value}
              onChange={() => setSelectedStatus(status.value)}
              className="accent-black-600 dark:accent-black-400 cursor-pointer"
            />
            <span>{status.label}</span>
          </label>
        ))}
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="font-semibold text-black mb-3 text-base sm:text-lg border-b pb-1 border-gray-300 dark:border-gray-600">
          Tags
        </h3>
        <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
          {tagFilters.map((tag) => (
            <label
              key={tag.type}
              className="flex items-center gap-3 cursor-pointer select-none text-black hover:text-green-600 dark:hover:text-green-900 transition text-sm sm:text-base"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.type)}
                onChange={() => toggleTag(tag.type)}
                className="accent-green-600 dark:accent-green-400 cursor-pointer"
              />
              <span>{tag.label}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

        </div>
      </div>

      {/* Table */}
      <div className="shadow rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm sm:text-base">
          <thead className="text-center border-b bg-green-100 text-green-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4 hidden sm:table-cell">Description</th>
              <th className="p-4 hidden sm:table-cell">Status</th>
              <th className="p-4 hidden sm:table-cell">Tags</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !deletingCategoryId ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-7 h-7 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-green-700 font-semibold text-lg">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-600">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No categories found.</p>
                </td>
              </tr>
            ) : filteredCategories.length > 0 ? (
              <AnimatePresence>
                {filteredCategories.map((category) => {
                  const isDeleting = deletingCategoryId === category._id;
                  return (
                    <motion.tr
                      key={category._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className={`text-center border-b hover:bg-green-50 transition ${
                        isDeleting ? "animate-pulse bg-red-300" : ""
                      }`}
                    >
                      <td
                        className="p-4 font-medium cursor-pointer text-green-800"
                        onClick={() =>
                          navigate(`/admin/category/view/${category._id}`, {
                            state: { category },
                          })
                        }
                      >
                        {category.name}
                      </td>
                      <td className="p-4 hidden sm:table-cell text-gray-700">
                        {category.description || "—"}
                      </td>
                      <td className="p-4 hidden sm:table-cell capitalize text-green-700">
                        {category.status}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex flex-wrap justify-center gap-1">
                          {tagFilters.map(
                            (tag) =>
                              category[tag.type] && (
                                <span
                                  key={tag.type}
                                  className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {tag.label}
                                </span>
                              )
                          )}
                        </div>
                      </td>
                      <td className="p-4 flex justify-center flex-wrap gap-2">
                        <button
                          className="bg-green-500 px-3 py-1.5 rounded-md text-sm text-white hover:bg-green-600 transition"
                          onClick={() =>
                            navigate(`/admin/category/edit/${category._id}`)
                          }
                          disabled={isDeleting}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="bg-red-500 px-3 py-1.5 rounded-md text-sm text-white hover:bg-red-600 transition"
                          onClick={() => openModal(category)}
                          disabled={isDeleting}
                        >
                          <Trash size={16} />
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
              <h2 className="text-lg font-semibold mb-4 text-green-800">
                Confirm Deletion
              </h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete{" "}
                <strong>{categoryToDelete?.name}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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

export default Category;
