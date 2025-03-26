import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, fetchUserInfo } from "../../redux/state/auth/Action";

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const { user = {}, token, loading } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobileNo: "" });
  const isFirstRender = useRef(true);

  // Fetch user info only once when component mounts
  useEffect(() => {
    if (token && isFirstRender.current) {
      dispatch(fetchUserInfo(token));
      isFirstRender.current = false;
    }
  }, [token, dispatch]);

  // Ensure user data is available before updating formData
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      return;
    }
    setFormData((prevFormData) => {
      if (prevFormData.name !== user.name || prevFormData.mobileNo !== user.mobileNo) {
        return { name: user?.name || "", mobileNo: user?.mobileNo || "" };
      }
      return prevFormData;
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
   

    if (name === "mobileNo" && isNaN(value)) {
   
      return;
    }

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
    <div className="rounded-lg">
      <h2 className="text-lg font-bold mb-3">Personal Information</h2>

      {/* Name Field */}
      {editMode ? (
        <fieldset className="border p-2 w-full mb-3 rounded-md relative">
          <label
            className={`absolute left-3 transition-all duration-200 px-1 ${
              formData.name ? "top-[-20px] text-xs text-gray-500" : "top-2 text-gray-500"
            }`}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-2 py-1 outline-none bg-transparent"
          />
        </fieldset>
      ) : (
        <p className="mb-3">
          <strong>Name:</strong> {user?.name || "N/A"}
        </p>
      )}

      {/* Email Field (Non-editable) */}
      <p className="mb-3">
        <strong>Email:</strong> {user?.email || "N/A"}
      </p>

      {/* Phone Field */}
      {editMode ? (
        <fieldset className="border p-2 w-full mb-3 rounded-md relative">
          <label
            className={`absolute left-3 transition-all duration-200 px-1 ${
              formData.mobileNo ? "top-[-20px] text-xs text-gray-500" : "top-2 text-gray-500"
            }`}
          >
            Mobile Number
          </label>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">+91</span>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full px-2 py-1 outline-none bg-transparent"
            />
          </div>
        </fieldset>
      ) : (
        <p className="mb-3">
          <strong>Mobile Number:</strong> +91 {user?.mobileNo || "N/A"}
        </p>
      )}

      <div className="flex justify-between mt-4">
        <button
          className={`px-4 py-2 rounded-md flex items-center ${
            editMode
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold`}
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
