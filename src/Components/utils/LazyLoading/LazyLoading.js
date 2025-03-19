import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyImage = ({ src, alt, className }) => {
  console.log(className); // ✅ Correct placement for debugging

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      className={className} 
    />
  );
};

export default LazyImage;
