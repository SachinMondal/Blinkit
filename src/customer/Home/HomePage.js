import React, { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryTile from "../../Components/CategoryDetails/CategoryTile.js";
import ProductCarousel from "../../Components/ProductDetails/ProductCarosel.js";
import { useNavigate } from "react-router-dom";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading.js";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryProduct } from "../../redux/state/product/Action.js";
import { getBanners } from "../../redux/state/home/Action.js";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.categories);
  const data = useSelector((state) => state.product.categories);
  const loading = useSelector((state) => state.product.loading);
  const banners = useSelector((state) => state.banner.banners||[]);
  useEffect(()=>{
    dispatch(getBanners());
  },[dispatch,banners.length]);
  useEffect(() => {
    if (!category.length) {
      dispatch(getCategoryProduct());
    }
  }, [dispatch, category.length]);

  useEffect(() => {
    if (!data.length) {
     dispatch(getCategoryProduct());
    }
  }, [dispatch, data.length]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  const uniqueCategories = category.reduce((acc, item) => {
    if (!acc.find((cat) => cat.name === item.name)) {
      acc.push(item);
    }
    return acc;
  }, []);



  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const categorySliderSettings = {
    infinite: uniqueCategories.length > 6,
    speed: 800,
    slidesToShow: Math.min(uniqueCategories.length, 6),
    slidesToScroll: 1,
    autoplay: uniqueCategories.length > 6,
    autoplaySpeed: 2500,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(uniqueCategories.length, 5.5) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(uniqueCategories.length, 4) } },
      { breakpoint: 640, settings: { slidesToShow: Math.min(uniqueCategories.length, 2.8) } },
      { breakpoint: 425, settings: { slidesToShow: Math.min(uniqueCategories.length, 2) } },
      { breakpoint: 320, settings: { slidesToShow: Math.min(uniqueCategories.length, 1.5) } },
    ],
  };


  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <Skeleton variant="rectangular" width="100%" height={300} />
          <Skeleton variant="text" width="80%" height={40} className="mt-4" />
          <Skeleton variant="text" width="60%" height={30} className="mt-2" />
        </div>
      ) : (
        <div className="max-w-5xl xl:max-w-6xl mx-auto mt-6 flex gap-16 xl:gap-24 flex-col overflow-hidden">
          <Slider {...sliderSettings}>
            {banners && banners?.data?.map((img, index) => (
              <div key={index} className="flex justify-center max-w-7xl mx-auto px-4">
                <LazyImage
                  src={img.image}
                  alt={img.alt}
                  className="w-full h-[10%] lg:h-[300px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>

          <div className="w-full max-w-7xl mx-auto mt-4 px-4">
            <Slider {...categorySliderSettings}>
              {uniqueCategories.map((item) => (
                <CategoryTile
                  key={item.id || item.name}
                  image={item.image}
                  name={item.name}
                  discount={40}
                  onClick={() => handleCategoryClick(item._id)}
                />
              ))}
            </Slider>
          </div>

          <div className="w-full max-w-7xl mx-auto mt-4 px-4">
            <div className="flex gap-6 mt-3">
              <ProductCarousel products={data} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
