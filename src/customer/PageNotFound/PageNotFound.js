import { Link } from "react-router-dom";
import PageNotFoundImage from "../../images/pagenotfound.png";
const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-800">
       <img src={PageNotFoundImage} alt="Empty" className="w-30 h-48" />
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;
