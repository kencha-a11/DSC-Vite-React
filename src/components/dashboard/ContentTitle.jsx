// src/components/dashboard/ContentTitle.jsx
import { useAuth } from "../../context/AuthContext";

const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

export default function ContentTitle({ Title }) {
  const { user } = useAuth(); // get authenticated user
  console.log('this is the user', user)

  if (!user) return null; // optional: handle loading/no user

  return (
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <h2 className="text-xl font-semibold text-gray-900">{Title}</h2>
      <button className="flex items-center gap-3 px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">
        <span className="text-gray-700 font-medium">{user.name}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitial(user.name)
          )}
        </div>
      </button>
    </div>
  );
}
