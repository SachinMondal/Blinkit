import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Category = () => {
  const navigate = useNavigate();

  // Sample categories data (Replace with API data)
  const [categories, setCategories] = useState([
    // { id: 1, name: "Fruits", description: "Fresh and organic fruits" },
    // { id: 2, name: "Vegetables", description: "Healthy green vegetables" },
    // { id: 3, name: "Dairy", description: "Milk, cheese, and more" },
  ]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Open delete modal
  const openModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  // Close delete modal
  const closeModal = () => {
    setCategoryToDelete(null);
    setIsModalOpen(false);
  };

  // Handle category deletion
  const handleDelete = () => {
    if (categoryToDelete) {
      // TODO: Replace with actual API call
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      closeModal();
    }
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10">
      {/* Page Title & Add Category Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => navigate("/admin/category/addCategory")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium mt-4 sm:mt-0"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 text-lg">
              <th className="p-4">Category Name</th>
              <th className="p-4 hidden sm:table-cell">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-lg">{category.name}</td>
                  <td className="p-4 hidden sm:table-cell">{category.description}</td>
                  <td className="p-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm mr-2"
                      onClick={() => navigate(`/admin/category/edit/${category.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => openModal(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
              
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Category</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
