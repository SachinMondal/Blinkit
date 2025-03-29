import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductTile from "../../ProductDetails/ProductTile";
import { getCategoryAndProduct } from "../../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";
import emptyProduct from "../../../images/emptyProduct.jpg";
import LazyImage from "../LazyLoading/LazyLoading";

const ViewAll = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.category.categoryAndProduct);

  useEffect(() => {
    dispatch(getCategoryAndProduct(category));
  }, [category, dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex gap-8 flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 text-left">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>{" "}
        &gt; <span className="text-gray-900">{products?.name}</span>
      </div>

      {/* Category Title */}
      <h2 className="text-2xl font-bold text-gray-800 capitalize">
        {products?.name} - All Products
      </h2>

      {/* If products exist, show them */}
      {products?.subcategories && products.subcategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {products.subcategories.map((productData) =>
            productData.products && productData.products.length > 0
              ? productData.products.map((product) => (
                  <ProductTile
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                  />
                ))
              : (
       
                <div className="flex flex-col items-center justify-center  h-96 text-center">
                  <LazyImage
                    src={emptyProduct}
                    alt="No Products Found"
                    className="w-48 h-48 mb-4"
                  />
                  <p className="text-gray-600 text-lg font-semibold">
                    No products found in this category.
                  </p>
                </div>
              )
          )}
        </div>
      ) : (
       
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <LazyImage
            src={emptyProduct}
            alt="No Products Found"
            className="w-48 h-48 mb-4"
          />
          <p className="text-gray-600 text-lg font-semibold">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewAll;
