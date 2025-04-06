import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductTile from "./ProductTile";
import { Link, useNavigate } from "react-router-dom";

const ProductCarousel = ({ title, products, categoryId }) => {

  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!products || products.length === 0) return null;

  const slidesToShow = Math.min(products.length, 6);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (index) => setCurrentSlide(index),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(products.length, 6) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(products.length, 5) } },
      { breakpoint: 640, settings: { slidesToShow: Math.min(products.length, 3) } },
      { breakpoint: 425, settings: { slidesToShow: Math.min(products.length, 2) } },
      { breakpoint: 320, settings: { slidesToShow: Math.min(products.length, 1.5) } },
    ],
  };

  return (
    <div className="relative px-4 mt-6 lg:max-w-5xl w-full mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-left font-bold text-2xl capitalize">{title}</p>
        {categoryId && (
          <Link
            to={`/categoryviewAll/${categoryId}`}
            className="text-right font-bold text-lg text-green-700 cursor-pointer"
          >
            See All
          </Link>
        )}
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Left Button */}
        {currentSlide > 0 && (
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-300"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        {/* Slider */}
        <div className="overflow-hidden">
          <Slider ref={sliderRef} {...settings}>
            {products.map((product, index) => (
              <div key={index} className="px-2">
                <ProductTile product={product} onClick={() => handleProductClick(product._id)} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Button */}
        {currentSlide < Math.max(0, products.length - slidesToShow) && (
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-300"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
