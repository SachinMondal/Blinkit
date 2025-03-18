import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductTile from "./ProductTile";
import { Link, useNavigate, useParams } from "react-router-dom";


const ProductCarousel = ({ products }) => {
  const {category}=useParams();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate=useNavigate();
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (index) => setCurrentSlide(index),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
      
    ],
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product}`);
  };
  // Calculate last visible slide index
  const lastSlideIndex = products.length - settings.slidesToShow;

  return (
    <div className="relative px-4 mt-6 lg:max-w-5xl w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-left font-bold text-2xl">Electronics</p>
        <Link to={`/categoryviewAll/Electronics`} className="text-right font-bold text-lg text-green-700 cursor-pointer">
    See All
  </Link>
      </div>

      {/* Left Navigation Button (Hidden if at first slide) */}
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
          {products.map((item, index) => (
            <div key={index} className="px-2">
              <ProductTile {...item} onClick={()=>handleProductClick(item.name)} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Right Navigation Button (Hidden if at last slide) */}
      {currentSlide < lastSlideIndex && (
        <button
          onClick={() => sliderRef.current.slickNext()}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 z-20 bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-300"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;
