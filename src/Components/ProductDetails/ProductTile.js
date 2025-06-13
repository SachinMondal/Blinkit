import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchCart,
  addToCart,
  removeFromCart,
} from "../../redux/state/cart/Action";
import LazyImage from "../utils/LazyLoading/LazyLoading";

const ProductCard = ({ product, onClick }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  const [variantQuantities, setVariantQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!cartItems?.length || !product?.variants?.length || !product?._id)
      return;

    const updatedQuantities = {};

    cartItems.forEach((item) => {
      const itemProductId =
        typeof item?.product === "object" ? item.product?._id : item?.product;

      if (itemProductId?.toString() === product._id?.toString()) {
        updatedQuantities[item?.variantIndex] = item?.quantity ?? 0;
      }
    });

    setVariantQuantities(updatedQuantities);

    if (!selectedVariant && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [cartItems, product?._id, selectedVariant, product?.variants]);

  const variantIndex = product.variants.findIndex(
    (v) => v._id === selectedVariant?._id
  );
  const count = variantQuantities[variantIndex] || 0;

  const handleAdd = async (e) => {
    e?.stopPropagation?.();
    if (!selectedVariant) return;
    if (variantIndex === -1) return;

    setLoading(true);
    try {
      const result = await dispatch(addToCart(product._id, variantIndex, 1));
      if (result) dispatch(fetchCart());
    } catch (err) {
      console.error("Add error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (e) => {
    e.stopPropagation();
    if (!selectedVariant || variantIndex === -1 || count >= 3) return;

    const newQty = count + 1;
    setVariantQuantities((prev) => ({ ...prev, [variantIndex]: newQty }));
    setLoading(true);

    try {
      const result = await dispatch(
        addToCart(product._id, variantIndex, newQty)
      );
      if (result) {
        dispatch(fetchCart());
      } else {
        setVariantQuantities((prev) => ({ ...prev, [variantIndex]: count }));
      }
    } catch (error) {
      console.error("Error updating cart", error);
      setVariantQuantities((prev) => ({ ...prev, [variantIndex]: count }));
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    if (!selectedVariant || variantIndex === -1 || count === 0) return;

    const newQty = count - 1;
    setVariantQuantities((prev) => ({ ...prev, [variantIndex]: newQty }));
    setLoading(true);

    try {
      if (newQty > 0) {
        const result = await dispatch(
          addToCart(product._id, variantIndex, newQty)
        );
        if (result) {
          dispatch(fetchCart());
        } else {
          setVariantQuantities((prev) => ({ ...prev, [variantIndex]: count }));
        }
      } else {
        const result = await dispatch(
          removeFromCart(product._id, variantIndex)
        );
        if (result) {
          dispatch(fetchCart());
        } else {
          setVariantQuantities((prev) => ({ ...prev, [variantIndex]: count }));
        }
      }
    } catch (error) {
      console.error("Error updating cart", error);
      setVariantQuantities((prev) => ({ ...prev, [variantIndex]: count }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-3 shadow-md w-[140px] bg-white flex flex-col items-left h-56 cursor-pointer relative">
      <div
        className="w-full h-20 bg-gray-100 flex justify-center items-center relative"
        onClick={onClick}
      >
        {product?.images?.length > 0 ? (
          <LazyImage
            src={product?.images[0]}
            alt={product.name}
            className="w-full h-full object-contain rounded-md "
          />
        ) : (
          <p>No Image to Preview</p>
        )}

        {selectedVariant?.discount && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            {selectedVariant?.discount}% OFF
          </span>
        )}
      </div>

      <div className="text-left mt-2 w-full">
        <h3 className="text-sm font-medium">{product.name}</h3>

        {product?.variants?.length > 0 ? (
          <div className="mt-1 flex flex-col space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Select Variant:
            </label>
            <select
              className="w-full text-xs border rounded-md p-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-400"
              value={selectedVariant?._id || ""}
              onChange={(e) => {
                const variant = product.variants.find(
                  (v) => v._id === e.target.value
                );
                setSelectedVariant(variant);
              }}
            >
              {product.variants.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.qty} {variant.unit} - ₹
                  {Math.floor(selectedVariant.price - variant.discountPrice)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Quantity: {product.quantity || "N/A"}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center w-full mt-2 h-16">
        <div>
          <p className="text-sm text-left font-semibold text-gray-800 mr-1">
            ₹
            {selectedVariant
              ? Math.floor(
                  selectedVariant.price -
                    selectedVariant.discountPrice -
                    selectedVariant.categoryDiscount
                )
              : Math.floor(product.price) ?? "N/A"}
          </p>
          <div className="flex flex-row gap-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 line-through">
              ₹
              {selectedVariant
                ? Math.floor(
                    selectedVariant.price - selectedVariant.discountPrice
                  )
                : Math.floor(product.price * 1.2)}
            </p>
            <p className="text-xs font-semibold text-gray-500 line-through">
              ₹
              {selectedVariant
                ? Math.floor(selectedVariant.price)
                : Math.floor(product.price * 1.2)}
            </p>
          </div>
        </div>

        {count === 0 ? (
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-lg w-16 h-8 shadow-md hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "..." : "Add"}
          </button>
        ) : (
          <div className="flex items-center space-x-1 bg-green-500 text-white rounded-lg w-16 h-8 shadow-md">
            <button
              onClick={handleDecrease}
              className="px-2 py-1 font-bold"
              disabled={loading}
            >
              -
            </button>
            <span className="text-sm font-semibold">{count}</span>
            <button
              onClick={handleIncrease}
              className={`px-2 py-1 font-bold ${
                count < 3
                  ? "cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={loading || count >= 3}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
