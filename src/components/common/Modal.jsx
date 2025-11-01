export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "2xl"
}) {
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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative z-10 ${maxWidthClasses[maxWidth]} w-full bg-white shadow-xl border-2 border-pink-800 rounded-lg max-h-[90vh] overflow-y-auto`}>

        <div className="border-b-2 border-gray-200">
          {title && (
            <h1 className="text-2xl font-bold text-gray-800 p-6">{title}</h1>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
