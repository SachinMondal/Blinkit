import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, deleteProduct } from "../../redux/state/product/Action";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get products from Redux store
  const { products, loading } = useSelector((state) => state.product);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);


  // Open modal with selected product
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (productToDelete?._id) {
      dispatch(deleteProduct(productToDelete._id)).then(() => {
        dispatch(getAllProducts()); 
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => navigate("/admin/products/addProduct")}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium"
        >
          + Add Product
        </button>
      </div>

      {/* Show Loading/Error */}
      {loading && <p className="text-center text-lg">Loading products...</p>}
    

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center text-gray-700 text-lg ">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">No of Variants</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-4 text-lg">{product.name}</td>
                  <td className="p-4">
                    {typeof product.category === "object" ? product.category.name : product.category}
                  </td>
                  <td className="p-4">{product.variants.length}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4 flex justify-center space-x-4">
                    <Link to={`/admin/products/${product._id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                    <Link to={`/admin/products/editProduct/${product._id}`} className="text-yellow-600 hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
