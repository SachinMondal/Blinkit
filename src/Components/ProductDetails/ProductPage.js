import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import emptyProduct from "../../images/emptyProduct.jpg";
import LazyImage from "../utils/LazyLoading/LazyLoading";
import { getProductById } from "../../redux/state/product/Action";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryAndProduct } from "../../redux/state/category/Action";
import { Link } from "react-router-dom";
import ProductTile from "./ProductTile";
import {
  addToCart,
  fetchCart,
  removeFromCart,
} from "../../redux/state/cart/Action";
const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFetchingProduct, setIsFetchingProduct] = useState(true);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const product = useSelector((state) => state.product.product);
  const cart = useSelector((state) => state.cart.cartItems);
  const allProducts = useSelector((state) => state.category.categoryAndProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetchingProduct(true);
      try {
        await dispatch(getProductById(productId));
      } finally {
        setIsFetchingProduct(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.category?._id) {
      dispatch(getCategoryAndProduct(product.category._id));
    }
  }, [dispatch, product?.category?._id]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (!product || !cart || !product?.variants?.length) return;

    const cartItem = cart.find((item) => {
      const itemProductId =
        typeof item.product === "object" ? item.product._id : item.product;
      return itemProductId === product._id;
    });

    if (cartItem) {
      const variant = product.variants[cartItem.variantIndex];
      setSelectedVariant(variant);
      setCount(cartItem.quantity);
    } else {
      setSelectedVariant(product.variants[0]);
      setCount(0);
    }
  }, [cart, product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);

    const variantIndex = product.variants.findIndex(
      (v) => v._id === variant._id
    );
    const cartItem = cart.find(
      (item) =>
        item.product === product._id && item.variantIndex === variantIndex
    );

    setCount(cartItem ? cartItem.quantity : 0);
  };

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!selectedVariant) return;

    const variantIndex = product.variants.findIndex(
      (v) => v._id === selectedVariant._id
    );
    if (variantIndex === -1) return;

    setLoading(true);
    try {
      const result = await dispatch(addToCart(product._id, variantIndex, 1));
      if (result) {
        setCount(1);
        dispatch(fetchCart());
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (e) => {
    e.stopPropagation();
    if (!selectedVariant || count >= 3) return;

    const variantIndex = product.variants.findIndex(
      (v) => v._id === selectedVariant._id
    );
    if (variantIndex === -1) return;

    setLoading(true);
    try {
      const result = await dispatch(
        addToCart(product._id, variantIndex, count + 1)
      );
      if (result) {
        dispatch(fetchCart());
        setCount(count + 1);
      }
    } catch (error) {
      console.error("Error updating cart", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    if (!selectedVariant || count === 0) return;

    const variantIndex = product.variants.findIndex(
      (v) => v._id === selectedVariant._id
    );
    if (variantIndex === -1) return;

    setLoading(true);
    try {
      if (count > 1) {
        const result = await dispatch(
          addToCart(product._id, variantIndex, count - 1)
        );
        if (result) {
          dispatch(fetchCart());
          setCount(count - 1);
        }
      } else {
        const result = await dispatch(
          removeFromCart(product._id, variantIndex)
        );
        if (result) {
          dispatch(fetchCart());
          setCount(0);
        }
      }
    } catch (error) {
      console.error("Error updating cart", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(allProducts?.subcategories)
    ? allProducts.subcategories
        .flatMap((subcategory) => subcategory.products)
        .filter((p) => p._id !== productId)
    : [];

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {isFetchingProduct ? (
        <div className="flex flex-1 items-center justify-center min-h-[400px] w-full">
          <p className="text-gray-500 text-lg">Loading product...</p>
        </div>
      ) : !product ? (
        <div className="flex flex-1 items-center justify-center min-h-[400px] w-full overflow-hidden">
          <div className="flex flex-col items-center justify-center p-5 rounded-md">
            <LazyImage
              src={emptyProduct}
              alt="Product Not Found"
              className="w-40 h-40 object-contain mb-3"
            />
            <p className="text-gray-500 text-center text-lg">
              Product Not Found
            </p>
          </div>
        </div>
      ) : (
        <>
          <nav className="mb-4 ml-4 text-sm text-gray-600 w-full lg:hidden text-left overflow-hidden">
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/category/${product?.category?._id}`}
              className="text-blue-500 hover:underline"
            >
              {product?.category?.name}
            </Link>{" "}
            &gt; <span className="text-gray-900">{product?.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start lg:space-x-6">
            <div className="w-full lg:w-1/2 p-2 border-r lg:h-screen lg:sticky top-0 overflow-y-auto scrollbar-hide">
              <LazyImage
                src={product?.image}
                alt={product?.name}
                className="w-full object-contain rounded-lg mb-14"
              />

              <div className="mt-4 p-4 border-t text-left">
                <h2 className="text-xl font-semibold">
                  Product Name: {product?.name}
                </h2>
                <p className="text-gray-700 mt-2">
                  Category: {product?.category?.name}
                </p>
                <p className="text-xl font-semibold text-green-700 mt-2">
                  Price: ₹{selectedVariant?.price}
                </p>
              </div>
              <div className="p-6 border-b text-left">
                <h2 className="text-xl font-bold">Product Description</h2>
                <p className="text-lg text-gray-700 mt-2 ml-5">
                  {product?.description}
                </p>

                <h2 className="text-xl font-bold">Product Details</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <p className="text-gray-700">
                    <strong>Brand:</strong> {product?.brand || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Stock:</strong> {product?.stock} available
                  </p>
                  <p className="text-gray-700">
                    <strong>Type:</strong> {product?.type}
                  </p>
                  <p className="text-gray-700">
                    <strong>Weight:</strong> {product?.weight}
                  </p>
                  <p className="text-gray-700">
                    <strong>Country of Origin:</strong>{" "}
                    {product?.countryOfOrigin || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Return Policy:</strong>{" "}
                    {product?.returnPolicy || "N/A"}
                  </p>
                </div>
                <div className="p-6 border-t text-left mt-5">
                  <h2 className="text-xl font-bold text-left">
                    Additional Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <h3 className="text-lg font-semibold">Customer Care:</h3>
                      <p className="text-gray-700">
                        {product?.customerCare || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Manufacturer Address:
                      </h3>
                      <p className="text-gray-700">
                        {product?.manufacturerAddress || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Marketer Address:
                      </h3>
                      <p className="text-gray-700">
                        {product?.marketerAddress || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Packer Details:</h3>
                      <p className="text-gray-700">
                        {product?.packerDetails || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="mb-4 text-sm text-gray-600 hidden lg:block text-left">
                <Link to="/" className="text-blue-500 hover:underline">
                  Home
                </Link>{" "}
                &gt;{" "}
                <Link
                  to={`/category/${product?.category?._id}`}
                  className="text-blue-500 hover:underline"
                >
                  {product?.category?.name}
                </Link>{" "}
                &gt; <span className="text-gray-900">{product?.name}</span>
              </div>
              {product?.variants?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-bold">
                    Select Variant:
                  </h3>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full sm:w-full border-collapse border border-gray-300 text-sm sm:text-base">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-2 sm:px-4 py-2">
                            Select
                          </th>
                          <th className="border border-gray-300 px-2 sm:px-4 py-2">
                            Price
                          </th>
                          <th className="border border-gray-300 px-2 sm:px-4 py-2">
                            Discount
                          </th>
                          <th className="border border-gray-300 px-2 sm:px-4 py-2">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((variant) => (
                          <tr
                            key={variant._id}
                            className={
                              selectedVariant?._id === variant._id
                                ? "bg-green-100"
                                : ""
                            }
                          >
                            <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                              <input
                                type="radio"
                                name="variant"
                                checked={selectedVariant?._id === variant._id}
                                onChange={() => handleVariantChange(variant)}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 sm:px-4 py-2">
                              ₹{variant.price}
                            </td>
                            <td className="border border-gray-300 px-2 sm:px-4 py-2">
                              ₹{variant.discountPrice}
                            </td>
                            <td className="border border-gray-300 px-2 sm:px-4 py-2">
                              {variant.qty} {variant.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="p-6 border-b">
                <div className="flex items-center justify-end space-x-4 mt-6">
                  {count === 0 ? (
                    <button
                      onClick={handleAdd}
                      disabled={!selectedVariant}
                      className="bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-lg w-40"
                    >
                      {loading ? "..." : "Add To Cart"}
                    </button>
                  ) : (
                    <div className="flex items-center bg-green-500 text-white rounded-lg w-40">
                      <button
                        onClick={handleDecrease}
                        className="flex-1 py-2 font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold">{count}</span>
                      <button
                        onClick={count < 3 ? handleIncrease : undefined}
                        className={`flex-1 py-2 font-bold text-lg ${
                          count < 3 ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 mt-20 text-left">
              Similar Products
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="flex flex-wrap gap-4 sm:gap-2 ">
                {filteredProducts.map((product) => (
                  <ProductTile
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No similar products available.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
