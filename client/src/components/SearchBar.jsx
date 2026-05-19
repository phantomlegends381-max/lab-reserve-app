/**
 * SearchBar Component
 * Provides real-time search filtering by hardware name and specs
 */

export default function SearchBar({ onSearch }) {
  return (
    <div className="flex-1">
      <input
        type="text"
        placeholder="Search hardware by name or specs..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stem-600"
      />
    </div>
  );
}
