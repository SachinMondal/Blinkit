import React from "react";
const avatars = [
    { id: 1, name: "Remy Sharp", src: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Travis Howard", src: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Cindy Baker", src: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, name: "Agnes Walker", src: "https://randomuser.me/api/portraits/women/4.jpg" },
    { id: 5, name: "Trevor Henderson", src: "https://randomuser.me/api/portraits/men/5.jpg" }
  ];
const AvatarGroup = ({  max = 3 }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition hover:animate-bounce">
        {/* Display up to `max` avatars */}
        <div className="flex -space-x-2">
          {avatars.slice(0, max).map((avatar) => (
            <img
              key={avatar.id}
              src={avatar.src}
              alt={avatar.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
          ))}
        </div>

        {/* Show "+X" if more avatars exist */}
        {avatars.length > max && (
          <span className="text-gray-700 font-semibold text-sm px-2 py-1 bg-gray-200 rounded-full">
            +{avatars.length - max}
          </span>
        )}

        {/* Dropdown Carat (▼) */}
        <i class="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

export default AvatarGroup;
