import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addCategory,
  fetchCategories,
} from "../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { loading, error } = useSelector((state) => state.category);
  const [errors, setErrors] = useState({});
  const categories = useSelector((state) => state.category.categories || []);

  useEffect(() => {
    setIsNextDisabled(Object.keys(errors).length > 0);
  }, [errors]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    attributes: {},
    parentCategory: "",
    seoTitle: "",
    seoDescription: "",
    isVisible: false,
    isHomePageVisible: false,
    status: "active",
    discountPercentage: "",
    tags: "",
    isFeatured: false,
    isBestseller: false,
    isSpecial: false,
    newArrivals: false,
    isSale: false,
  });
 const validateFields = useCallback(
  (step) => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Category Name is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.image) newErrors.image = "Category Image is required";
    } else if (step === 2) {
      if (Object.keys(formData.attributes).length === 0)
        newErrors.attributes = "Attributes are required";

      if (!formData.parentCategory)
        newErrors.parentCategory = "Parent category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  },
  [formData.attributes, formData.description, formData.image, formData.name, formData.parentCategory]
);


  useEffect(() => {
    validateFields(step);
  }, [formData, step, validateFields]);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      validateFields(step);
      return updatedFormData;
    });
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, image: e.target.files[0] };
      validateFields(step);
      return updatedFormData;
    });
  };

 const handleSubmit = async () => {
  if (!validateFields(3)) return;

  try {
    const categoryData = new FormData();
    categoryData.append("name", formData.name);
    categoryData.append("description", formData.description);
    categoryData.append("seoTitle", formData.seoTitle);
    categoryData.append("seoDescription", formData.seoDescription);
    categoryData.append("isVisible", formData.isVisible ? "true" : "false");
    categoryData.append(
      "isHomePageVisible",
      formData.isHomePageVisible ? "true" : "false"
    );
    categoryData.append("status", formData.status);
    categoryData.append("discountPercentage", formData.discountPercentage);
    categoryData.append("tags", formData.tags);
    categoryData.append("isFeatured", formData.isFeatured ? "true" : "false");
    categoryData.append("isBestSeller", formData.isBestseller ? "true" : "false");
    categoryData.append("isSpecial", formData.isSpecial ? "true" : "false");
    categoryData.append("newArrivals", formData.newArrivals ? "true" : "false");
    categoryData.append("isSale", formData.isSale ? "true" : "false");

    if (formData.parentCategory) {
      categoryData.append("parentCategory", formData.parentCategory);
    }

    if (formData.image) {
      categoryData.append("image", formData.image);
    }

    Object.entries(formData.attributes).forEach(([key, value]) => {
      categoryData.append(`attributes[${key}]`, value);
    });

    // Use toast.promise
    await toast.promise(dispatch(addCategory(categoryData)), {
      loading: "Saving category...",
      success: "Category added successfully!",
      error: "Failed to add category",
    });

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
  const handleNext = () => {
    if (validateFields(step)) {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Add New Category
      </h1>

      {/* Stepper */}
      <div className="flex flex-wrap justify-between sm:justify-start sm:space-x-6 text-gray-600 font-medium border-b pb-4">
        {["Basic Details", "Attributes", "SEO"].map((title, index) => {
          const isClickable = index <= step - 1; 

          return (
            <div
              key={index}
              className={`flex-1 sm:w-auto text-center py-2 cursor-pointer transition 
          ${
            step === index + 1
              ? "border-b-4 border-green-500 text-green-500 font-semibold"
              : isClickable
              ? "text-gray-500 hover:text-green-600"
              : "text-gray-400 cursor-not-allowed"
          }`}
              onClick={() => {
                if (isClickable) {
                  setStep(index + 1);
                }
              }}
            >
              {title}
            </div>
          );
        })}
      </div>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Category Name*
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleAttribute}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              />
              {errors.name && (
  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
)}
            </div>
            
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Description*
              </label>
              <textarea
                name="description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              />
                {errors.description && (
  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
)}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-lg font-medium text-gray-700">
                Category Image*
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              />
                {errors.image && (
  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
)}
            </div>
          </div>
        </>
      )}

      {/* Step 2: Attributes */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Attributes Section */}
          <div>
            <label className="block text-sm md:text-lg font-medium text-gray-700">
              Attributes*
            </label>
            <div className="flex flex-col gap-2">
              {Object.entries(formData.attributes).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="flex flex-wrap md:flex-nowrap gap-2 items-center"
                  >
                    {/* Attribute Key */}
                    <input
                      type="text"
                      placeholder="Attribute Name (e.g., Fat)"
                      value={key}
                      onChange={(e) =>
                        handleAttributeChange(index, e.target.value, value)
                      }
                      className="flex-1 p-2 md:p-3 border border-gray-300 rounded-lg text-sm"
                    />
                    {/* Attribute Value */}
                    <input
                      type="text"
                      placeholder="Attribute Value (e.g., Low Fat)"
                      value={value}
                      onChange={(e) =>
                        handleAttributeChange(index, key, e.target.value)
                      }
                      className="flex-1 p-2 md:p-3 border border-gray-300 rounded-lg text-sm"
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
              className="mt-3 px-4 py-2 text-green-600 border border-green-400 rounded-lg hover:bg-green-50 w-full md:w-auto"
            >
              + Add Attribute
            </button>
              {errors.attributes && (
  <p className="text-red-500 text-sm mt-1">{errors.attributes}</p>
)}
          </div>

          {/* Parent Category Section */}
          <div>
            <label className="block text-sm md:text-lg font-medium text-gray-700">
              Parent Category*
            </label>
            <select
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="w-full mt-2 p-2 md:p-3 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.parentCategory && (
  <p className="text-red-500 text-sm mt-1">{errors.parentCategory}</p>
)}
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm md:text-lg font-medium text-gray-700">
              Discount Percentage
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              placeholder="Enter discount percentage"
              className="w-full mt-2 p-2 md:p-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm md:text-lg font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-2 p-2 md:p-3 border border-gray-300 rounded-lg text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm md:text-lg font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags (e.g., organic, fresh, vegan)"
              className="w-full mt-2 p-2 md:p-3 border border-gray-300 rounded-lg text-sm"
            />
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
              placeholder="SEO title for search engines (comma separated)"
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

          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
            {[
              { name: "isVisible", label: "Make Category Visible in Nav" },
              { name: "isHomePageVisible", label: "Show in HomePage" },
              { name: "isBestseller", label: "Mark as Best Seller" },
              { name: "isSpecial", label: "Mark as Special" },
              { name: "newArrivals", label: "Mark as New" },
              { name: "isSale", label: "Mark in Sale" },
              { name: "isFeatured", label: "Mark in Featured" },
            ].map((item, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name]}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500 rounded"
                />
                <span className="text-gray-800 text-sm sm:text-base">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-10 space-y-4 sm:space-y-0">
        {step === 1 && (
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-lg font-medium text-gray-700 border rounded-lg w-full sm:w-auto"
          >
            Back
          </button>
        )}
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
            disabled={isNextDisabled}
            className={`px-6 py-2 rounded-lg text-white ${
              isNextDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-lg font-medium bg-green-500 text-white rounded-lg w-full sm:w-auto"
          >
            {loading ? (
              <CircularProgress size={24} className="text-white" />
            ) : (
              "Submit"
            )}
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
