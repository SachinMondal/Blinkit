import { useState } from "react";

export const Modal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const handleSave = () => {
    if (name && details) {
      onSave({ name, details });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Address</h2>
        <input
          type="text"
          placeholder="Address Name (e.g., Home, Office)"
          className="w-full border p-2 rounded-md mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Full Address"
          className="w-full border p-2 rounded-md mb-4"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>
        <div className="flex justify-between">
          <button className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
