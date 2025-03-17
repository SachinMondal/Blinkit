import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import LocationModal from "../../utils/LocationPopUp";
import Footer from "./Footer";
import { Skeleton } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryTile from "../../utils/CategoryTile.js";
import ProductCarousel from "../../utils/ProductCarosel.js";
import CartItem from "../../utils/CartItems.js";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [loading, setLoading] = useState(true);
const footerRef=useRef(null);
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setUserLocation(storedLocation);
    } else {
      setIsModalOpen(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  const handleLocationSelect = (location) => {
    setUserLocation(location);
    localStorage.setItem("userLocation", location);
    setIsModalOpen(false);
  };

  const images = [
   "https://i.pinimg.com/originals/db/d4/d1/dbd4d1c40f3a03ffd7108cf099f5c6d8.jpg",
   "https://i.pinimg.com/originals/db/d4/d1/dbd4d1c40f3a03ffd7108cf099f5c6d8.jpg",
   "https://i.pinimg.com/originals/db/d4/d1/dbd4d1c40f3a03ffd7108cf099f5c6d8.jpg",
   "https://i.pinimg.com/originals/db/d4/d1/dbd4d1c40f3a03ffd7108cf099f5c6d8.jpg",
    "https://i.pinimg.com/originals/db/d4/d1/dbd4d1c40f3a03ffd7108cf099f5c6d8.jpg",

  ];
  const data = [
    {
      src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
      title: "Night view",
      description: "4.21M views",
    },
    {
      src: "https://images.unsplash.com/photo-1527549993586-dff825b37782",
      title: "Lake view",
      description: "4.74M views",
    },
    {
      src: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
      title: "Mountain view",
      description: "3.98M views",
    },
    {
      src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
      title: "Night view",
      description: "4.21M views",
    },
    {
      src: "https://images.unsplash.com/photo-1527549993586-dff825b37782",
      title: "Lake view",
      description: "4.74M views",
    },
    {
      src: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
      title: "Mountain view",
      description: "3.98M views",
    },
  ];


  // Image Carousel Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const products = [
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Apple",
      quantity: "1kg",
      price: 120,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Banana",
      quantity: "500g",
      price: 60,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Orange",
      quantity: "1kg",
      price: 100,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Orange",
      quantity: "1kg",
      price: 100,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Orange",
      quantity: "1kg",
      price: 100,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Orange",
      quantity: "1kg",
      price: 100,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Orange",
      quantity: "1kg",
      price: 100,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Orange",
      quantity: "1kg",
      price: 100,
    },
    {
      image: "https://purepng.com/public/uploads/large/purepng.com-orangeorangefruitfoodtastydeliciousorangecolorclipart-331522582453ydcfp.png",
      name: "Grapes",
      quantity: "750g",
      price: 90,
    },
  ];
  
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <>
      {/* Location Popup */}
      {isModalOpen && (
        <LocationModal
          onClose={() => setIsModalOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}

      {/* Navbar */}
      <Navbar
        location={userLocation}
        isLoggedIn={false}
        setLocationModal={setIsModalOpen}
      />

      {/* Skeleton Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <Skeleton variant="rectangular" width="100%" height={300} />
          <Skeleton variant="text" width="80%" height={40} className="mt-4" />
          <Skeleton variant="text" width="60%" height={30} className="mt-2" />
        </div>
      ) : (
        <>
          {/* Image Carousel */}
          <div className="max-w-5xl mx-auto mt-6 flex gap-16 flex-col overflow-hidden">
            {/* Carosel  */}
            <Slider {...sliderSettings}>
              {images.map((img, index) => (
                <div key={index} className="flex justify-center max-w-7xl mx-auto px-4">
                  <img
                    src={img}
                    alt={`Slide ${index}`}
                    className="w-full h-[10%] lg:h-[300px] object-cover rounded-lg"
                  />
                </div>
              ))}
            </Slider>

            {/* categories */}
            <div className="w-full max-w-7xl mx-auto mt-4 px-4 ">
              <Slider {...settings}>
                {data.map((item, index) => (
                  <CategoryTile
                    key={index}
                    image={item.src}
                    name={item.title}
                    discount={40}
                  />
                ))}
              </Slider>
            </div>

            {/* ProductTiles */}
            <div className="w-full max-w-7xl mx-auto mt-4 px-4 ">
              
              <div className="flex gap-6 mt-3">
              <ProductCarousel products={products} />
              </div>
            </div>
          </div>
        </>
      )}
   <div className={`${isFooterVisible ? "hidden" : "fixed bottom-4 left-1/2"} transition-all duration-300`}>
        <CartItem />
      </div>

      {/* Footer */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
