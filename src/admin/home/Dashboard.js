import { useState, useEffect } from "react";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import {
  uploadBanner,
  getBanners,
  deleteBanner,
  fetchCharges,
  updateCharges,
} from "../../redux/state/home/Action";
import {
  getAllOrdersForAdmin,
  updateOrder,
} from "../../redux/state/order/Action";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [deliveryTimes, setDeliveryTimes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState(null);
  const [altError, setAltError] = useState("");
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [isEditingCharges, setIsEditingCharges] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [handlingCharge, setHandlingCharge] = useState(0);
  const [prevCharges, setPrevCharges] = useState({ delivery: 0, handling: 0 });

  const banners = useSelector((state) => state.banner.banners || []);
  const orders = useSelector((state) => state.order.adminOrders || []);
  const { settings, loading } = useSelector((state) => state.banner);
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      await dispatch(getAllOrdersForAdmin());
      setIsLoadingOrders(false);
    };
    fetchOrders();
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchCharges());
  }, [dispatch]);
  useEffect(() => {
    if (settings) {
      setDeliveryCharge(settings.deliveryCharge || 0);
      setHandlingCharge(settings.handlingCharge || 0);
    }
  }, [settings]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmitBanner = async () => {
    if (!selectedImage || !altText.trim()) {
      setAltError("Alt text is required.");
      return;
    }

    setAltError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedImage.file);
    formData.append("alt", altText);

    await dispatch(uploadBanner(formData));
    dispatch(getBanners());
    setSelectedImage(null);
    setAltText("");
    setIsUploading(false);
  };

  const handleDeleteBannerWithAnimation = async (id) => {
    setDeletingBannerId(id);
    setTimeout(async () => {
      await dispatch(deleteBanner(id));
      dispatch(getBanners());
      setDeletingBannerId(null);
    }, 800);
  };

  const handleDeliveryTimeChange = (orderId, value) => {
    setDeliveryTimes((prev) => ({
      ...prev,
      [orderId]: value,
    }));

    if (value !== "") {
      dispatch(
        updateOrder(orderId, { deliveryTime: value, orderStatus: "ACCEPTED" })
      );

      // Animate and remove the order after 500ms
      setTimeout(() => {
        setVisibleOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      }, 500);
    }
  };

  useEffect(() => {
    dispatch(fetchCharges());

    const interval = setInterval(() => {
      dispatch(fetchCharges());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const pending = orders.filter(
      (order) => order.orderStatus?.toLowerCase() === "pending"
    );
    setVisibleOrders(pending);
  }, [orders]);

  const handleEditClick = () => {
    setPrevCharges({ delivery: deliveryCharge, handling: handlingCharge });
    setIsEditingCharges(true);
  };

  const handleCancelClick = () => {
    setDeliveryCharge(prevCharges.delivery);
    setHandlingCharge(prevCharges.handling);
    setIsEditingCharges(false);
  };

  const handleSaveClick = async () => {
    await dispatch(
      updateCharges(Number(deliveryCharge), Number(handlingCharge))
    );
    setIsEditingCharges(false);
  };
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Live Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow col-span-full"
      >
        <h3 className="text-2xl font-semibold mb-4">📦 Live Orders</h3>
        {isLoadingOrders ? (
          <motion.div
            className="flex justify-center items-center h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "mirror" }}
          >
            <p className="text-gray-500 text-lg animate-pulse">
              Loading orders...
            </p>
          </motion.div>
        ) : visibleOrders.length > 0 ? (
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
            <AnimatePresence>
              {visibleOrders.map((order) => (
                <motion.li
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2"
                >
                  <div>
                    <h4 className="font-semibold">{order.user.name}</h4>
                    <p className="text-gray-500 text-sm">
                      {order.orderItems
                        .map(
                          (item) => `${item.productId?.name} x ${item.quantity}`
                        )
                        .join(", ")}{" "}
                      - {order.orderStatus}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-gray-800 font-semibold">
                      ₹{order?.totalCartDiscountedPrice}
                    </span>
                    <select
                      value={deliveryTimes[order._id] || ""}
                      onChange={(e) =>
                        handleDeliveryTimeChange(order._id, e.target.value)
                      }
                      className="p-2 border rounded bg-gray-100 text-sm w-full sm:w-auto"
                    >
                      <option value="" disabled>
                        Select Time
                      </option>
                      {["10 mins", "20 mins", "30 mins", "1 Hour"].map(
                        (time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        )
                      )}
                      <option value="custom">Custom</option>
                    </select>

                    {deliveryTimes[order._id] === "custom" && (
                      <input
                        type="text"
                        placeholder="Custom time"
                        className="p-2 border rounded text-sm w-full sm:w-auto"
                        onBlur={(e) =>
                          handleDeliveryTimeChange(order._id, e.target.value)
                        }
                      />
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="flex flex-col items-center text-center">
            <LazyImage
              src="https://i.imgur.com/qIufhof.png"
              alt="No orders"
              className="w-40 h-40 opacity-75"
            />
            <p className="mt-4 text-gray-600 text-lg italic">
              "No pending orders currently."
            </p>
          </div>
        )}
      </motion.div>

      {/* Banner Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow col-span-full"
      >
        <h3 className="text-2xl font-semibold mb-4">🖼️ Home Screen Banners</h3>

        {/* Upload Section */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
            Select Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {selectedImage && (
            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
              <LazyImage
                src={selectedImage.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        {selectedImage && (
          <>
            <input
              type="text"
              placeholder="Enter alt text"
              value={altText}
              onChange={(e) => {
                setAltText(e.target.value);
                if (e.target.value.trim()) setAltError("");
              }}
              className="p-2 border rounded w-full mb-2"
            />
            {altError && (
              <p className="text-red-500 text-sm mb-2">{altError}</p>
            )}
            <button
              onClick={handleSubmitBanner}
              disabled={isUploading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isUploading ? "Uploading..." : "Submit"}
            </button>
          </>
        )}

        {/* Display Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {banners?.data?.length > 0 ? (
            banners?.data?.map((banner) => (
              <motion.div
                key={banner._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <LazyImage
                  src={banner.image}
                  alt={banner.alt}
                  className={`rounded-lg shadow w-full h-20 object-cover transition-all duration-500 ${
                    deletingBannerId === banner._id
                      ? "opacity-30 animate-pulse"
                      : "opacity-100"
                  }`}
                />
                <button
                  onClick={() => handleDeleteBannerWithAnimation(banner._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ✖
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-center">
              <LazyImage
                src="https://i.imgur.com/qIufhof.png"
                alt="No banners"
                className="w-40 h-40 opacity-75"
              />
              <p className="mt-4 text-gray-500 italic">
                "No banners uploaded yet."
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Charges Section */}
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="bg-white p-6 rounded-lg shadow col-span-full"
>
  {/* Header Info */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
    <h3 className="text-2xl font-semibold">⚙️ Charges Settings</h3>

    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm sm:text-base text-gray-500">
      {settings?.lastUpdatedBy && (
        <p className="text-sm">
          Last updated by:{" "}
          <span className="font-medium text-gray-800">
            {settings.lastUpdatedBy.name}
          </span>
        </p>
      )}
      {settings?.updatedAt && (
        <p className="text-xs sm:text-sm text-gray-400">
          Last updated at: {new Date(settings.updatedAt).toLocaleString()}
        </p>
      )}
    </div>

    {/* Edit/Save/Cancel - Desktop (top right) */}
    {!isEditingCharges ? (
      <button
        onClick={handleEditClick}
        className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hidden sm:block"
      >
        Edit
      </button>
    ) : (
      <div className="hidden sm:flex gap-2">
        <button
          onClick={handleSaveClick}
          disabled={loading}
          className={`text-sm px-4 py-2 rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancelClick}
          className="text-sm bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Input Fields */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        Delivery Charge (₹)
      </label>
      <input
        type="number"
        value={deliveryCharge}
        onChange={(e) => setDeliveryCharge(e.target.value)}
        disabled={!isEditingCharges}
        className={`w-full px-4 py-2 border rounded-md shadow-sm ${
          isEditingCharges
            ? "focus:ring-2 focus:ring-green-500"
            : "bg-gray-100 cursor-not-allowed"
        }`}
        placeholder="e.g. 30"
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        Handling Charge (₹)
      </label>
      <input
        type="number"
        value={handlingCharge}
        onChange={(e) => setHandlingCharge(e.target.value)}
        disabled={!isEditingCharges}
        className={`w-full px-4 py-2 border rounded-md shadow-sm ${
          isEditingCharges
            ? "focus:ring-2 focus:ring-green-500"
            : "bg-gray-100 cursor-not-allowed"
        }`}
        placeholder="e.g. 10"
      />
    </div>
  </div>

  {/* Edit/Save/Cancel - Mobile (below inputs) */}
  <div className="mt-6 sm:hidden">
    {!isEditingCharges ? (
      <button
        onClick={handleEditClick}
        className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Edit
      </button>
    ) : (
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSaveClick}
          disabled={loading}
          className={`text-sm px-4 py-2 rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancelClick}
          className="text-sm bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    )}
  </div>
</motion.div>


    </div>
  );
};

export default Dashboard;
