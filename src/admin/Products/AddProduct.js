import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategories } from "../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
const steps = [
  "Add Product",
  "Basic Details",
  "Additional Details",
  "Add Variant",
  "Review & Submit",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const categories = useSelector((state) => state.category.categories || []);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState({});

  useEffect(() => {
    setIsNextDisabled(Object.keys(error).length > 0);
  }, [error]);
  const [formData, setFormData] = useState({
    category: "",
    categoryName: "",
    images: [],
    imagePreviews: [],
    productName: "",
    productDescription: "",
    weight: "",
    stock: "",
    quantities: [{ qty: "", price: "", discountPrice: "", unit: "g" }],
    vegNonVeg: "",
    size: "",
    packerDetails: "",
    brand: "",
    variantSize: "",
    returnPolicy: "",
    manufacturerAddress: "",
    marketerAddress: "",
    countryOfOrigin: "",
    customerCare: "",
    seller: "",
    disclaimer: "",
    details: [{ key: "", value: "" }],
    isArchive: false,
  });

  useEffect(() => {
    return () => {
      formData.imagePreviews?.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const numericFields = ["weight", "price", "discountPrice", "qty", "stock"];

    // Handle numeric validations
    if (numericFields.includes(name)) {
      if (value === "" || !/^\d+(\.\d{0,2})?$/.test(value)) {
        setError((prev) => ({ ...prev, [name]: "Enter a valid number" }));
      } else {
        setError((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (name === "isArchive") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
      return;
    }

    // Handle category selection
    if (name === "category") {
      const selectedCategory = categories.find(
        (cat) => cat._id.toString() === value
      );
      setFormData((prev) => ({
        ...prev,
        category: selectedCategory?._id || "",
        categoryName: selectedCategory?.name || "",
      }));
      return;
    }

    if (type === "file" && name === "images") {
      const newFiles = Array.from(files);
      const existingCount = formData.images.length;
      const total = existingCount + newFiles.length;

      if (total > 3) {
        toast("You can Upload at most 3 images only", { duration: 6000 });
        return;
      }

      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews],
      }));
    }

    // Default case
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQtyChange = (e, index, field = null) => {
    const { name, value } = e.target;
    const updatedQuantities = [...formData.quantities];

    if (field === "customUnit") {
      updatedQuantities[index].customUnit = value;
      updatedQuantities[index].unit = "custom";
    } else {
      updatedQuantities[index][name] = value;

      if (name === "unit") {
        if (value === "custom") {
          updatedQuantities[index].unit = "custom";
          if (!updatedQuantities[index].customUnit) {
            updatedQuantities[index].customUnit = "";
          }
        } else {
          delete updatedQuantities[index].customUnit;
        }
      }
    }
    setFormData({ ...formData, quantities: updatedQuantities });
  };

  const handleDetailChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.details];
    updatedDetails[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { key: "", value: "" }],
    });
  };

  const removeDetail = (index) => {
    const updatedDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: updatedDetails });
  };

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        ...location.state,
        image: location.state.image || prev.image,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const addQty = () => {
    setFormData({
      ...formData,
      quantities: [
        ...formData.quantities,
        { qty: "", unit: "g", price: "", discountPrice: "" },
      ],
    });
  };

  const removeQty = (index) => {
    const updatedQuantities = formData.quantities.filter((_, i) => i !== index);
    setFormData({ ...formData, quantities: updatedQuantities });
  };

  const handleNext = () => {
    if (validateFields(step)) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    const sanitizedFormData = { ...formData };
    navigate("/admin/products/summary", { state: sanitizedFormData });
  };

  const validateFields = useCallback(
    (step) => {
      let newErrors = {};

      if (step === 1) {
        if (!formData.categoryName)
          newErrors.categoryName = "Category Name is required";
        if (!formData.productName.trim())
          newErrors.productName = "Product Name is required";
        if (!formData.productDescription.trim())
          newErrors.productDescription = "Description is required";
        if (!formData.images) newErrors.images = "Product Image is required";
      } else if (step === 2) {
        if (!formData.weight) newErrors.weight = "Weight is required";
        if (!formData.stock) newErrors.stock = "Stock is required";
        if (formData.quantities.length === 0)
          newErrors.quantities = "Variants are required";
        if (!formData.vegNonVeg)
          newErrors.vegNonVeg = "Veg/Non-Veg is required";
      } else if (step === 4) {
        if (!formData.customerCare)
          newErrors.customerCare = "Customer Care is required";
        if (!formData.returnPolicy)
          newErrors.returnPolicy = "Return Policy is required";
      }

      setError(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  useEffect(() => {
    validateFields(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, step]);
  const removeImage = (urlToRemove) => {
    const updatedPreviews = formData.imagePreviews.filter(
      (preview) => preview.url !== urlToRemove
    );
    const updatedImages = formData.imagePreviews
      .filter((preview) => preview.url !== urlToRemove)
      .map((preview) => preview.file);

    // Revoke the URL
    URL.revokeObjectURL(urlToRemove);

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
      imagePreviews: updatedPreviews,
    }));
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-12 py-10">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 w-full relative">
        {steps.map((label, index) => {
          const isActive = step === index + 1;
          const isCompleted = step > index + 1;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative"
            >
              <div
                className={`z-20 flex items-center justify-center rounded-full text-white font-bold
          ${isCompleted || isActive ? "bg-green-500" : "bg-gray-400"}
          w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base`}
              >
                {index + 1}
              </div>

              <p className="text-[0.5rem] sm:text-xs mt-2 text-center">
                {label}
              </p>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.15 * index }}
                  className={`absolute right-0 transform h-1 z-10 -translate-x-4 left-1/2 origin-left translate-y-5
              ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                  style={{
                    width: "calc(100%)",
                    maxWidth: "300px",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6">
        {steps[step - 1]}
      </h1>

      <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Category Selector */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Category*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm">
                Product Images*
              </label>
              <div className="relative">
                <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded cursor-pointer w-max text-sm hover:bg-green-700 transition">
                  Choose Images
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleChange}
                    multiple
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  You can upload up to 3 images. 
                  <br />
                  Select the First Image Properly as it will be the Cover Image
                </p>
              </div>

              {/* Preview Images */}
              {formData.imagePreviews?.length > 0 && (
                <div className="flex gap-4 mt-3 flex-wrap">
                  {formData.imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-20 h-20 group">
                      <LazyImage
                        src={preview.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(preview.url)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Product Name*
              </label>
              <input
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., Organic Honey"
              />
            </div>

            {/* Product Description */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold mb-1 text-sm">
                Product Description*
              </label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="border p-2 rounded w-full h-24 text-sm resize-none"
                placeholder="Brief description about the product..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Weight */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Weight*
              </label>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., 500"
              />
              {error.weight && (
                <p className="text-red-500 text-xs mt-1">{error.weight}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block font-semibold mb-1 text-sm">Stock</label>
              <input
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., 100"
              />
            </div>

            {/* Variants */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold mb-1 text-sm">
                Variants (Net Qty, Unit, Price, Discount Price)*
              </label>

              {formData?.quantities?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 items-center"
                >
                  {/* Qty */}
                  <input
                    type="number"
                    name="qty"
                    value={item.qty || ""}
                    onChange={(e) => handleQtyChange(e, index)}
                    className="border p-2 rounded w-full sm:w-24 text-sm"
                    placeholder="Qty"
                  />

                  {/* Unit */}
                  <select
                    name="unit"
                    value={item.unit || "g"}
                    onChange={(e) => handleQtyChange(e, index)}
                    className="border p-2 rounded w-full sm:w-20 text-sm"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="unit">unit</option>
                    <option value="custom">Other</option>
                  </select>

                  {/* Custom Unit */}
                  {item.unit === "custom" && (
                    <input
                      type="text"
                      name="customUnit"
                      value={item.customUnit || ""}
                      onChange={(e) => handleQtyChange(e, index, "customUnit")}
                      className="border p-2 rounded w-full sm:w-24 text-sm"
                      placeholder="Enter Unit"
                    />
                  )}

                  {/* Price */}
                  <input
                    type="number"
                    name="price"
                    value={item.price || ""}
                    onChange={(e) => handleQtyChange(e, index)}
                    className="border p-2 rounded w-full sm:w-24 text-sm"
                    placeholder="Price"
                  />

                  {/* Discount */}
                  <input
                    type="number"
                    name="discountPrice"
                    value={item.discountPrice || ""}
                    onChange={(e) => handleQtyChange(e, index)}
                    className="border p-2 rounded w-full sm:w-28 text-sm"
                    placeholder="Discount (%)"
                  />

                  {/* Remove Variant Button */}
                  <button
                    type="button"
                    onClick={() => removeQty(index)}
                    className="text-red-500 text-xl sm:ml-1 hover:scale-110 transition-transform"
                    title="Remove Variant"
                  >
                    ❌
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={addQty}
                className="bg-green-500 text-white px-4 py-1 rounded text-sm mt-3 hover:bg-green-600 transition"
              >
                + Add More
              </button>
            </div>

            {/* Veg/Non-Veg */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Veg/Non-Veg*
              </label>
              <select
                name="vegNonVeg"
                value={formData.vegNonVeg || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm">
                Archive*
              </label>
              <select
                name="isArchive"
                value={formData.isArchive === true ? "true" : "false"}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Brand */}
            <div>
              <label className="block font-semibold mb-1 text-sm">Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., Nestle"
              />
            </div>

            {/* Product Details: Dynamic Key-Value Pairs */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold mb-1 text-sm">
                Product Details
              </label>

              {formData.details?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap sm:flex-nowrap gap-2 items-center mt-2"
                >
                  {/* Key */}
                  <input
                    type="text"
                    name="key"
                    value={item.key || ""}
                    onChange={(e) => handleDetailChange(e, index)}
                    className="border p-2 rounded w-full sm:w-1/2 text-sm"
                    placeholder="Enter Key (e.g., Ingredients)"
                  />

                  {/* Value */}
                  <input
                    type="text"
                    name="value"
                    value={item.value || ""}
                    onChange={(e) => handleDetailChange(e, index)}
                    className="border p-2 rounded w-full sm:w-1/2 text-sm"
                    placeholder="Enter Value (e.g., Wheat, Salt)"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="text-red-500 text-xl hover:scale-110 transition-transform"
                    title="Remove"
                  >
                    ❌
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={addDetail}
                className="bg-green-500 text-white px-4 py-1 rounded text-sm mt-3 hover:bg-green-600 transition"
              >
                + Add More
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Size / Free Size */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Size / Free Size
              </label>
              <input
                name="variantSize"
                value={formData.variantSize}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., Medium, Large, Free Size"
              />
            </div>

            {/* Return Policy */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Return Policy*
              </label>
              <textarea
                name="returnPolicy"
                value={formData.returnPolicy}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                rows="3"
                placeholder="e.g., Return within 7 days of delivery"
              ></textarea>
            </div>

            {/* Manufacturer Address */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Manufacturer Address
              </label>
              <textarea
                name="manufacturerAddress"
                value={formData.manufacturerAddress}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                rows="2"
                placeholder="e.g., ABC Industries, Industrial Area, Mumbai"
              ></textarea>
            </div>

            {/* Marketer Address */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Marketer Address
              </label>
              <textarea
                name="marketerAddress"
                value={formData.marketerAddress}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                rows="2"
                placeholder="e.g., XYZ Pvt. Ltd., Delhi"
              ></textarea>
            </div>

            {/* Country of Origin */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Country of Origin
              </label>
              <input
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., India"
              />
            </div>

            {/* Customer Care Details */}
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Customer Care Details*
              </label>
              <textarea
                name="customerCare"
                value={formData.customerCare}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                rows="2"
                placeholder="e.g., support@domain.com, +91-XXXXXXXXXX"
              ></textarea>
            </div>

            {/* Seller */}
            <div>
              <label className="block font-semibold mb-1 text-sm">Seller</label>
              <input
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="e.g., ABC Store"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Packer Details
              </label>
              <textarea
                name="packerDetails"
                value={formData.packerDetails}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                rows="2"
                placeholder="e.g., ABC Industries, Industrial Area, Mumbai"
              ></textarea>
            </div>

            {/* Disclaimer */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold mb-1 text-sm">
                Disclaimer
              </label>
              <textarea
                name="disclaimer"
                value={formData.disclaimer}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                rows="3"
                placeholder="e.g., Product color may slightly vary due to photographic lighting"
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        {/* Back or Cancel Button */}
        <div>
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-gray-600 w-full sm:w-auto"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/admin")}
              className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-gray-600 w-full sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Error Messages */}
        {error && (
          <div className="flex flex-col gap-1">
            {Object.values(error).map((errMsg, index) => (
              <p key={index} className="text-red-500 text-sm">
                {errMsg}
              </p>
            ))}
          </div>
        )}

        {/* Next or Submit Button */}
        <div>
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`px-6 py-2 rounded-lg text-white w-full sm:w-auto ${
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
              className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-green-600 w-full sm:w-auto"
            >
              Review & Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
