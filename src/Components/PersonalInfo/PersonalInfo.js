import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, fetchUserInfo } from "../../redux/state/auth/Action";

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const { user = {}, token, loading } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobileNo: "" });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (token && isFirstRender.current) {
      dispatch(fetchUserInfo(token));
      isFirstRender.current = false;
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({ name: user?.name || "", mobileNo: user?.mobileNo || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo" && isNaN(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async () => {
    if (editMode) {
      const response = await dispatch(updateProfile(formData));
      if (response?.success) {
        await dispatch(fetchUserInfo(token));
      }
    }
    setEditMode(!editMode);
  };

  return (
    <div className="rounded-lg max-w-xl mx-auto bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-5 border-b pb-2">
        Personal Information
      </h2>

      {/* Name */}
      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-1">Name</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="Enter your name"
          />
        ) : (
          <p className="text-gray-800 font-medium">{user?.name || "N/A"}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <p className="text-gray-800 font-medium">{user?.email || "N/A"}</p>
      </div>

      {/* Mobile Number */}
      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-1">
          Mobile Number
        </label>
        {editMode ? (
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">+91</span>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter your mobile number"
            />
          </div>
        ) : (
          <p className="text-gray-800 font-medium">
            +91 {user?.mobileNo || "N/A"}
          </p>
        )}
      </div>
      {/* Location */}
      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-1">Location</label>
        <p className="text-gray-800 font-medium">
  {typeof user?.location === "string" && user.location.trim()
    ? user.location
    : "Not set"}
</p>

      </div>

      {/* Button */}
      <div className="flex justify-end mt-6">
        <button
          className={`px-5 py-2 rounded-md font-semibold text-white ${
            editMode
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-all disabled:opacity-50`}
          onClick={handleEdit}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4 mr-2"></span>
              Saving...
            </div>
          ) : editMode ? (
            "Save"
          ) : (
            "Edit"
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
