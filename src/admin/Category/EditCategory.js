import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, fetchCategoryById } from "../../redux/state/category/Action";
import { CircularProgress } from "@mui/material";

const EditCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { category, error } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    seoTitle: "",
    isParent:"",
    seoDescription: "",
    isVisible: false,
    isHomePageVisible: false,
    isSpecial: false,
    isNew: false,
    isSale: false,
    isFeatured: false,
    isBestseller: false,
    parentCategory: "",
    discountPercentage: 0,
    status: "active",
    tags: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        seoTitle: category.seoTitle || "",
        seoDescription: category.seoDescription || "",
        isVisible: Boolean(category.isVisible), 
        isHomePageVisible: Boolean(category.isHomePageVisible),
        isSpecial: Boolean(category.isSpecial),
        isNew: Boolean(category.isNew),
        isSale: Boolean(category.isSale),
        isFeatured: Boolean(category.isFeatured),
        isBestseller: Boolean(category.isBestseller),
        isParent: Boolean(category.isParent),
        parentCategory: category.parentCategory || "",
        discountPercentage: category.discountPercentage || 0,
        status: category.status || "active",
        tags: category.tags?.join(", ") || "",
        image: null,
      });
      setPreviewImage(category.image || "");
      setIsFetching(false);
    }
  }, [category]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const categoryData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          categoryData.append(key, formData[key]);
        }
      });
      await dispatch(updateCategory(id, categoryData));
      navigate("/admin/category");
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen px-6 sm:px-12 py-10 flex flex-col mb-10">
       <button onClick={() => navigate(-1)} className="absolute top-4 right-4 text-white bg-gray-600 px-5 py-3 rounded-lg hover:text-blue-700">← Back</button>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      {isFetching ? (
        <div className="flex items-center space-x-2">
          <CircularProgress size={24} />
          <p>Loading category data...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="md:col-span-2 flex justify-center relative">
            {previewImage && (
              <div className="relative w-40 h-40 mb-9">
                <img src={previewImage} alt="Category" className="w-full h-full object-cover rounded-lg border" />
                <input type="file" onChange={handleImageUpload} className="mt-2 block w-full text-sm" />
              </div>
            )}
          </div>
  
          {/* Category Details */}
          <div>
            <label className="block font-semibold">Category Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" />
  
            <label className="block mt-4 font-semibold">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
  
          {/* SEO Details */}
          <div>
            <label className="block font-semibold">SEO Title</label>
            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full p-2 border rounded-lg" />
  
            <label className="block mt-4 font-semibold">SEO Description</label>
            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
  
          {/* Discount & Parent Category */}
          <div>
            <label className="block font-semibold">Discount Percentage</label>
            <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold">Parent Category</label>
            <input type="text" name="parentCategory" value={formData.parentCategory} onChange={handleChange} className="w-full p-2 border rounded-lg" disabled />
          </div>
  
          {/* Tags & Status */}
          <div>
            <label className="block font-semibold">Tags (comma-separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
  
        {/* Feature Toggles */}
        <div className="mt-6 p-4 border rounded-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {["isVisible", "isHomePageVisible", "isSpecial", "isNew", "isSale", "isFeatured", "isBestseller", "isParent"].map((key) => (
            <label key={key} className="flex items-center">
              <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} className="mr-2" />
              {key.replace("is", "").replace(/([A-Z])/g, " $1")}
            </label>
          ))}
        </div>
      </div>
      )}
      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-lg flex justify-center">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-1/2" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} className="text-white" /> : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EditCategory;
