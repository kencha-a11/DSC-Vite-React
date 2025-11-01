import { RemoveIcon } from "../../icons";

export default function SelectedProductsList({ 
  products, 
  onRemove,
  onCreateClick,
  isCreateDisabled,
  createButtonText,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <h3 className="font-semibold p-4 border-b border-gray-200">
        Selected Items
      </h3>

      {/* Scrollable Product List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {products.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            No products selected yet
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center border border-gray-200 rounded-lg px-2 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="truncate">{p.name}</span>
              </div>
              <button
                onClick={() => onRemove(p.id)}
                className="hover:bg-red-50 rounded p-1"
              >
                <RemoveIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sticky Create Button */}
      <div className="p-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={onCreateClick}
          disabled={isCreateDisabled}
          className={` px-4 py-2 rounded text-white ${
            isCreateDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {createButtonText}
        </button>
      </div>
    </div>
  );
}
