import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductTile from "../ProductDetails/ProductTile";

const ViewAll = ({ products }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  // Filter products by category
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div className="p-6 max-w-5xl mx-auto flex gap-8 flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className=" text-sm text-gray-600 text-left">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>{" "}
        &gt; <span className="text-gray-900">{category}</span>
      </div>

      {/* Category Title */}
      <h2 className="text-2xl font-bold text-gray-800 capitalize">
        {category} - All Products
      </h2>

      {/* Filter and Display Products Dynamically */}
      {filteredProducts.map((cat) =>
        cat.products.length > 0 ? (
          <div
            key={cat.category}
            className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 "
          >
            {cat.products.map((product) => (
              <ProductTile
                key={product.id}
                image={product.image}
                name={product.name}
                quantity={product.quantity}
                price={product.price}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        ) : (
          <p key={cat.category} className="text-gray-600">
            No products found in this category.
          </p>
        )
      )}
    </div>
  );
};

export default ViewAll;
