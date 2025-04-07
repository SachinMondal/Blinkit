import { useState, useEffect } from "react";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import {
  uploadBanner,
  getBanners,
  deleteBanner,
} from "../../redux/state/home/Action";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  updateOrder,
} from "../../redux/state/order/Action";

const Dashboard = () => {
  const [deliveryTimes, setDeliveryTimes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const banners = useSelector((state) => state.banner.banners || []);
  const orders = useSelector((state) => state.order.adminOrders || []);
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch, banners.length]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmitBanner = async () => {
    if (!selectedImage || !altText.trim()) return;

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

  const handleDeleteBanner = async (id) => {
    await dispatch(deleteBanner(id));
    dispatch(getBanners());
  };

  const handleDeliveryTimeChange = (orderId, value) => {
    setDeliveryTimes((prev) => ({
      ...prev,
      [orderId]: value,
    }));
    dispatch(
      updateOrder(orderId, { deliveryTime: value, orderStatus: "ACCEPTED" })
    );
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);
  const filteredOrders = orders.filter(
    (order) => order.orderStatus !== "Pending"
  );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Live Orders */}
      <div className="bg-white p-5 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-3 min-h-[250px] flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold mb-4">Live Orders</h3>
        {orders.length > 0 ? (
          <div className="max-h-60 overflow-y-auto w-full">
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 gap-2"
                >
                  <div>
                    <h4 className="font-semibold">{order.user.name}</h4>
                    <p className="text-gray-500">
                      {order?.orderItems
                        ?.map((o) => `${o.productId.name} x ${o.quantity}`)
                        .join(", ")}{" "}
                      items - {order.orderStatus}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-gray-700">{order.subtotalPrice}</span>

                    <select
                      value={
                        deliveryTimes[order._id] || order.deliveryTime || ""
                      }
                      onChange={(e) =>
                        handleDeliveryTimeChange(order._id, e.target.value)
                      }
                      className="p-2 border rounded bg-gray-100 text-sm"
                    >
                      <option value="" disabled>
                        Select Time
                      </option>

                      {["10 mins", "20 mins", "30 mins","1 Hour"].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}

                      {order.deliveryTime &&
                        !["30 mins", "1 hour", "2 hours"].includes(
                          order.deliveryTime
                        ) && (
                          <option value={order.deliveryTime}>
                            {order.deliveryTime}
                          </option>
                        )}

                      <option value="custom">Custom</option>
                    </select>

                    {deliveryTimes[order._id] === "custom" && (
                      <input
                        type="text"
                        placeholder="Enter custom time"
                        className="p-2 border rounded text-sm"
                        onBlur={(e) =>
                          handleDeliveryTimeChange(order._id, e.target.value)
                        }
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <LazyImage
              src="https://i.imgur.com/qIufhof.png"
              alt="No orders"
              className="w-40 h-40 opacity-75"
            />
            <p className="mt-4 text-gray-600 text-lg italic">
              "No orders yet. Stay patient, great things take time."
            </p>
          </div>
        )}
      </div>
      {/* Banners */}
      <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-3">
        <h3 className="text-xl font-semibold mb-4">Home Screen Banners</h3>

        {/* Upload Image */}
        <div className="mb-4 flex items-center space-x-4">
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
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
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        {/* Alt Text Input */}
        {selectedImage && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        )}

        {/* Submit Button */}
        {selectedImage && (
          <button
            onClick={handleSubmitBanner}
            disabled={isUploading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isUploading ? "Uploading..." : "Submit"}
          </button>
        )}

        {/* Display Banners */}
        {banners?.data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {banners?.data?.map((banner) => (
              <div key={banner.id} className="relative">
                <LazyImage
                  src={banner.image}
                  alt={banner.alt}
                  className="rounded-lg shadow-lg w-full h-20"
                />
                <button
                  onClick={() => handleDeleteBanner(banner._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-gray-500 italic">
            <LazyImage
              src="https://i.imgur.com/qIufhof.png"
              alt="No banners"
              className="w-40 h-40 opacity-75"
            />
            <p className="mt-4">"No banners uploaded yet."</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
