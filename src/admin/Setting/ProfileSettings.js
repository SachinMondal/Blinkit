import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/state/auth/Action";


const ProfileSettings = ({ data }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    name: data.name || "",
    email: data.email || "",
    mobileNo: data.mobileNo || "",
    password: "", 
  });

  const [editable, setEditable] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleSave = async () => {
    const updatedData = {
      name: profile.name,
      mobileNo: profile.mobileNo,
      ...(profile.password && { password: profile.password }),
    };

    await dispatch(updateProfile(updatedData));
    setEditable(false); 
  };

  return (
    <div className="bg-white p-6 rounded-md shadow mb-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Profile Settings</h2>
        {!editable ? (
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={handleEditClick}
          >
            Edit
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          disabled={!editable}
          placeholder="Full Name"
          className={`w-full p-3 border rounded-md ${!editable && "bg-gray-100 cursor-not-allowed"}`}
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          disabled 
          placeholder="Email Address"
          className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          name="mobileNo"
          value={profile.mobileNo}
          onChange={handleChange}
          disabled={!editable}
          placeholder="Mobile Number"
          className={`w-full p-3 border rounded-md ${!editable && "bg-gray-100 cursor-not-allowed"}`}
        />
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          disabled={!editable}
          placeholder="New Password (optional)"
          className={`w-full p-3 border rounded-md ${!editable && "bg-gray-100 cursor-not-allowed"}`}
        />

        {editable && (
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full ${
              loading && "opacity-50 cursor-wait"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
