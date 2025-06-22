import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductTile from "./ProductTile";
import { Link, useNavigate } from "react-router-dom";

const ProductCarousel = ({ title, products, categoryId }) => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(6);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!products || products.length === 0) return null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateVisibleSlides = () => {
    const width = window.innerWidth;
    let count = 6;

    if (width < 320) count = 1.5;
    else if (width < 425) count = 2;
    else if (width < 640) count = 3;
    else if (width < 1024) count = 4;
    else if (width < 1280) count = 5;

    setVisibleSlides(Math.min(products.length, count));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    updateVisibleSlides();
    window.addEventListener("resize", updateVisibleSlides);
    return () => window.removeEventListener("resize", updateVisibleSlides);
  }, [products.length, updateVisibleSlides]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: visibleSlides,
    slidesToScroll: 1,
    autoplay: false,
    afterChange: (index) => setCurrentSlide(index),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(products.length, 7) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(products.length, 6) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(products.length, 4) } },
      { breakpoint: 640, settings: { slidesToShow: Math.min(products.length, 2.5) } },
      { breakpoint: 425, settings: { slidesToShow: Math.min(products.length, 2) } },
      { breakpoint: 350, settings: { slidesToShow: Math.min(products.length, 1) } },
    ],
  };

  const totalSlides = products.length;
  const showRightArrow = currentSlide + visibleSlides < totalSlides;

  return (
    <div className="relative px-4 mt-6 lg:max-w-6xl w-full mb-10">
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

      {/* Slider */}
      <div className="relative">
        {/* Left Arrow */}
        {currentSlide > 0 && (
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-300"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

   <Slider ref={sliderRef} {...settings}>
  {products
    .filter((product) => product.isArchive !== true)
    .map((product, index) => (
      <div
        key={index}
        className={`px-${products.length < 4 ? "1" : "2"}`}
      >
        <ProductTile
          product={product}
          onClick={() => handleProductClick(product._id)}
        />
      </div>
    ))}
</Slider>


        {/* Right Arrow */}
        {showRightArrow && (
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
