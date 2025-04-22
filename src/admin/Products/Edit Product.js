import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductById,
  updateProduct,
} from "../../redux/state/product/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.product);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" && isNaN(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (index, field, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index][field] = value;
    setFormData((prev) => ({ ...prev, details: updatedDetails }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagePreview: reader.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
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
          unit: variant.unit === "other" ? variant.customUnit || "" : variant.unit,
        }));
        updatedFields.variants = JSON.stringify(updatedVariants);
      }

      const productData = new FormData();
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          productData.append("image", value);
        } else {
          productData.append(key, value);
        }
      });
      await dispatch(updateProduct(id, productData));

      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
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

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Category */}
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
            <label className="block font-semibold mb-2">Product Image</label>
            <div className="flex items-center gap-4">
              {formData.imagePreview || formData.image ? (
                <LazyImage
                  src={formData.imagePreview || formData.image}
                  alt="Product"
                  className="w-32 h-32 object-cover rounded shadow"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded w-full"
              />
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
              className="border p-3 rounded w-full focus:ring focus:ring-blue-300"
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
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="border p-3 rounded w-full"
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
              className="border p-3 rounded w-full"
            >
              <option value="">Select</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
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
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Variant Size</label>
              <input
                type="text"
                name="variantSize"
                value={formData.variantSize}
                onChange={handleChange}
                className="border p-3 rounded w-full"
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
              className="border p-3 rounded w-full"
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
                className="border p-3 rounded w-full"
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
                className="border p-3 rounded w-full"
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
              className="border p-3 rounded w-full"
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
                className="border p-3 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Seller</label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                className="border p-3 rounded w-full"
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
              className="border p-3 rounded w-full"
            />
          </div>

          {/* Product Variants */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-3">Variants</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-3 border">Price</th>
                    <th className="p-3 border">Discount Price</th>
                    <th className="p-3 border">Quantity</th>
                    <th className="p-3 border">Unit</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {formData.variants.map((variant, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="p-3 border">
                        <input
                          type="number"
                          name="price"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                        />
                      </td>
                      <td className="p-3 border">
                        <input
                          type="number"
                          name="discount"
                          value={variant.discount}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "discount",
                              e.target.value
                            )
                          }
                          className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                        />
                      </td>
                      <td className="p-3 border">
                        <input
                          type="number"
                          name="qty"
                          value={variant.qty}
                          onChange={(e) =>
                            handleVariantChange(index, "qty", e.target.value)
                          }
                          className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                        />
                      </td>
                      <td className="p-3 border">
                        <select
                          name="unit"
                          value={variant.unit || "g"}
                          onChange={(e) =>
                            handleVariantChange(index, "unit", e.target.value)
                          }
                          className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="unit">unit</option>
                          <option value="other">other</option>
                        </select>

                        {variant.unit === "other" && (
                          <input
                            type="text"
                            name="customUnit"
                            value={variant.customUnit || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "customUnit",
                                e.target.value
                              )
                            }
                            className="border p-2 rounded w-24 text-sm mt-2"
                            placeholder="Enter Unit"
                          />
                        )}
                      </td>

                      <td className="p-3 border text-center">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add Variant
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Additional Details</h2>
            {formData.details.map((detail, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={detail.key}
                  onChange={(e) =>
                    handleDetailsChange(index, "key", e.target.value)
                  }
                  className="border p-3 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={detail.value}
                  onChange={(e) =>
                    handleDetailsChange(index, "value", e.target.value)
                  }
                  className="border p-3 rounded w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDetail}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              Add More Details
            </button>
          </div>
          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg text-white transition ${
                isSaving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
