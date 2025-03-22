import { useState } from "react";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
  });

  const handleChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  return (
    <div className="bg-white p-6 rounded-md shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="emailAlerts"
            checked={notifications.emailAlerts}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span>Enable Email Alerts</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="smsAlerts"
            checked={notifications.smsAlerts}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span>Enable SMS Alerts</span>
        </label>

        <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
          Save Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
