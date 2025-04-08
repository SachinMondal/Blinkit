import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, editAddress } from "../../redux/state/address/Action";

export const Modal = ({ onClose, editingAddress = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.address);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && (!/^\d*$/.test(value) || value.length > 10))
      return;
    if (name === "zipCode" && (!/^\d*$/.test(value) || value.length > 6))
      return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, mobile, streetAddress, city, state, zipCode } =
      formData;

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (mobile.length !== 10) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!streetAddress.trim())
      errors.streetAddress = "Street address is required";
    if (!city.trim()) errors.city = "City is required";
    if (!state.trim()) errors.state = "State is required";
    if (!zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    } else if (zipCode.length !== 6) {
      errors.zipCode = "Zip code must be of 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingAddress) {
      dispatch(editAddress(editingAddress._id, formData, onClose));
    } else {
      dispatch(addNewAddress(formData, onClose));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg md:max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border p-2 rounded-md w-full"
              value={formData.firstName}
              onChange={handleChange}
            />
            {formErrors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border p-2 rounded-md w-full"
              value={formData.lastName}
              onChange={handleChange}
            />
            {formErrors.lastName && (
              <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            className="border p-2 rounded-md w-full"
            value={formData.mobile}
            onChange={handleChange}
          />
          {formErrors.mobile && (
            <p className="text-sm text-red-500 mt-1">{formErrors.mobile}</p>
          )}
        </div>

        <div className="mt-4">
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            className="border p-2 rounded-md w-full"
            value={formData.streetAddress}
            onChange={handleChange}
          />
          {formErrors.streetAddress && (
            <p className="text-sm text-red-500 mt-1">
              {formErrors.streetAddress}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <input
              type="text"
              name="city"
              placeholder="City"
              className="border p-2 rounded-md w-full"
              value={formData.city}
              onChange={handleChange}
            />
            {formErrors.city && (
              <p className="text-sm text-red-500 mt-1">{formErrors.city}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="state"
              placeholder="State"
              className="border p-2 rounded-md w-full"
              value={formData.state}
              onChange={handleChange}
            />
            {formErrors.state && (
              <p className="text-sm text-red-500 mt-1">{formErrors.state}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              className="border p-2 rounded-md w-full"
              value={formData.zipCode}
              onChange={handleChange}
            />
            {formErrors.zipCode && (
              <p className="text-sm text-red-500 mt-1">{formErrors.zipCode}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md w-1/3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md w-1/3 disabled:opacity-50 flex items-center justify-center"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <div className="flex space-x-1">
                <span
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></span>
                <span
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            ) : editingAddress ? (
              "Update"
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
