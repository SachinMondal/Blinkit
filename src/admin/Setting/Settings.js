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
  const isLoading = users.length === 0;

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
    const newRole = user.role === "admin" ? "user" : "admin";
    dispatch(updateUserRole(user._id, newRole));
  };

  const adminUsers = users.filter((u) => u.role === "admin");
  const normalUsers = users.filter((u) => u.role !== "admin");

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center sm:text-left">
        Settings
      </h1>

      {/* Profile Overview */}
      <div className="bg-white shadow-sm border rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4 text-green-700">
          Your Profile
        </h2>

        {currentUser && currentUser.name ? (
          <ProfileSettings data={currentUser} />
        ) : (
          <div className="text-center py-6 text-gray-500">Loading profile...</div>
        )}
      </div>

      {/* Users Management */}
      <div className="bg-white shadow-sm border rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4 text-green-700">
          Manage Users
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-500 py-6">Loading users...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admins */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                Admins
              </h3>
              {adminUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No admin users.</p>
              ) : (
                <div className="space-y-3">
                  {adminUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between bg-gray-50 border rounded-md p-3"
                    >
                      <span className="text-xs text-gray-800">
                        {user.name} ({user.email})
                      </span>
                      {user._id !== currentUser._id && (
                        <button
                          className="text-xs text-red-600 hover:text-red-700 transition"
                          title="Remove admin access"
                          onClick={() => handleAdminToggle(user)}
                        >
                          Remove Admin
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Normal Users */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                Users
              </h3>
              {normalUsers.length === 0 ? (
                <p className="text-xs text-gray-500">No normal users.</p>
              ) : (
                <div className="space-y-3">
                  {normalUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between bg-gray-50 border rounded-md p-3"
                    >
                      <span className="text-xs text-gray-800">
                        {user.name} ({user.email})
                      </span>
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700 transition"
                        title="Make admin"
                        onClick={() => handleAdminToggle(user)}
                      >
                        Make Admin
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={logoutUser}
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
