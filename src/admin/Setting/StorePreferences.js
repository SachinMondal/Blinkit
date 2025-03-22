import { useState } from "react";

const StorePreferences = () => {
  const [preferences, setPreferences] = useState({
    currency: "USD",
    language: "English",
    theme: "light",
  });

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-md shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Store Preferences</h2>
      <div className="space-y-4">
        <select
          name="currency"
          value={preferences.currency}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="INR">INR (₹)</option>
        </select>

        <select
          name="language"
          value={preferences.language}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>

        <select
          name="theme"
          value={preferences.theme}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        >
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>

        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default StorePreferences;
