import { useParams, useNavigate } from "react-router-dom";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy product data (replace this with API call)
  const product = {
    id,
    name: "Apple",
    category: "Fruits",
    price: "$2.99",
    stock: 50,
    description: "Fresh and juicy apples from the farm.",
  };

  return (
    <div className="w-full min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* Product Details */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <p className="text-lg"><strong>Name:</strong> {product.name}</p>
        <p className="text-lg"><strong>Category:</strong> {product.category}</p>
        <p className="text-lg"><strong>Price:</strong> {product.price}</p>
        <p className="text-lg"><strong>Stock:</strong> {product.stock}</p>
        <p className="text-lg"><strong>Description:</strong> {product.description}</p>
      </div>
    </div>
  );
};

export default ViewProduct;
