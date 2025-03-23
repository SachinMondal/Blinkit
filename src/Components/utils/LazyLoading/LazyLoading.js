import { useState, useEffect } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton Loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg"></div>
      )}

      {/* Image with Fade-in Effect */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-500 w-full h-full object-cover rounded-lg ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
