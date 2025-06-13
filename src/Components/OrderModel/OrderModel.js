import LazyImage from "../utils/LazyLoading/LazyLoading";

const OrderModel = ({ order, onBack }) => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div>
        <div className="flex justify-between p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <button
            className="text-white bg-green-700 hover:underline flex items-center mb-4 p-2 rounded-md "
            onClick={onBack}
          >
            Back
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">
            Order ID: <span className="text-gray-700">{order._id}</span>
          </p>
          <p className="text-gray-600">
            Items: <span>{order.totalItems}</span>
          </p>
          <p className="text-gray-600">
            Cart Amount:{" "}
            <span className="font-semibold">₹{order.totalCartAmount}</span>
          </p>
          <div className="text-gray-600">
            <p>
              Discount:{" "}
              <span className="font-semibold text-green-500">
                ₹{order.totalCartDiscountAmount?.toFixed(2)}
              </span>
            </p>
            <div className="ml-4 mt-1 text-sm space-y-1 text-green-500">
              <p>
                - Product Discount: ₹
                {order?.productDiscount?.toFixed(2) || "0.00"}
              </p>
              <p>
                - Category Discount: ₹
                {order?.categoryDiscount?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          <p className="text-gray-600">
            Discounted Cart Price:{" "}
            <span className="font-semibold text-green-600">
              ₹{order.totalCartDiscountedPrice.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-600">
            Delivery Charge:{" "}
            <span className="font-semibold">₹{order.deliveryCharge}</span>
          </p>
          <p className="text-gray-600">
            Handling Charge:{" "}
            <span className="font-semibold">₹{order.handlingCharge}</span>
          </p>
          <p className="text-gray-800 font-semibold">
            Final Price: ₹{order.finalPrice}
          </p>
          <p
            className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
              order.orderStatus === "Delivered"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {order.orderStatus}
          </p>
          <p className="text-gray-500 text-sm">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">
            Delivery Time: {order.deliveryTime}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
        <ul className="space-y-4">
          {order.orderItems?.map((item, index) => {
            const variant = item.productId.variants?.[0];
            return (
              <li
                key={index}
                className="flex items-center space-x-4 border-b pb-3"
              >
                {item?.productId?.images?.length > 0 ? (
                  <LazyImage
                    src={item?.productId?.images[0]}
                    alt={item.productId.name || "Product Image"}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <p>No Image to Preview</p>
                )}

                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.productId.name}</p>
                    {variant && (
                      <p className="text-gray-500 text-sm">
                        Weight: {variant.qty}
                        {variant.unit}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm">
                      <span className="line-through">
                        ₹{item.subtotalPrice}{" "}
                      </span>
                      {item.subtotalDiscountedPrice !== item.subtotalPrice && (
                        <span className="text-green-600 ml-2">
                          ₹{item.subtotalDiscountedPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    x {item.quantity}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Shipping Address */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <div className="bg-gray-100 p-4 rounded-md text-gray-700 leading-relaxed space-y-1">
          <p>
            <span className="font-medium">
              {order.shippingAddress?.firstName}{" "}
              {order.shippingAddress?.lastName}
            </span>
          </p>
          <p>{order.shippingAddress?.streetAddress}</p>
          <p>
            {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.zipCode}
          </p>
          <p>Mobile: {order.shippingAddress?.mobile}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderModel;
