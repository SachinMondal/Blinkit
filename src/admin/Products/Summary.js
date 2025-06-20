import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/state/product/Action";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import toast from "react-hot-toast";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = location.state || {};
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.images && Array.isArray(formData.images)) {
      const previews = formData.images.map((img) =>
        typeof img === "string" ? img : URL.createObjectURL(img)
      );
      setImagePreviews(previews);
    } else if (formData.image) {
      const preview =
        typeof formData.image === "string"
          ? formData.image
          : URL.createObjectURL(formData.image);
      setImagePreviews([preview]);
    }
  }, [formData.images, formData.image]);

  const saveSettings = (settings) => {
  return new Promise(async (resolve, reject) => {
    try {
      await dispatch(addProduct(settings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};


const handleSubmit = () => {
  setLoading(true);

  // 1. Replace custom units in quantity
  const updatedQuantities = formData.quantities.map((item) => ({
    ...item,
    unit: item.unit === "custom" ? item.customUnit : item.unit,
  }));

  // 2. Initialize FormData for image + text
  const formDataToSend = new FormData();

  // 3. Append normal fields
  Object.entries(formData).forEach(([key, value]) => {
    if (key === "images") {
      // Append images properly
      value.forEach((file) => {
        formDataToSend.append("imagePreviews[]", file);
      });
    } else if (key === "quantities") {
      formDataToSend.append("quantities", JSON.stringify(updatedQuantities));
    } else if (key === "details") {
      formDataToSend.append("details", JSON.stringify(value));
    } else if (typeof value === "boolean") {
      formDataToSend.append(key, value.toString()); // Convert booleans to string
    } else {
      formDataToSend.append(key, value ?? ""); // fallback for null/undefined
    }
  });

  // 4. Show loading toast while saving
  toast.promise(
    saveSettings(formDataToSend), // Must handle FormData in saveSettings()
    {
      loading: "Saving...",
      success: <b>Product saved!</b>,
      error: <b>Could not save.</b>,
    }
  )
    .then(() => {
      setLoading(false);
      navigate("/admin/products");
    })
    .catch(() => {
      setLoading(false);
    });
};


  // Keys to exclude from main table
  const excludedKeys = [
    "quantities",
    "image",
    "images",
    "imageUrl",
    "details",
    "imagePreviews",
    "size",
  ];
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-10 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Review Your Product
        </h1>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {imagePreviews.map((src, idx) => (
              <LazyImage
                key={idx}
                src={src}
                alt={`Preview ${idx + 1}`}
                className="w-44 h-44 rounded-lg object-cover shadow-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        )}

        {/* Main Form Data Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="w-full min-w-[600px] border-collapse text-gray-800">
            <tbody>
              {Object.entries(formData).map(
                ([key, value], index) =>
                  !excludedKeys.includes(key) && (
                    <tr
                      key={key}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-green-50 transition-colors`}
                    >
                      <td className="p-4 font-semibold border border-gray-300 capitalize whitespace-nowrap">
                        {key.replace(/([A-Z])/g, " $1")}
                      </td>
                      <td className="p-4 border border-gray-300 break-words max-w-xs">
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : value}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>

        {/* Product Details */}
        {Array.isArray(formData.details) && formData.details.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Product Details
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
              <table className="w-full min-w-[500px] border-collapse text-gray-800">
                <thead className="bg-green-100 text-green-900 font-semibold text-left">
                  <tr>
                    <th className="p-3 border border-gray-300">Key</th>
                    <th className="p-3 border border-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.details
                    .filter(
                      (item) =>
                        item.key.trim() &&
                        item.value.trim() &&
                        item.key.toLowerCase() !== "imagepreviews"
                    )
                    .map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="p-3 border border-gray-300 whitespace-nowrap">
                          {item.key}
                        </td>
                        <td className="p-3 border border-gray-300 break-words max-w-xs">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quantity & Price */}
        {Array.isArray(formData.quantities) &&
          formData.quantities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Quantity & Price Details
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                <table className="w-full min-w-[600px] border-collapse text-gray-800">
                  <thead className="bg-green-100 text-green-900 font-semibold text-left">
                    <tr>
                      <th className="p-3 border border-gray-300">Quantity</th>
                      <th className="p-3 border border-gray-300">Unit</th>
                      <th className="p-3 border border-gray-300">Price</th>
                      <th className="p-3 border border-gray-300">
                        Discounted Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.quantities.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="p-3 border border-gray-300 whitespace-nowrap">
                          {item.qty}
                        </td>
                        <td className="p-3 border border-gray-300 whitespace-nowrap">
                          {item.unit}
                        </td>
                        <td className="p-3 border border-gray-300 whitespace-nowrap">
                          ₹{item.price}
                        </td>
                        <td className="p-3 border border-gray-300 whitespace-nowrap">
                          ₹{item.discountPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <button
            onClick={() =>
              navigate("/admin/products/addProduct", { state: formData })
            }
            className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto transition"
          >
            Edit
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-3 rounded-xl text-white flex items-center justify-center w-full sm:w-auto transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            }`}
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
