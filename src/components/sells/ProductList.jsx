export default function ProductList({ products, onAdd, search, setSearch, categories, selectedCategory, setSelectedCategory }) {
    return (
        <div className="flex-1 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-2xl font-semibold">Sell</h2>
            </div>

            <div className="p-4 border-b flex gap-3">
                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-40 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="flex-1 overflow-y-auto divide-y">
                {products.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 py-8">No products found</div>
                ) : (
                    products.map((p) => <ProductRow key={p.id} product={p} onAdd={handleAddToCartFromList} getStockFor={getStockFor} />)
                )}
            </div>
        </div>
    );
}
