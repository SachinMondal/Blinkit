import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductTile from "../../ProductDetails/ProductTile";
import { getCategoryAndProduct } from "../../../redux/state/category/Action";
import { useDispatch, useSelector } from "react-redux";
import emptyProduct from "../../../images/emptyProduct.jpg";
import LazyImage from "../LazyLoading/LazyLoading";
import CategorySkeleton from "../../Skeleton/CategorySkeleton";

const ViewAll = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, subcategories } = useSelector(
    (state) => state.category.categoryAndProduct
  );
  const loading = useSelector((state) => state.category.loading);

  useEffect(() => {
    dispatch(getCategoryAndProduct(category));
  }, [category, dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <CategorySkeleton />;
  }

  if (
    (!Array.isArray(subcategories) || subcategories.length === 0) &&
    !loading
  ) {
    return (
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
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex gap-4 flex-col overflow-hidden min-h-screen">
      <div className="text-sm text-gray-600 text-left">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>{" "}
        / <span className="text-gray-800">{name || "Category"}</span>
      </div>

      {/* Category Name */}
      <h2 className="text-2xl font-bold text-gray-800 capitalize text-left mb-6">
        {name || "All Products"}
      </h2>

      {/* Display subcategories and products */}
      {Array.isArray(subcategories) && subcategories.length > 0 ? (
        subcategories.map((subcategory) => (
          <div key={subcategory._id} className="mb-8">
            {/* Subcategory Title */}
            <h3 className="text-xl font-semibold text-gray-700 text-left mb-6">
              {subcategory.name}
            </h3>

            {/* Subcategory Products */}
            {Array.isArray(subcategory.products) &&
            subcategory.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-1">
                {subcategory.products
                  .filter((product) => product.isArchive !== true)
                  .map((product) => (
                    <ProductTile
                      key={product._id}
                      product={product}
                      onClick={() => handleProductClick(product._id)}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No products available in this subcategory.
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-lg font-semibold">
          No subcategories found.
        </p>
      )}
    </div>
  );
};

export default ViewAll;
