import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, fetchUserInfo } from "../../redux/state/auth/Action";
import { User } from "lucide-react";
import { persistor } from "../../redux/store";
const PersonalInfo = () => {
  const dispatch = useDispatch();
  const { user = {}, token, loading } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobileNo: "" });
  const isFirstRender = useRef(true);

  useEffect(() => {
    const waitForPersist = () => {
      if (persistor.getState().bootstrapped) {
        if (token && isFirstRender.current) {
          dispatch(fetchUserInfo(token));
          isFirstRender.current = false;
        }
      } else {
        const unsubscribe = persistor.subscribe(() => {
          if (persistor.getState().bootstrapped) {
            if (token && isFirstRender.current) {
              dispatch(fetchUserInfo(token));
              isFirstRender.current = false;
            }
            unsubscribe(); // Cleanup listener
          }
        });
      }
    };

    waitForPersist();
  }, [dispatch, token]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({ name: user?.name || "", mobileNo: user?.mobileNo || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo" && (!/^\d*$/.test(value) || value.length > 10)) return;
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
    
      <div className="w-full max-w-2xl bg-white rounded-2xl p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold shadow-md">
              {user?.name?.[0]?.toUpperCase() || <User className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Personal Info</h2>
              <p className="text-sm text-gray-500">Manage your profile details</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
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

        {/* Mobile */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
          {editMode ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">+91</span>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
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
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Location</label>
          <p className="text-gray-800 font-medium">
            {typeof user?.location === "string" && user.location.trim()
              ? user.location
              : "Not set"}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              editMode
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            } transition-all duration-300 disabled:opacity-50`}
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
