import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryTile from "../../Components/CategoryDetails/CategoryTile.js";
import ProductCarousel from "../../Components/ProductDetails/ProductCarosel.js";
import LazyImage from "../../Components/utils/LazyLoading/LazyLoading.js";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryProduct } from "../../redux/state/product/Action.js";
import { getBanners } from "../../redux/state/home/Action.js";
import HomeSkeleton from "../../Components/Skeleton/HomeSkeleton.js";

const HomePage = () => {
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

  const uniqueCategories = category
    .filter((item) => item.status === "active")
    .reduce((acc, item) => {
      if (!acc.find((cat) => cat.name === item.name)) {
        acc.push(item);
      }
      return acc;
    }, []);

  const filteredSections = {
    featured: [],
    newArrivals: [],
    onSale: [],
    special: [],
    topCategories: [],
    bestSeller: [],
  };

  Object.values(data || {}).forEach((category) => {
    const details = category?.categoryDetails || {};
    const products = category?.products || [];

    if (!products.length) return;

    if (details?.isFeatured) filteredSections.featured.push(...products);
    if (details?.newArrivals) filteredSections.newArrivals.push(...products);
    if (details?.isSale) filteredSections.onSale.push(...products);
    if (details?.isSpecial) filteredSections.special.push(...products);
    if (details?.isHomePageVisible || details?.isVisible) filteredSections.topCategories.push(...products);
    if (details?.isBestSeller || details?.isVisible) filteredSections.bestSeller.push(...products);
  });

  // Remove duplicate products (same product might be in multiple sections)
  const removeDuplicateProducts = (products) => {
    const seen = new Set();
    return products.filter((prod) => {
      if (seen.has(prod._id)) return false;
      seen.add(prod._id);
      return true;
    });
  };

  Object.keys(filteredSections).forEach((section) => {
    filteredSections[section] = removeDuplicateProducts(filteredSections[section]);
  });

  const bannerSliderSettings = {
    dots: true,
    infinite: banners?.data?.length > 1?true:false,
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
        { breakpoint: 1024, settings: { slidesToShow: Math.min(itemsLength, 4.5) } },
        { breakpoint: 640, settings: { slidesToShow: Math.min(itemsLength, 2.8) } },
        { breakpoint: 425, settings: { slidesToShow: Math.min(itemsLength, 2) } },
        { breakpoint: 320, settings: { slidesToShow: Math.min(itemsLength, 1.5) } },
      ],
    };
  };

  const categorySliderSettings = generateSliderSettings(uniqueCategories.length, 6);

  const sectionTitles = {
    featured: "Featured Products",
    newArrivals: "New Arrivals",
    onSale: "Sale - Grab it Soon Before Ending",
    special: "Special Offers",
    topCategories: "Top Categories",
    bestSeller: "Best Sellers",
  };

  return (
    <>
      {loading ? (
        <HomeSkeleton />
      ) : (
        <div className="max-w-6xl mx-auto mt-6 flex gap-16 xl:gap-24 flex-col overflow-hidden">
          {/* Banner Slider */}
          {banners?.data?.length > 0 && (
            <Slider {...bannerSliderSettings}>
              {banners.data
                .filter((img) => img?.image)
                .map((img, index) => (
                  <div key={index} className="flex justify-center px-4">
                    <LazyImage
                      src={img.image}
                      alt={img.alt || "Banner"}
                      className="w-full h-[180px] sm:h-[240px] md:h-[300px] object-cover rounded-lg"
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
                    subId={item._id}
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
                    subId={item._id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Sections */}
          <div className="flex flex-col gap-4 px-4">
            {Object.entries(filteredSections).map(([sectionName, products]) => {
              if (!products.length) return null;

              return (
                <ProductCarousel
                  key={sectionName}
                  title={sectionTitles[sectionName] || sectionName}
                  products={products}
                  categoryId={null}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
