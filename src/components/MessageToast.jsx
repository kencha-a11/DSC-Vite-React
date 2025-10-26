import { useEffect } from "react";

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
    <div className="fixed top-4 right-4 z-50 animate-slideShake">
      <div
        className={`flex items-center justify-between px-4 py-3 border rounded-lg shadow-md ${colors[type]}`}
      >
        <span>{text}</span>
        <button
          onClick={onClose}
          className="ml-3 text-gray-600 hover:text-gray-900 font-bold"
        >
          ×
        </button>
      </div>

      {/* Slide-in + shake animation */}
      <style>{`
        @keyframes slideShake {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          50% {
            transform: translateX(-10%);
            opacity: 1;
          }
          70% {
            transform: translateX(5%);
          }
          90% {
            transform: translateX(-2%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slideShake {
          animation: slideShake 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
