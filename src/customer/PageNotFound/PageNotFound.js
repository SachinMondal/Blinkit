import LazyImage from "../../Components/utils/LazyLoading/LazyLoading";
import PageNotFoundImage from "../../images/pagenotfound.png";
const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-800">
       <LazyImage src={PageNotFoundImage} alt="Empty" className="w-30 h-48" />
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
 
    </div>
  );
};

export default PageNotFound;
