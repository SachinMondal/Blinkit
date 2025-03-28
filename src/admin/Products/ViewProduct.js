import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../redux/state/product/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get product data from Redux state
  const { product, loading } = useSelector((state) => state.product);

  // Fetch product when component mounts
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-xl text-gray-600">Loading product details...</p>
      ) : (
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-4xl mx-auto">
          {/* Product Image */}
          <div className="flex justify-center mb-6">
            <LazyImage
              src={product?.image}
              alt={product?.name}
              className="w-64 h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Product Info Table */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{product?.name}</h2>

          <table className="w-full border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Category</td>
                <td className="p-3">{product?.category?.name || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Type</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product?.type === "veg"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product?.type || "N/A"}
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Brand</td>
                <td className="p-3">{product?.brand || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Shelf Life</td>
                <td className="p-3">{product?.shelfLife || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Weight</td>
                <td className="p-3">{product?.weight || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Created At</td>
                <td className="p-3">
                  {product?.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-gray-100">Last Updated</td>
                <td className="p-3">
                  {product?.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Variants Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Variants</h3>
            {product?.variants?.length > 0 ? (
              <table className="w-full border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Discount Price</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{variant.qty}</td>
                      <td className="p-3">{variant.unit}</td>
                      <td className="p-3">₹{variant.price}</td>
                      <td className="p-3 text-green-600">₹{variant.discountPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No variants available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
