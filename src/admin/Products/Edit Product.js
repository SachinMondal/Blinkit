import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductById,
  updateProduct,
} from "../../redux/state/product/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.product);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        image: [],
        imagePreviews: product.imageUrls || [],
      });
      setInitialFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" && isNaN(value)) return;
    if (name === "isArchive") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (index, field, value) => {
    const updatedDetails = formData.details.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : { ...detail }
    );

    setFormData((prev) => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  const handleVariantChange = (index, key, value) => {
    if (["price", "discount", "qty"].includes(key) && isNaN(value)) return;

    setFormData((prev) => {
      const updatedVariants = prev.variants.map((v) => ({ ...v }));

      if (key === "image") {
        const file = value.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            updatedVariants[index].imagePreview = reader.result;
            updatedVariants[index].image = file;
            setFormData({ ...prev, variants: updatedVariants });
          };
          reader.readAsDataURL(file);
        }
        return prev;
      }

      if (key === "customUnit") {
        updatedVariants[index].customUnit = value;
        updatedVariants[index].unit = "other";
      } else {
        updatedVariants[index][key] = value;

        if (key === "unit") {
          if (value === "other") {
            if (!updatedVariants[index].customUnit) {
              updatedVariants[index].customUnit = "";
            }
          } else {
            delete updatedVariants[index].customUnit;
          }
        }
      }

      return { ...prev, variants: updatedVariants };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { price: "", discount: "", qty: "", unit: "" },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let updatedFields = {};
      Object.keys(formData).forEach((key) => {
        if (JSON.stringify(formData[key]) !== JSON.stringify(product[key])) {
          updatedFields[key] = formData[key];
        }
      });

      if (
        updatedFields.category &&
        typeof updatedFields.category === "object"
      ) {
        updatedFields.category = updatedFields.category._id;
      }
      if (updatedFields.details) {
        updatedFields.details = JSON.stringify(updatedFields.details);
      }
      if (formData.variants) {
        const updatedVariants = formData.variants.map((variant) => ({
          ...variant,
          unit:
            variant.unit === "other" ? variant.customUnit || "" : variant.unit,
        }));
        updatedFields.variants = JSON.stringify(updatedVariants);
      }

      const productData = new FormData();
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (key === "image" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              productData.append("images", file);
            }
          });
        } else {
          productData.append(key, value);
        }
      });

      const res = await dispatch(updateProduct(id, productData));
      if (res === true) {
        toast.success("Product Updated Successfully");
        navigate("/admin/products");
      } else {
        toast.error("Failed to update Product");
        if (initialFormData) setFormData(initialFormData);
      }
    } catch (error) {
      toast.error("Failed to update Product");
      if (initialFormData) setFormData(initialFormData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { key: "", value: "" }],
    }));
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = formData.details.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, details: updatedDetails }));
  };

  if (!formData)
    return (
      <p className="text-center text-gray-500">Loading product details...</p>
    );
  const handleReset = () => {
    if (!product) return;

    setIsResetting(true);

    setTimeout(() => {
      setFormData({
        ...product,
        images: [], // reset file inputs
        imagePreviews: product.imageUrls || product.images || [],
      });
      setIsResetting(false);
      toast.success("Form has been reset to original product details.");
    }, 100);
  };

  return (
    <div
      className="w-full min-h-screen p-6 bg-gray-100"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <input
              name="category"
              value={formData.category.name}
              disabled
              className="border p-3 rounded w-full bg-gray-200"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Product Images</label>
            <div className="flex flex-wrap gap-4">
              {formData?.images?.length > 0 ? (
                formData?.images?.map((preview, index) => (
                  <div key={index} className="relative">
                    <LazyImage
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-32 h-32 object-cover rounded shadow"
                    />
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No Images</span>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Product Description
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-green-300"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
          </div>

          {/* Veg/Non-Veg Selection */}
          <div>
            <label className="block font-semibold mb-1">Veg/Non-Veg</label>
            <select
              name="vegNonVeg"
              value={formData.vegNonVeg}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-green-300"
            >
              <option value="">Select</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm">Archive*</label>
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
          {/* Packer Details, Brand, Variant Size */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Packer Details</label>
              <input
                type="text"
                name="packerDetails"
                value={formData.packerDetails}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Variant Size</label>
              <input
                type="text"
                name="variantSize"
                value={formData.variantSize}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
          </div>

          {/* Return Policy, Manufacturer, Marketer */}
          <div>
            <label className="block font-semibold mb-1">Return Policy</label>
            <textarea
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-green-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">
                Manufacturer Address
              </label>
              <textarea
                name="manufacturerAddress"
                value={formData.manufacturerAddress}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Marketer Address
              </label>
              <textarea
                name="marketerAddress"
                value={formData.marketerAddress}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
          </div>

          {/* Country of Origin */}
          <div>
            <label className="block font-semibold mb-1">
              Country of Origin
            </label>
            <input
              type="text"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-green-300"
            />
          </div>

          {/* Customer Care, Seller */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Customer Care</label>
              <input
                type="text"
                name="customerCare"
                value={formData.customerCare}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Seller</label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:ring focus:ring-green-300"
              />
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <label className="block font-semibold mb-1">Disclaimer</label>
            <textarea
              name="disclaimer"
              value={formData.disclaimer}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-green-300"
            />
          </div>

          {/* Product Variants */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Variants
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border border-gray-300 rounded-lg shadow-sm text-sm">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="p-3">Price</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <AnimatePresence>
                    {formData.variants.map((variant, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                          transition: { duration: 0.2 },
                        }}
                        layout
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            className="border p-2 rounded w-full focus:ring focus:ring-green-300"
                            placeholder="₹ Price"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.discount}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "discount",
                                e.target.value
                              )
                            }
                            className="border p-2 rounded w-full focus:ring focus:ring-green-300"
                            placeholder="₹ Discount"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.qty}
                            onChange={(e) =>
                              handleVariantChange(index, "qty", e.target.value)
                            }
                            className="border p-2 rounded w-full focus:ring focus:ring-green-300"
                            placeholder="Qty"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={variant.unit || "g"}
                            onChange={(e) =>
                              handleVariantChange(index, "unit", e.target.value)
                            }
                            className="border p-2 rounded w-full focus:ring focus:ring-green-300"
                          >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="unit">unit</option>
                            <option value="other">other</option>
                          </select>
                          {variant.unit === "other" && (
                            <input
                              type="text"
                              value={variant.customUnit || ""}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "customUnit",
                                  e.target.value
                                )
                              }
                              className="border mt-2 p-2 rounded w-full text-sm focus:ring focus:ring-green-300"
                              placeholder="Custom Unit"
                            />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addVariant}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-sm"
            >
              + Add Variant
            </motion.button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Additional Details
            </h2>

            <AnimatePresence initial={false}>
              {formData.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  layout
                  className="flex flex-col md:flex-row md:items-center gap-3 bg-white border border-gray-300 rounded-lg p-4 shadow-sm mb-2"
                >
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Ingredients"
                      value={detail.key}
                      onChange={(e) =>
                        handleDetailsChange(index, "key", e.target.value)
                      }
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Rice, Wheat"
                      value={detail.value}
                      onChange={(e) =>
                        handleDetailsChange(index, "value", e.target.value)
                      }
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                  <div className="flex justify-end md:justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded mt-1 md:mt-6"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleAddDetail}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                + Add More Details
              </motion.button>
            </div>
            <div className="mt-6 flex justify-end space-x-4 mb-10">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                disabled={isSaving || isResetting}
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

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-xl flex justify-center z-50">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSaving ? (
                <CircularProgress size={24} className="text-white" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
