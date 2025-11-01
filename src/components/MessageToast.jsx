import { useEffect } from "react";
import { CorrectIcon } from "../../src/components/icons/index"; // adjust path if needed


export default function MessageToast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (message && duration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const { type = "info", text = "" } = message;

  const colors = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-slideDownUp">
      <div
        className={`flex items-center justify-between px-6 py-3 border rounded-lg shadow-md ${colors[type]}`}
      >
        {type === "success" && (
          <CorrectIcon className="w-5 h-5 text-green-600 mr-3" strokeWidth={2} />
        )}
        <span>{text}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-600 hover:text-gray-900 font-bold"
        >
          ×
        </button>
      </div>


      {/* Slide-down + bounce animation */}
      <style>{`
        @keyframes slideDownUp {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          60% {
            transform: translateY(15px);
            opacity: 1;
          }
          80% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-slideDownUp {
          animation: slideDownUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
