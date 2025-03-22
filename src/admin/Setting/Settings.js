import ProfileSettings from "./ProfileSettings";
import StorePreferences from "./StorePreferences";
import NotificationSettings from "./NotificationSettings";

const Settings = () => {
  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Settings
      </h1>

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <ProfileSettings />
        </div>

        {/* Store Preferences */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <StorePreferences />
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <NotificationSettings />
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-red-500 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
