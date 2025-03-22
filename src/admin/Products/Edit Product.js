import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy product data (replace with API call)
  const [formData, setFormData] = useState({
    name: "Apple",
    category: "Fruits",
    price: "2.99",
    stock: "50",
    description: "Fresh and juicy apples from the farm.",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product:", formData);
    navigate("/admin/products"); // Redirect after update
  };

  return (
    <div className="w-full min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg">
        <div className="mb-4">
          <label className="block font-semibold">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Stock</label>
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full h-24"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
