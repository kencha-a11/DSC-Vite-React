import React, { useEffect } from "react";

export default function DualPanelModal({ isOpen, onClose, topPanel, leftPanel, rightPanel }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  {/* Modal Container */}
  <div
    className="relative bg-white w-11/12 max-w-6xl h-4/5 shadow-lg flex flex-col overflow-hidden border-2 rounded-xl border-pink-800"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Top Panel */}
    {topPanel && (
      <div className="p-4 border-b border-gray-200 min-h-[60px]">
        {topPanel}
      </div>
    )}

    {/* Main Content - Two Panels */}
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel */}
      {leftPanel && (
        <div className="w-1/2 flex flex-col border-r border-gray-200 overflow-auto">
          {leftPanel}
        </div>
      )}

      {/* Right Panel */}
      {rightPanel && (
        <div className="w-1/2 flex flex-col overflow-auto">
          {rightPanel}
        </div>
      )}
    </div>
  </div>
</div>

  );
}
