import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/state/product/Action";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = location.state || {};

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(
        typeof formData.image === "string"
          ? formData.image
          : URL.createObjectURL(formData.image)
      );
    }
  }, [formData.image]);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("category", formData.category);
      productData.append("categoryName", formData.categoryName);
      productData.append("image", formData.image);
      productData.append("name", formData.productName);
      productData.append("description", formData.productDescription);
      productData.append("weight", formData.weight);
      productData.append("shelfLife", formData.shelfLife);
      productData.append("type", formData.vegNonVeg);
      productData.append("size", formData.size);
      productData.append("brand", formData.brand);
      productData.append("price", formData.price);
      productData.append("packerDetails", formData.packerDetails);

      // 🔥 Convert quantities array to a JSON string
      productData.append("quantities", JSON.stringify(formData.quantities));

      await dispatch(addProduct(productData));
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Review Your Product
      </h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        {imagePreview && (
          <div className="mb-6 flex justify-center">
            <LazyImage
              src={imagePreview}
              alt="Product Preview"
              className="w-48 h-48 object-cover rounded-md shadow-md border"
            />
          </div>
        )}

        {/* Product Details Table */}
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <tbody>
            <tr className="bg-gray-100">
              <td className="p-3 font-semibold border border-gray-300">
                Category
              </td>
              <td className="p-3 border border-gray-300">
                {formData.categoryName}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-semibold border border-gray-300">
                Product Name
              </td>
              <td className="p-3 border border-gray-300">
                {formData.productName}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-3 font-semibold border border-gray-300">
                Price
              </td>
              <td className="p-3 border border-gray-300">₹{formData.price}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold border border-gray-300">MRP</td>
              <td className="p-3 border border-gray-300">₹{formData.mrp}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-3 font-semibold border border-gray-300">Type</td>
              <td className="p-3 border border-gray-300">
                {formData.vegNonVeg}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-semibold border border-gray-300">
                Brand
              </td>
              <td className="p-3 border border-gray-300">{formData.brand}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-3 font-semibold border border-gray-300">Size</td>
              <td className="p-3 border border-gray-300">
                {formData.variantSize}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-semibold border border-gray-300">
                Shelf Life
              </td>
              <td className="p-3 border border-gray-300">
                {formData.shelfLife}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-3 font-semibold border border-gray-300">
                Packer Details
              </td>
              <td className="p-3 border border-gray-300">
                {formData.packerDetails}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Quantities Table */}
        {formData.quantities && formData.quantities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Quantity & Price Details
            </h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border border-gray-300">Quantity</th>
                  <th className="p-3 border border-gray-300">Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.quantities.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="p-3 border border-gray-300">{item.qty}</td>
                    <td className="p-3 border border-gray-300">
                      ₹{item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() =>
              navigate("/admin/products/addProduct", { state: formData })
            }
          >
            Edit
          </button>

          <button
            className={`bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center w-36 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
