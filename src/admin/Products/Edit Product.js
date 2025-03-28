import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, updateProduct } from "../../redux/state/product/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, } = useSelector((state) => state.product);
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
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagePreview: reader.result, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVariantChange = (index, key, value) => {
    if (key === "price" || key === "discountPrice" || key === "qty") {
      if (isNaN(value)) return;
    }
  
    const updatedVariants = [...formData.variants];
  
    if (key === "image") {
      const file = value.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedVariants[index].imagePreview = reader.result;
          updatedVariants[index].imageFile = file;
          setFormData({ ...formData, variants: updatedVariants });
        };
        reader.readAsDataURL(file);
      }
      return;
    }
  
    updatedVariants[index][key] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { price: "", discountPrice: "", qty: "", unit: "" }],
    });
  };
  
  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
  
    try {
      let updatedFields = {};
  
      // Compare formData with product and store only changed fields
      Object.keys(formData).forEach((key) => {
        if (JSON.stringify(formData[key]) !== JSON.stringify(product[key])) {
          updatedFields[key] = formData[key];
        }
      });
  
      // If no changes detected, prevent unnecessary API call
      if (Object.keys(updatedFields).length === 0) {
        setIsSaving(false);
        alert("No changes detected.");
        return;
      }
  
      // Preserve unchanged fields to prevent data loss
      updatedFields = { ...product, ...updatedFields };
  
      // 🔥 Fix: Only pass category ID to the backend
      if (updatedFields.category && typeof updatedFields.category === "object") {
        updatedFields.category = updatedFields.category._id; // Ensure only ID is sent
      }
  
      // Handle Image separately
      if (formData.imageFile) {
        updatedFields.image = formData.imageFile;
      }
  
      // Ensure variants are retained properly
      if (formData.variants) {
        updatedFields.quantities = JSON.stringify(formData.variants);
      }
  
      console.log("Final Payload:", updatedFields);
  
      // Convert to FormData for API call
      const productData = new FormData();
      Object.entries(updatedFields).forEach(([key, value]) => {
        productData.append(key, value);
      });
  
      await dispatch(updateProduct(id, productData));
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  
  
  if (!formData) return <p className="text-center text-gray-500">Loading product details...</p>;
  

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
                <tr key={index} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3 border">
                    <input
                      type="number"
                      name="price"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                      className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3 border">
                    <input
                      type="number"
                      name="discountPrice"
                      value={variant.discountPrice}
                      onChange={(e) => handleVariantChange(index, "discountPrice", e.target.value)}
                      className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3 border">
                    <input
                      type="number"
                      name="qty"
                      value={variant.qty}
                      onChange={(e) => handleVariantChange(index, "qty", e.target.value)}
                      className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3 border">
                    <select
                      name="unit"
                      value={variant.unit||"g"}
                      onChange={(e) => handleVariantChange(index, "unit", e.target.value)}
                      className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="unit">unit</option>
                    </select>
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
