import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    attributes: "",
    parentCategory: "",
    seoTitle: "",
    seoDescription: "",
    isVisible: true,
  });

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

  const handleSubmit = () => {
    console.log("Category Data Submitted:", formData);
    navigate("/admin/category");
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
              step === index + 1 ? "border-b-4 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"
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
            <label className="block text-lg font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-lg font-medium text-gray-700">Category Image</label>
            <input type="file" onChange={handleImageUpload} className="w-full mt-2 p-3 border border-gray-300 rounded-lg" />
          </div>
        </div>
      )}

      {/* Step 2: Attributes */}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Attributes</label>
            <input
              type="text"
              name="attributes"
              placeholder="e.g., Organic, Imported"
              value={formData.attributes}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Parent Category</label>
            <select
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            >
              <option value="">None</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: SEO */}
      {step === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">SEO Title</label>
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
            <label className="block text-lg font-medium text-gray-700">SEO Description</label>
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
          <button onClick={handleBack} className="px-6 py-3 text-lg font-medium text-gray-700 border rounded-lg w-full sm:w-auto">
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={handleNext} className="px-6 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg w-full sm:w-auto">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-6 py-3 text-lg font-medium bg-green-500 text-white rounded-lg w-full sm:w-auto">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
