import { useState } from "react";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    password: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-md shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border rounded-md"
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-3 border rounded-md"
        />
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full p-3 border rounded-md"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
