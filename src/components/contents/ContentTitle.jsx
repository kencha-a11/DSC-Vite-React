// src/components/dashboard/ContentTitle.jsx
import ProfileButton from "../ProfileButton";

export default function ContentTitle({ Title }) {
  return (
    <div className="sticky top-0 z-50 flex justify-between items-center px-4 py-4 bg-white shadow-sm">
      <div className="text-2xl font-bold text-gray-900">{Title}</div>
      <ProfileButton />
    </div>
  );
}
