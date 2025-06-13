import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../redux/state/product/Action";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);
  console.log(product);

  return (
    <div
      className="w-full min-h-screen px-4 md:px-6 py-6"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-green-900">
          Product Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded-md font-medium"
        >
          ← Back
        </button>
      </div>

    
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-10">
          {product?.images?.length > 0 ? (
            <div className="overflow-x-auto flex gap-4 sm:flex-wrap">
              {product.images.map((img, index) => (
                <LazyImage
                  key={index}
                  src={img}
                  alt={`${product.name} - ${index + 1}`}
                  className="w-52 h-52 rounded-md object-cover border border-green-300"
                />
              ))}
             
            </div>
          ) : (
            <p>No Image to Preview</p>
          )}

          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-green-200">
              <tbody>
                {[
                  ["Name",product?.name],
                  ["Category", product?.category?.name],
                  [
                    "Type",
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product?.type === "veg"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product?.type}
                    </span>,
                  ],
                  ["Brand", product?.brand],
                  ["Shelf Life", product?.shelfLife],
                  ["Weight", product?.weight],
                  ["Manufacturer", product?.manufacturerAddress?.address],
                  ["Marketer", product?.marketerAddress?.address],
                  ["Customer Care", product?.customerCare],
                  ["Seller", product?.seller],
                  ["Disclaimer", product?.disclaimer],
                  ["Archive", product?.isArchive ? "Yes" : "No"]
                ].map(([label, value], i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 border-green-200"
                  >
                    <td className="p-3 bg-green-100 font-medium w-1/3 text-green-900">
                      {label}
                    </td>
                    <td className="p-3">{value || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Variants */}
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Variants
            </h3>
            {product?.variants?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-green-200 text-sm text-center">
                  <thead className="bg-green-100 text-green-800">
                    <tr>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Category Discount</th>
                      <th className="p-3">Final Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v, i) => (
                      <tr key={i} className="border-t border-green-200">
                        <td className="p-3">{v.qty}</td>
                        <td className="p-3">{v.unit}</td>
                        <td className="p-3">₹{v.price}</td>
                        <td className="p-3 text-green-700">
                          ₹{v.discountPrice}
                        </td>
                        <td className="p-3 text-green-700">
                          ₹{v.categoryDiscount}
                        </td>
                        <td className="p-3 font-semibold">
                          ₹{v.price - (v.discountPrice + v.categoryDiscount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-green-700">No variants available.</p>
            )}
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Additional Details
            </h3>
            {product?.details?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-green-200 text-sm">
                  <thead className="bg-green-100 text-green-800">
                    <tr>
                      <th className="p-3 text-left">Key</th>
                      <th className="p-3 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.details.map((d, i) => (
                      <tr key={i} className="border-t border-green-200">
                        <td className="p-3 bg-green-50 font-medium text-green-900">
                          {d.key}
                        </td>
                        <td className="p-3">{d.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-green-700">No additional details available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
