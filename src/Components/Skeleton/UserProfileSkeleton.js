import React from "react";

const UserProfileSkeleton = () => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl p-6 md:p-10 animate-pulse shadow-md space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-300 rounded-full w-12 h-12"></div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-40 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <div className="w-20 h-3 bg-gray-300 rounded"></div>
        <div className="w-full h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <div className="w-20 h-3 bg-gray-300 rounded"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Mobile */}
      <div className="space-y-2">
        <div className="w-28 h-3 bg-gray-300 rounded"></div>
        <div className="w-full h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <div className="w-24 h-3 bg-gray-300 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
