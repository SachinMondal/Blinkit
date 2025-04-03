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
  console.log("Form data from summary", formData);
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

    // ✅ Ensure custom unit replaces "custom" before submitting
    const updatedQuantities = formData.quantities.map((item) => ({
        ...item,
        unit: item.unit === "custom" ? item.customUnit : item.unit, // Replace "custom" with customUnit value
    }));

    const formattedData = {
        ...formData,
        quantities: JSON.stringify(updatedQuantities), 
        details: JSON.stringify(formData.details), 
    };

    await dispatch(addProduct(formattedData));
    navigate("/admin/products");
    setLoading(false);
};


  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-10 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Review Your Product
      </h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
        {imagePreview && (
          <div className="mb-6 flex justify-center">
            <LazyImage
              src={imagePreview}
              alt="Product Preview"
              className="w-48 h-48 object-cover rounded-md shadow-md border"
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg text-sm sm:text-base">
            <tbody>
              {Object.entries(formData).map(
                ([key, value], index) =>
                  key !== "quantities" &&
                  key !== "image" &&
                  key !== "imageUrl" &&
                  key !== "details" && (
                    <tr
                      key={key}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}
                    >
                      <td className="p-3 font-semibold border border-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
        {formData.details && formData.details.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-2">
              Product Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border border-gray-300">Key</th>
                    <th className="p-3 border border-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody>
                {Array.isArray(formData.details) &&
  formData.details
    .filter(
      (item) => item.key.trim() !== "" && item.value.trim() !== ""
    ) // Filter out empty details
    .map((item, index) => (
      <tr
        key={index}
        className={index % 2 === 0 ? "bg-gray-50 text-center" : ""}
      >
        <td className="p-3 border border-gray-300">{item.key}</td>
        <td className="p-3 border border-gray-300">{item.value}</td>
      </tr>
    ))}

                </tbody>
              </table>
            </div>
          </div>
        )}

{Array.isArray(formData.quantities) && formData.quantities.length > 0 && (
  <div className="mt-6">
    <h2 className="text-xl font-semibold text-gray-700 text-center mb-2">
      Quantity & Price Details
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border border-gray-300">Quantity</th>
            <th className="p-3 border border-gray-300">Unit</th>
            <th className="p-3 border border-gray-300">Price</th>
            <th className="p-3 border border-gray-300">Discounted Price</th>
          </tr>
        </thead>
        <tbody>
          {formData.quantities.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50 text-center" : ""}
            >
              <td className="p-3 border border-gray-300">{item.qty}</td>
              <td className="p-3 border border-gray-300">{item.unit}</td>
              <td className="p-3 border border-gray-300">₹{item.price}</td>
              <td className="p-3 border border-gray-300">₹{item.discountPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <button
            onClick={() =>
              navigate("/admin/products/addProduct", { state: formData })
            }
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto text-center hover:bg-blue-600 transition"
          >
            Edit
          </button>

          <button
            className={`bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full sm:w-auto $ {loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600 transition"}`}
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
