import { Link } from "react-router-dom";


const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Section */}
            <div>
              <h2 className="text-xl font-semibold">Brand</h2>
              <p className="text-gray-400 mt-2">
                Your go-to place for all amazing products.
              </p>
            </div>
  
            {/* Quick as */}
            <div>
              <h3 className="text-lg font-semibold">Quick as</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:underline hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:underline hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:underline hover:text-white">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:underline hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
  
            {/* Support Section */}
            <div>
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:underline hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:underline hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to={'/privacypolicy'} className="text-gray-400 hover:underline hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to={'/termsconditions'} className="text-gray-400 hover:underline hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
  
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="flex space-x-4 mt-3 justify-center">
                <Link href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fa-brands fa-facebook"></i>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fa-brands fa-twitter"></i>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
               
              </div>
            </div>
          </div>
  
          {/* Copyright Section */}
          <div className="text-center border-t border-gray-700 mt-6 pt-4 text-gray-400">
            &copy; {new Date().getFullYear()} Brand. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  