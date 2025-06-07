import { useSelector, useDispatch } from "react-redux";
import ProfileSettings from "./ProfileSettings";
import { useEffect } from "react";
import {
  fetchAllUsers,
  fetchUserInfo,
  logout,
  updateUserRole,
} from "../../redux/state/auth/Action";

const Settings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user) || {};
  const users = useSelector((state) => state.auth.users || []);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch, users.length]);
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const logoutUser = () => {
    dispatch(logout());
  };
  const handleAdminToggle = (user) => {
    if (user.role === "admin") {
      dispatch(updateUserRole(user._id, "user"));
    } else {
      dispatch(updateUserRole(user._id, "admin"));
    }
  };

  const adminUsers = users.filter((u) => u.role === "admin");
  const normalUsers = users.filter((u) => u.role !== "admin");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-800 text-center sm:text-left">
        Settings
      </h1>

      {/* Profile Overview */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4">Your Profile</h2>

        {currentUser && currentUser.name ? (
          <ProfileSettings data={currentUser} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Loading profile...
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4">All Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Admins</h3>
            <div className="space-y-3">
              {adminUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-md md:text-sm"
                >
                  <span>
                    {user.name} ({user.email})
                  </span>
                  {user._id !== currentUser._id && (
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleAdminToggle(user)}
                    >
                      Remove Admin
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Users</h3>
            <div className="space-y-3">
              {normalUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-md md:text-sm"
                >
                  <span>
                    {user.name} ({user.email})
                  </span>
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => handleAdminToggle(user)}
                  >
                    Make Admin
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-red-600 transition"
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
