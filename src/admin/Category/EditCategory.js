import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, fetchCategoryById } from "../../redux/state/category/Action";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

const FEATURE_TOGGLE_LABELS = {
  isVisible: "Visible",
  isHomePageVisible: "Show on Home Page",
  isSpecial: "Special",
  newArrivals: "New Arrivals",
  isSale: "On Sale",
  isFeatured: "Featured",
  isBestseller: "Bestseller",
  isParent: "Is Parent Category",
};

const EditCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { category, error } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    seoTitle: "",
    isParent: false,
    seoDescription: "",
    isVisible: false,
    isHomePageVisible: false,
    isSpecial: false,
    newArrivals: false,
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
  const [isResetting, setIsResetting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
        newArrivals: Boolean(category.newArrivals),
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
      setValidationErrors({});
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = "Discount must be between 0 and 100";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const categoryData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "tags" && formData[key]) {
          categoryData.append(key, formData[key].split(",").map((t) => t.trim()));
        } else if (formData[key] !== "" && formData[key] !== null) {
          categoryData.append(key, formData[key]);
        }
      });
      await dispatch(updateCategory(id, categoryData));
      toast.success("Category Updated successfully");
      navigate("/admin/category");
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (category) {
      setIsResetting(true);
      setTimeout(() => {
        setFormData({
          name: category.name || "",
          description: category.description || "",
          seoTitle: category.seoTitle || "",
          seoDescription: category.seoDescription || "",
          isVisible: Boolean(category.isVisible),
          isHomePageVisible: Boolean(category.isHomePageVisible),
          isSpecial: Boolean(category.isSpecial),
          newArrivals: Boolean(category.newArrivals),
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
        setValidationErrors({});
        setIsResetting(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-8 flex flex-col pb-28">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold flex-grow text-left">Edit Category</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-black-700 bg-green-100 hover:bg-blue-200 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
        >
          ← Back
        </button>
      </div>

      {isFetching ? (
        <div className="flex items-center space-x-2 justify-center mt-12">
          <CircularProgress size={28} />
          <p className="text-lg">Loading category data...</p>
        </div>
      ) : (
        <>
          <fieldset disabled={isResetting} className={`${isResetting ? "opacity-50" : ""}`}>
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl w-full mb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 flex flex-col items-center">
                  {previewImage && (
                    <div className="relative w-48 h-48 mb-6 shadow-md rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={previewImage}
                        alt="Category"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="block w-full max-w-xs text-sm"
                    aria-label="Upload category image"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="name">
                    Category Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${
                      validationErrors.name ? "border-red-600" : "border-gray-300"
                    }`}
                    aria-invalid={!!validationErrors.name}
                    aria-describedby="name-error"
                  />
                  {validationErrors.name && (
                    <p id="name-error" className="text-red-600 text-sm mt-1">
                      {validationErrors.name}
                    </p>
                  )}

                  <label className="block mt-4 font-semibold mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="seoTitle">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />

                  <label className="block mt-4 font-semibold mb-1" htmlFor="seoDescription">
                    SEO Description
                  </label>
                  <textarea
                    name="seoDescription"
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="discountPercentage">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    id="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${
                      validationErrors.discountPercentage ? "border-red-600" : "border-gray-300"
                    }`}
                    min={0}
                    max={100}
                  />
                  {validationErrors.discountPercentage && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.discountPercentage}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="parentCategory">
                    Parent Category
                  </label>
                  <input
                    type="text"
                    name="parentCategory"
                    id="parentCategory"
                    value={formData.parentCategory === "" ? "Self Parent" : formData.parentCategory}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="tags">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="status">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-4 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 p-4 border rounded-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {Object.keys(FEATURE_TOGGLE_LABELS).map((key) => (
                  <label
                    key={key}
                    className="flex items-center cursor-pointer select-none"
                    htmlFor={key}
                  >
                    <input
                      type="checkbox"
                      name={key}
                      id={key}
                      checked={formData[key]}
                      onChange={handleChange}
                      className="mr-2 cursor-pointer"
                      aria-checked={formData[key]}
                    />
                    {FEATURE_TOGGLE_LABELS[key]}
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                  disabled={isSubmitting || isResetting}
                >
                  {isResetting ? (
                    <>
                      <CircularProgress size={18} />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    "Reset"
                  )}
                </button>
              </div>
            </div>
          </fieldset>

          <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-lg flex justify-center z-50">
            {error && <p className="text-red-600 text-sm mr-4">{error}</p>}
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={isSubmitting || isResetting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} className="text-white" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditCategory;
