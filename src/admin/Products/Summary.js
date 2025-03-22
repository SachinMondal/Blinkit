import { useLocation, useNavigate } from "react-router-dom";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};

  return (
    <div className="w-full min-h-screen px-6 sm:px-12 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Review Your Product</h1>

      <p><strong>Category:</strong> {formData.category}</p>
      <p><strong>Product Name:</strong> {formData.productName}</p>
      <p><strong>Price:</strong> ₹{formData.price}</p>
      <p><strong>MRP:</strong> ₹{formData.mrp}</p>
      <p><strong>Country of Origin:</strong> {formData.countryOfOrigin}</p>
      <p><strong>Brand:</strong> {formData.brand}</p>
      <p><strong>Size:</strong> {formData.variantSize}</p>

      <div className="flex gap-4 mt-6">
        <button onClick={() => navigate(-1)} className="bg-yellow-500 text-white px-6 py-3 rounded-lg">Edit</button>
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg" onClick={()=>navigate("/admin/products")}>Submit</button>
      </div>
    </div>
  );
};

export default Summary;
