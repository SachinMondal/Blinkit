import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, fetchCategoryById } from "../../redux/state/category/Action";
import { CircularProgress } from "@mui/material";

const EditCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  // Get category data from Redux store
  const { category, error } = useSelector((state) => state.category);

  // Local states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    isVisible: false,
    parentCategory: "",
    attributes: {},
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isFetching,setIsFetching]=useState(false);
  // Fetch category details when component mounts
  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchCategoryById(id));
    setIsFetching(false);
  }, [dispatch, id]);

  // Update form fields when category data is loaded
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        seoTitle: category.seoTitle || "",
        seoDescription: category.seoDescription || "",
        isVisible: category.isVisible || false,
        parentCategory: category.parentCategory || "",
        attributes: category.attributes || {},
        image: null,
      });
      setPreviewImage(category.image || "");
    }
  }, [category]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true); 

    try {
      const categoryData = new FormData();
      categoryData.append("name", formData.name);
      categoryData.append("description", formData.description);
      categoryData.append("seoTitle", formData.seoTitle);
      categoryData.append("seoDescription", formData.seoDescription);
      categoryData.append("isVisible", formData.isVisible ? "true" : "false");

      if (formData.parentCategory) {
        categoryData.append("parentCategory", formData.parentCategory);
      }

      if (formData.image) {
        categoryData.append("image", formData.image);
      }

      await dispatch(updateCategory(id, categoryData));
      navigate("/admin/category");
    } catch (error) {
      console.error("❌ Error updating category:", error);
    } finally {
      setIsSubmitting(false); // Hide spinner after request completes
    }
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:text-blue-700 flex items-center">
        ← Back
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Category</h1>

      {/* Show only when fetching product data */}
      {isFetching ? (
        <div className="flex items-center space-x-2">
          <CircularProgress size={24} className="text-blue-500" />
          <p className="text-gray-500">Fetching product...</p>
        </div>
      ) : (
        <>
          <label className="block text-gray-700 text-lg mb-2">Category Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4" />

          <label className="block text-gray-700 text-lg mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4 h-24" />

          <label className="block text-gray-700 text-lg mb-2">SEO Title</label>
          <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4" />

          <label className="block text-gray-700 text-lg mb-2">SEO Description</label>
          <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4 h-24" />

          <label className="block text-gray-700 text-lg mb-2">Is Visible</label>
          <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleChange} className="mb-4" />

          {previewImage && (
            <div className="mb-4">
              <p className="text-gray-700">Current Image:</p>
              <img src={previewImage} alt="Category" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}

          <label className="block text-gray-700 text-lg mb-2">Upload New Image</label>
          <input type="file" onChange={handleImageUpload} className="mb-4" />

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-4 mt-4">
            <button onClick={() => navigate("/admin/category")} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} className="text-white" /> : "Save"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditCategory;
