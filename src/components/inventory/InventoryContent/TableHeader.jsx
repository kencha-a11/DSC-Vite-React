export default function TableHeader({ selectedCategory, statusFilter, setState, categories }) {
  return (
    <div className="border-y border-gray-200 bg-gray-100 py-3 select-none">
      <div className="grid grid-cols-[80px_2fr_120px_1fr_1.5fr_1fr_80px] items-center text-gray-600 font-medium text-sm px-8">
        <div>Image</div>
        <div>Product Name</div>
        <div>Price</div>
        <div>Quantity</div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setState("selectedCategory", e.target.value)}
          className="border rounded px-2 py-1 text-sm bg-white mr-2 border-gray-200"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.category_name}>
              {c.category_name}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            // 💡 Convert to lowercase to match backend exactly
            const value = e.target.value.toLowerCase();
            console.log("Status selected:", value); // Debug
            setState("statusFilter", value);
          }}
          className="border rounded px-2 py-1 text-sm bg-white border-gray-200"
        >
          <option value="">Status</option>
          {/* 💡 These must match backend status strings exactly */}
          {["stock", "low stock", "out of stock"].map((s) => (
            <option key={s} value={s.toLowerCase()}>
              {s}
            </option>
          ))}
        </select>


        <div className="text-right">Actions</div>
      </div>
    </div>
  );
}
