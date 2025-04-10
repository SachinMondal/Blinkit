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
  const banners = useSelector((state) => state.banner.banners || []);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  useEffect(() => {
    if (!category.length) {
      dispatch(getCategoryProduct());
    }
  }, [category.length, dispatch]);

  useEffect(() => {
    if (!data.length) {
      dispatch(getCategoryProduct());
    }
  }, [data.length, dispatch]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const uniqueCategories = category.reduce((acc, item) => {
    if (!acc.find((cat) => cat.name === item.name)) {
      acc.push(item);
    }
    return acc;
  }, []);

  const filteredSections = {
    featured: {},
    newArrivals: {},
    onSale: {},
    special: {},
    topCategories: {},
    bestSeller: {},
  };

  Object.entries(data || {}).forEach(([key, category]) => {
    const details = category?.categoryDetails || {};
    if (details?.isFeatured) {
      filteredSections.featured[key] = category;
    } else if (details?.newArrivals) {
      filteredSections.newArrivals[key] = category;
    } else if (details?.isSale) {
      filteredSections.onSale[key] = category;
    } else if (details?.isSpecial) {
      filteredSections.special[key] = category;
    } else if (details?.isHomePageVisible || details?.isVisible) {
      filteredSections.topCategories[key] = category;
    } else if (details?.isBestSeller || details?.isVisible) {
      filteredSections.bestSeller[key] = category;
    }
  });

  const bannerSliderSettings = {
    dots: true,
    infinite: banners?.data?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const generateSliderSettings = (itemsLength, maxVisible = 6) => {
    const baseSlides = Math.min(itemsLength, maxVisible);
  
    return {
      infinite: itemsLength > baseSlides,
      speed: 600,
      slidesToShow: baseSlides,
      slidesToScroll: 1,
      autoplay: itemsLength > baseSlides,
      autoplaySpeed: 2500,
      cssEase: "linear",
      responsive: [
        { breakpoint: 1280, settings: { slidesToShow: Math.min(itemsLength, 5.5) } },
        { breakpoint: 1024, settings: { slidesToShow: Math.min(itemsLength, 4) } },
        { breakpoint: 640, settings: { slidesToShow: Math.min(itemsLength, 2.8) } },
        { breakpoint: 425, settings: { slidesToShow: Math.min(itemsLength, 2) } },
        { breakpoint: 320, settings: { slidesToShow: Math.min(itemsLength, 1.5) } },
      ],
    };
  };
  const categorySliderSettings = generateSliderSettings(uniqueCategories.length, 6);

  console.log(uniqueCategories);

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
          {/* Banner Slider */}
          {banners?.data?.length > 0 && (
            <Slider {...bannerSliderSettings}>
              {banners.data
                .filter((img) => img?.image)
                .map((img, index) => (
                  <div
                    key={index}
                    className="flex justify-center max-w-7xl mx-auto px-4"
                  >
                    <LazyImage
                      src={img.image}
                      alt={img.alt || "Banner"}
                      className="w-full h-[10%] lg:h-[300px] object-cover rounded-lg"
                    />
                  </div>
                ))}
            </Slider>
          )}

          {/* Category Section */}
          <div className="w-full max-w-7xl mx-auto mt-4 px-4">
            {uniqueCategories.length > 5 ? (
              <Slider {...categorySliderSettings}>
                {uniqueCategories.map((item) => (
                  <CategoryTile
                    key={item._id || item.name}
                    image={item.image}
                    name={item.name}
                    discount={item.discountPercentage}
                    onClick={() => handleCategoryClick(item._id)}
                  />
                ))}
              </Slider>
            ) : (
              <div className="flex flex-wrap gap-4">
                {uniqueCategories.map((item) => (
                  <CategoryTile
                    key={item._id || item.name}
                    image={item.image}
                    name={item.name}
                    discount={item.discountPercentage}
                    onClick={() => handleCategoryClick(item._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Sections */}
          <div className="flex flex-col gap-4">
            {Object.entries(filteredSections).map(
              ([sectionName, sectionObject]) =>
                Object.entries(sectionObject).map(([key, categoryData]) => {
                  if (!categoryData?.products?.length) return null;

                  return (
                    <ProductCarousel
                      key={categoryData.categoryId}
                      title={
                        sectionName === "HomePageVisible"
                          ? categoryData?.categoryDetails?.name || key
                          : sectionName
                      }
                      products={categoryData.products}
                      categoryId={categoryData.categoryId}
                    />
                  );
                })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
