import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductTile from "./ProductTile";
import { Link, useNavigate } from "react-router-dom";

const ProductCarousel = ({ products }) => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  
  
  

  return (
    <div className="relative px-4 mt-6 lg:max-w-5xl w-full">
      {Object.entries(products).map(([categoryName, categoryData]) => {
        if (!categoryData || !categoryData.products || categoryData.products.length === 0) return null;

        const settings = {
          infinite: false,
          speed: 500,
          slidesToShow: Math.min(categoryData.products.length, 6),
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          afterChange: (index) => setCurrentSlide(index),
          responsive: [
            { breakpoint: 1024, settings: { slidesToShow: Math.min(categoryData.products.length, 5) } },
            { breakpoint: 768, settings: { slidesToShow: Math.min(categoryData.products.length, 4) } },
            { breakpoint: 480, settings: { slidesToShow: Math.min(categoryData.products.length, 2) } },
          ],
        };

        return (
          <div key={categoryData.categoryId} className="mb-10">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-left font-bold text-2xl capitalize">{categoryName}</p>
              <Link
                to={`/categoryviewAll/${categoryData.categoryId}`}
                className="text-right font-bold text-lg text-green-700 cursor-pointer"
              >
                See All
              </Link>
            </div>

            {/* Left Navigation Button */}
            {currentSlide > 0 && (
              <button
                onClick={() => sliderRef.current.slickPrev()}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-300"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}

            {/* Product Slider */}
            <div className="overflow-hidden relative">
              <Slider ref={sliderRef} {...settings}>
                {categoryData.products.map((product, index) => (
                  <div key={index} className="px-2">
                    <ProductTile product={product} onClick={() => handleProductClick(product._id)} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Right Navigation Button */}
            {currentSlide < Math.max(0, categoryData.products.length - settings.slidesToShow) && (
              <button
                onClick={() => sliderRef.current.slickNext()}
                className="absolute right-36 top-1/2 transform -translate-y-1/2 z-20 bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-300"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductCarousel;
