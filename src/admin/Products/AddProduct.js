import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = ["Add Product", "Basic Details", "Additional Details", "Add Variant", "Review & Submit"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    image: null,
    productName: "",
    productDescription: "",
    weight: "",
    shelfLife: "",
    netQty: "",
    vegNonVeg: "",
    size: "",
    price: "",
    mrp: "",
    countryOfOrigin: "",
    packerDetails: "",
    brand: "",
    variantSize: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? e.target.files[0] : value,
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const handleSubmit = () => navigate("/admin/products/summary", { state: formData });

  return (
    <div className="w-full min-h-screen px-4 sm:px-12 py-10">
      {/* Stepper */}
      <div className="relative flex items-center justify-between mb-10">
        {steps.map((label, index) => (
          <div key={index} className="relative flex-1 text-center">
            {/* Stepper Circle */}
            <div className={`mx-auto flex items-center justify-center rounded-full text-white font-bold
              ${step > index + 1 ? "bg-green-500" : step === index + 1 ? "bg-blue-500" : "bg-gray-400"}
              w-8 h-8 sm:w-12 sm:h-12 text-xs sm:text-sm`}>
              {index + 1}
            </div>
            {/* Step Label */}
            <p className="text-xs sm:text-sm mt-2">{label}</p>

            {/* Stepper Line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-4 sm:top-5 left-1/2 transform -translate-x-10 
              h-1 ${step > index + 1 ? "bg-green-500" : "bg-gray-300"} w-[4rem] sm:w-[20rem]`}
              style={{ zIndex: -1 }}></div>
            )}
          </div>
        ))}
      </div>

      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6">{steps[step - 1]}</h1>

      {/* Step Content */}
      <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block font-semibold mb-1 text-sm">Category</label>
              <input name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Product Image</label>
              <input type="file" name="image" onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Product Name</label>
              <input name="productName" value={formData.productName} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold mb-1 text-sm">Product Description</label>
              <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} className="border p-2 rounded w-full h-20 sm:h-24 text-sm" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block font-semibold mb-1 text-sm">Weight</label>
              <input name="weight" value={formData.weight} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Shelf Life</label>
              <input name="shelfLife" value={formData.shelfLife} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Net Qty</label>
              <input name="netQty" value={formData.netQty} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Veg/Non-Veg</label>
              <select name="vegNonVeg" value={formData.vegNonVeg} onChange={handleChange} className="border p-2 rounded w-full text-sm">
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block font-semibold mb-1 text-sm">Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="block font-semibold mb-1 text-sm">Size / Free Size</label>
            <input name="variantSize" value={formData.variantSize} onChange={handleChange} className="border p-2 rounded w-full text-sm" />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button onClick={prevStep} className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-gray-600">Back</button>
        ) : (
          <button onClick={() => navigate("/")} className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-gray-600">Cancel</button>
        )}
        {step < 4 ? (
          <button onClick={nextStep} className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-blue-600">Next</button>
        ) : (
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-green-600">Review & Submit</button>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
