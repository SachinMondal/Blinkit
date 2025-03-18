import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const [count, setCount] = useState(0);
  const handleAdd = (e) => {
    e.stopPropagation();
    setCount(1);
  };
  
  const handleIncrease = (e) => {
    e.stopPropagation(); 
    if (count < 3) setCount(count + 1);
  };
  
  const handleDecrease = (e) => {
    e.stopPropagation(); 
    setCount(count > 1 ? count - 1 : 0);
  };
  

  const mockProducts = {
    Electronics: [
      {
        id: 1,
        name: "Laptop",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 800,
      },
      {
        id: 2,
        name: "Smartphone",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 500,
      },
      {
        id: 3,
        name: "Headphones",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 150,
      },
    ],
    Clothing: [
      {
        id: 4,
        name: "T-Shirt",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 20,
      },
      {
        id: 5,
        name: "Jeans",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 40,
      },
      {
        id: 6,
        name: "Jacket",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 80,
      },
    ],
    Books: [
      {
        id: 7,
        name: "Novel",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 15,
      },
      {
        id: 8,
        name: "Textbook",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 50,
      },
      {
        id: 9,
        name: "Magazine",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/2324px-Banana-Single.jpg",
        price: 10,
      },
    ],
  };
  const product = Object.values(mockProducts)
    .flat()
    .find((p) => p.id === Number(productId));

  if (!product) {
    return (
      <div className="text-center text-2xl text-red-500 mt-10">
        Product not found!
      </div>
    );
  }

  // Find the category of the product
  const category = Object.keys(mockProducts).find((category) =>
    mockProducts[category].some((p) => p.id === product.id)
  );

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row items-start space-x-6">
        {/* Left Section (Product Image & Details) */}
        <div className="lg:w-1/2 w-full p-4 border-r lg:h-screen sticky top-0 overflow-y-auto scrollbar-hide">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-96 object-contain rounded-lg"
          />
          <div className="mt-4 p-2 border-t flex flex-col text-left justify-start">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <h5 className="text-xl font-semibold">{product.name}</h5>
            <p className="text-gray-700 mt-2">
              Price: ${product.price}
              <br />
              <br />
              Description:
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              ultricies neque vel mi volutpat, at consectetur lectus viverra.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Donec viverra, ipsum in tempus convallis,
              enim ligula euismod turpis, at sagittis ligula mi in velit. Nulla
              facilisi. Donec auctor, purus et elementum tristique, nisi neque
              commodo justo, in fringilla neque neque vel metus.
            </p>
          </div>
        </div>

        {/* Right Section (Product Details & Reviews) */}
        <div className="flex flex-col w-full lg:w-1/2 overflow-y-auto">
          {/* Product Details Section */}
          <div className="p-6 flex flex-col justify-start text-left border-b">
            {/* Breadcrumbs */}
            <div className="mb-4 text-sm text-gray-600">
              <Link to="/" className="text-blue-500 hover:underline">
                Home
              </Link>{" "}
              &gt;{" "}
              <Link
                to={`/category/${category}`}
                className="text-blue-500 hover:underline"
              >
                {category}
              </Link>{" "}
              &gt; <span className="text-gray-900">{product.name}</span>
            </div>

            {/* Product Details */}
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-lg text-gray-700 mt-2">Category: {category}</p>
            <div className="flex items-center justify-between space-x-4">
              <p className="text-xl font-semibold mt-4">
                Price: ${product.price}
              </p>
              {count === 0 ? (
                <button
                  onClick={handleAdd}
                  className="bg-green-300 text-green-900 font-bold text-xs px-3 py-1 rounded-lg w-36 h-10"
                >
                  Add To Cart
                </button>
              ) : (
                <div className="flex items-center justify-between bg-green-300 rounded-lg w-36 h-10">
                  {/* Left half (Decrease) */}
                  <div
                    onClick={handleDecrease}
                    className="flex-1 flex items-center justify-center text-green-900 font-bold cursor-pointer rounded-l-lg"
                  >
                    -
                  </div>

                  <span className="text-sm font-semibold">{count}</span>

                  {/* Right half (Increase) */}
                  <div
                    onClick={count < 3 ? handleIncrease : undefined}
                    className={`flex-1 flex items-center justify-center font-bold rounded-r-lg ${
                      count < 3
                        ? "text-green-900 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed "
                    }`}
                  >
                    +
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Reviews Section */}
          <div className="p-6 flex flex-col justify-start text-left">
            <h2 className="text-2xl font-bold">Product Reviews</h2>
            <div className="flex flex-col space-y-4">
              <div className="border-t border-b p-4">
                <p className="text-gray-700 text-sm">User 1</p>
                <p className="text-lg font-semibold">Excellent Product!</p>
                <p className="text-gray-700 text-sm">5/5 stars</p>
              </div>
              <div className="border-t border-b p-4">
                <p className="text-gray-700 text-sm">User 2</p>
                <p className="text-lg font-semibold">Awesome experience!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
