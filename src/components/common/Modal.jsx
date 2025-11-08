export default function Modal({ isOpen, onClose, title, children, maxWidth = "2xl" }) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay: LOWER z-index */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal Content: HIGHER z-index */}
      <div
        className={`relative z-50 w-[112vh]  h-[58vh] ${maxWidthClasses[maxWidth]} bg-white shadow-xl border-2 border-purple-500 rounded-lg max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        {title && (
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
        )}

        {/* Body */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}
