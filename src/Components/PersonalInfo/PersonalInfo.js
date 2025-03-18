const PersonalInfo = ({ user}) => {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-bold mb-3">Personal Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Joined on:</strong> {user.joinDate}</p>
  
        <div className="flex justify-between mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
          //  onClick={onEdit}
           >
            Edit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md" 
          // onClick={onDelete}
          >
            Delete Account
          </button>
        </div>
      </div>
    );
  };
export default PersonalInfo;  