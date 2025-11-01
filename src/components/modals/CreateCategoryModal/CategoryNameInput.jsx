export default function CategoryNameInput({ value, onChange, isDuplicate }) {
  return (
    <div className="flex w-full">
      {/* Title */}
      <h2 className="text-2xl font-medium w-1/4">Add new category</h2>
      {/* Input Category */}
      <input
        type="text"
        placeholder="Enter category name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={` border rounded-xl w-full border-gray-200 w-fu px-3 py-2 focus:outline-none focus:ring ${
          isDuplicate
            ? "border-red-300 focus:border-red-500"
            : "focus:border-blue-300"
        }`}
      />
      {isDuplicate && (
        <p className="text-red-500 text-sm mt-1">
          This category name already exists
        </p>
      )}
    </div>
  );
}