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

  // Prefill form data when editing
  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { firstName, lastName, mobile, streetAddress, city, state, zipCode } = formData;

    if (firstName && lastName && mobile && streetAddress && city && state && zipCode) {
      if (editingAddress) {
        dispatch(editAddress(editingAddress._id, formData, onClose)); 
      } else {
        dispatch(addNewAddress(formData, onClose));
      }
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
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="border p-2 rounded-md w-full"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="border p-2 rounded-md w-full"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className="border p-2 rounded-md w-full mt-4"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          type="text"
          name="streetAddress"
          placeholder="Street Address"
          className="border p-2 rounded-md w-full mt-4"
          value={formData.streetAddress}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="border p-2 rounded-md w-full"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            className="border p-2 rounded-md w-full"
            value={formData.state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            className="border p-2 rounded-md w-full"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-gray-400 text-white px-4 py-2 rounded-md w-1/3" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md w-1/3"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : editingAddress ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
