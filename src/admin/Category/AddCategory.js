import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCategory, fetchCategories } from "../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [step, setStep] = useState(1);
  const categories = useSelector((state) => state.category.categories || []);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    attributes: {},
    parentCategory: "",
    seoTitle: "",
    seoDescription: "",
    isVisible: true,
  });
  const { loading, error } = useSelector((state) => state.category);
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const handleSubmit = async () => {
    try {
      const categoryData = new FormData();
      categoryData.append("name", formData.name);
      categoryData.append("description", formData.description);
      categoryData.append("seoTitle", formData.seoTitle);
      categoryData.append("seoDescription", formData.seoDescription);
      categoryData.append("isVisible", formData.isVisible ? "true" : "false"); 
  
      // ✅ Fix: Ensure ID is passed instead of name
      if (formData.parentCategory) {
        categoryData.append("parentCategory", formData.parentCategory); // This is now an ID
      }
  
      if (formData.image) categoryData.append("image", formData.image);
  
      Object.entries(formData.attributes).forEach(([key, value]) => {
        categoryData.append(`attributes[${key}]`, value);
      });
  
      await dispatch(addCategory(categoryData));
      navigate("/admin/category");
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  const handleAttribute = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAttributeChange = (index, newKey, newValue) => {
    setFormData((prev) => {
      const updatedAttributes = { ...prev.attributes };
      const keys = Object.keys(updatedAttributes);
      const oldKey = keys[index];

      delete updatedAttributes[oldKey];
      updatedAttributes[newKey] = newValue;

      return { ...prev, attributes: updatedAttributes };
    });
  };

  const handleAddAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, "": "" },
    }));
  };
  const handleRemoveAttribute = (index) => {
    setFormData((prev) => {
      const updatedAttributes = { ...prev.attributes };
      const keys = Object.keys(updatedAttributes);
      delete updatedAttributes[keys[index]];

      return { ...prev, attributes: updatedAttributes };
    });
  };
  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Add New Category
      </h1>

      {/* Stepper */}
      <div className="flex flex-wrap justify-between sm:justify-start sm:space-x-6 text-gray-600 font-medium border-b pb-4">
        {["Basic Details", "Attributes", "SEO"].map((title, index) => (
          <div
            key={index}
            className={`flex-1 sm:w-auto text-center py-2 cursor-pointer ${
              step === index + 1
                ? "border-b-4 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setStep(index + 1)}
          >
            {title}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleAttribute}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-lg font-medium text-gray-700">
              Category Image
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Step 2: Attributes */}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Attributes Section */}
          <div>
            <label className="block text-sm sm:text-lg font-medium text-gray-700">
              Attributes
            </label>

            <div className="flex flex-col gap-2">
              {Object.entries(formData.attributes).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="flex flex-wrap sm:flex-nowrap gap-2 items-center"
                  >
                    {/* Attribute Key */}
                    <input
                      type="text"
                      placeholder="Attribute Name (e.g., Fat)"
                      value={key}
                      onChange={(e) =>
                        handleAttributeChange(index, e.target.value, value)
                      }
                      className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
                    />
                    {/* Attribute Value */}
                    <input
                      type="text"
                      placeholder="Attribute Value (e.g., Low Fat)"
                      value={value}
                      onChange={(e) =>
                        handleAttributeChange(index, key, e.target.value)
                      }
                      className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
                    />
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveAttribute(index)}
                      className="p-2 text-red-600 border border-red-400 rounded-lg hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Add Attribute Button */}
            <button
              onClick={handleAddAttribute}
              className="mt-3 px-4 py-2 text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50 w-full sm:w-auto"
            >
              + Add Attribute
            </button>
          </div>

          {/* Parent Category Section */}
          <div>
  <label className="block text-sm sm:text-lg font-medium text-gray-700">
    Parent Category
  </label>
  <select
    name="parentCategory"
    value={formData.parentCategory}
    onChange={handleChange}
    className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
  >
    <option value="">None</option>
    {categories.map((category) => (
      <option key={category._id} value={category._id}>
        {category.name} 
      </option>
    ))}
  </select>
</div>

        </div>
      )}

      {/* Step 3: SEO */}
      {step === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              placeholder="SEO title for search engines"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              placeholder="SEO description for search engines"
              value={formData.seoDescription}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2 flex items-center">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="w-5 h-5 mr-2"
            />
            <span className="text-lg text-gray-700">Make Category Visible</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-10 space-y-4 sm:space-y-0">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 text-lg font-medium text-gray-700 border rounded-lg w-full sm:w-auto"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg w-full sm:w-auto"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-lg font-medium bg-green-500 text-white rounded-lg w-full sm:w-auto"
          >
            {loading ? <CircularProgress size={24} className="text-white" /> :"Submit"} 
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
