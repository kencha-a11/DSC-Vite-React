import MessageToast from "../../MessageToast";
import { useState, useEffect } from 'react'; // Import useState

export default function CategoryNameInput({ value, onChange, isDuplicate }) {
  // Add state to manage the toast visibility and content
  // In a real app, this might be managed higher up, but this fixes the immediate issue.
  const [toastMessage, setToastMessage] = useState(null);

  // Use useEffect to show the toast when a duplicate is detected
  useEffect(() => {
    if (isDuplicate) {
      setToastMessage({
        type: 'error',
        text: 'This category name already exists.',
      });
    } else if (toastMessage) {
      // Hide the toast if the duplicate condition is no longer true
      setToastMessage(null);
    }
  }, [isDuplicate]);

  // Function to close the toast (passed to MessageToast)
  const handleCloseToast = () => {
    setToastMessage(null);
  };

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

      {/* Renders the toast if toastMessage is not null */}
      {toastMessage && (
        <MessageToast 
          message={toastMessage} 
          onClose={handleCloseToast} 
          duration={3000} // Optional: Explicitly set duration if needed
        />
      )}
    </div>
  );
}