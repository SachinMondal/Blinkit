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

  const updatedQuantities = formData.quantities.map((item) => {
    const price = parseFloat(item.price);
    const discountPrice = parseFloat(item.discountPrice);

    let discount = 0;
    if (!isNaN(price) && !isNaN(discountPrice) && price > 0 && discountPrice <= price) {
      discount = ((price - discountPrice) / price) * 100;
    }

    return {
      ...item,
      unit: item.unit === "custom" ? item.customUnit : item.unit,
      categoryDiscount: Math.max(discount, 0), // ensures no negative value
    };
  });

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (key === "images") {
      value.forEach((file) => {
        formDataToSend.append("imagePreviews[]", file);
      });
    } else if (key === "quantities") {
      formDataToSend.append("quantities", JSON.stringify(updatedQuantities));
    } else if (key === "details") {
      formDataToSend.append("details", JSON.stringify(value));
    } else if (typeof value === "boolean") {
      formDataToSend.append(key, value.toString());
    } else {
      formDataToSend.append(key, value ?? "");
    }
  });

  toast
    .promise(saveSettings(formDataToSend), {
      loading: "Saving...",
      success: <b>Product saved!</b>,
      error: <b>Could not save.</b>,
    })
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
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8 md:px-10 flex justify-center items-start">
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-10">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
        Review Your Product
      </h1>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {imagePreviews.map((src, idx) => (
            <LazyImage
              key={idx}
              src={src}
              alt={`Preview ${idx + 1}`}
              className="w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 object-cover rounded-lg border border-gray-200 shadow hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      {/* Main Form Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full min-w-[500px] text-sm sm:text-base text-gray-800">
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
                    <td className="p-3 font-medium border border-gray-300 capitalize whitespace-nowrap">
                      {key.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="p-3 border border-gray-300 break-words max-w-xs">
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
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
            Product Details
          </h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full min-w-[500px] text-sm sm:text-base text-gray-800">
              <thead className="bg-green-100 text-green-800 font-semibold">
                <tr>
                  <th className="p-3 border border-gray-300 text-left">Key</th>
                  <th className="p-3 border border-gray-300 text-left">Value</th>
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

      {/* Quantities and Pricing */}
      {Array.isArray(formData.quantities) && formData.quantities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
            Quantity & Price Details
          </h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full min-w-[500px] text-sm sm:text-base text-gray-800">
              <thead className="bg-green-100 text-green-800 font-semibold">
                <tr>
                  <th className="p-3 border border-gray-300 text-left">Quantity</th>
                  <th className="p-3 border border-gray-300 text-left">Unit</th>
                  <th className="p-3 border border-gray-300 text-left">Price</th>
                  <th className="p-3 border border-gray-300 text-left">
                    Discount %
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.quantities.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-3 border border-gray-300">{item.qty}</td>
                    <td className="p-3 border border-gray-300">{item.unit}</td>
                    <td className="p-3 border border-gray-300">₹{item.price}</td>
                    <td className="p-3 border border-gray-300">
                      {item.discountPrice}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-6">
        <button
          onClick={() =>
            navigate("/admin/products/addProduct", { state: formData })
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto transition"
        >
          Edit
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white flex items-center justify-center w-full sm:w-auto transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          }`}
        >
          {loading ? (
            <CircularProgress size={22} style={{ color: "white" }} />
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
