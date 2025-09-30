// src/components/accounts/SearchBar.jsx
import { SearchIcon } from "../icons";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative mb-4">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <SearchIcon />
      </span>
      <input
        type="text"
        placeholder="Search account"
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-8 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
}
