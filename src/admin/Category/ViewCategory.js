import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ViewCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;

  if (!category) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "#FAF9F6" }}
      >
        <p className="text-gray-500 text-lg">No category selected or data not available.</p>
        <button
          onClick={() => navigate("/admin/category")}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Back to Categories
        </button>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen w-full p-6 md:p-12"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <header className="flex justify-end mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 focus:outline-none"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
          <span className="font-semibold text-lg">Back</span>
        </button>
      </header>

      <section className="flex flex-col md:flex-row gap-12">
        {/* Image */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-[400px] object-contain rounded-lg shadow-md"
            />
          ) : (
            <p className="italic text-gray-400 text-center">No image available.</p>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">{category.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {category.description || "No description provided."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 font-medium text-lg">
            <div>
              <span className="block font-semibold mb-1">Status:</span>
              <span
                className={`capitalize ${
                  category.status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {category.status || "Unknown"}
              </span>
            </div>
            <div>
              <span className="block font-semibold mb-1">Discount:</span>
              <span>{category.discountPercentage ?? 0}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Info */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 text-gray-800 text-lg">
        <div>
          <h3 className="font-semibold mb-2">SEO Title</h3>
          <p className="text-gray-600">{category.seoTitle || "Not set"}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">SEO Description</h3>
          <p className="text-gray-600">{category.seoDescription || "Not set"}</p>
        </div>
      </section>

      {/* Tags */}
      <section className="mt-12">
        <h3 className="font-semibold mb-4 text-gray-700 text-xl">Tags & Properties</h3>
        <div className="flex flex-wrap gap-4">
          {category.isBestseller && <Tag label="Bestseller" color="#DBEAFE" text="#1E40AF" />}
          {category.isFeatured && <Tag label="Featured" color="#EDE9FE" text="#6B21A8" />}
          {category.isSale && <Tag label="Sale" color="#FECACA" text="#B91C1C" />}
          {category.isSpecial && <Tag label="Special" color="#D1FAE5" text="#065F46" />}
          {category.isVisible && <Tag label="Visible" color="#D1FAE5" text="#065F46" />}
          {category.newArrivals && <Tag label="New Arrivals" color="#FEF9C3" text="#92400E" />}
          {category.isHomePageVisible && (
            <Tag label="Home Page Visible" color="#E0E7FF" text="#3730A3" />
          )}
          {category.isParent && <Tag label="Parent Category" color="#CCFBF1" text="#0F766E" />}
        </div>
      </section>
    </main>
  );
};

const Tag = ({ label, color, text }) => {
  return (
    <span
      style={{ backgroundColor: color, color: text }}
      className="px-4 py-1 rounded-full text-sm font-semibold select-none shadow-sm"
    >
      {label}
    </span>
  );
};

export default ViewCategory;
