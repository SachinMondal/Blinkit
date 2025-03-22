import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for category data
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch category details from API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/categories/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCategoryName(data.name);
          setCategoryDescription(data.description);
        } else {
          console.error("Failed to fetch category data");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
        }),
      });

      if (response.ok) {
        navigate("/categories"); // Redirect back to category list
      } else {
        console.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Category</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Category Name */}
          <label className="block text-gray-700 text-lg mb-2">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Description */}
          <label className="block text-gray-700 text-lg mb-2">Description</label>
          <textarea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/admin/category")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditCategory;
