import { useMemo, useState } from 'react';

function searchableText(value) {
  if (Array.isArray(value)) return value.map(searchableText).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(searchableText).join(' ');
  return value == null ? '' : String(value);
}

export function filterSearchItems(items = [], query = '', fields = []) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return Array.isArray(items) ? items : [];

  return (Array.isArray(items) ? items : []).filter((item = {}) => {
    const haystack = fields.length > 0
      ? fields.map((field) => searchableText(item[field])).join(' ')
      : searchableText(item);

    return haystack.toLowerCase().includes(normalizedQuery);
  });
}

export default function SearchBar({
  items,
  fields = ['name', 'sku', 'partNumber', 'category', 'specs', 'specsBanner', 'features', 'voltage'],
  value,
  onSearch,
  onResults,
  placeholder = 'Search Lab-Reserve',
}) {
  const [query, setQuery] = useState('');
  const activeQuery = value ?? query;

  const results = useMemo(() => filterSearchItems(items, activeQuery, fields), [items, activeQuery, fields]);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    onSearch?.(nextValue);
    onResults?.(filterSearchItems(items, nextValue, fields));
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    onResults?.(Array.isArray(items) ? items : []);
  };

  return (
    <div className="w-full">
      <label htmlFor="lab-reserve-search" className="sr-only">
        Search inventory
      </label>
      <div className="flex h-11 w-full overflow-hidden rounded-md border border-gray-400 bg-white shadow-sm focus-within:ring-2 focus-within:ring-yellow-400">
        <select
          aria-label="Search category"
          className="hidden sm:block w-28 border-r border-gray-300 bg-gray-100 px-2 text-sm text-gray-700 outline-none"
          defaultValue="all"
        >
          <option value="all">All</option>
          <option value="mcu">MCUs</option>
          <option value="sensor">Sensors</option>
          <option value="power">Power</option>
        </select>

        <input
          id="lab-reserve-search"
          type="search"
          value={activeQuery}
          placeholder={placeholder}
          onChange={handleChange}
          className="min-w-0 flex-1 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-500"
        />

        {activeQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}

        <button
          type="button"
          className="flex w-12 items-center justify-center bg-yellow-400 text-gray-900 hover:bg-yellow-500"
          aria-label="Search"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.5 3a5.5 5.5 0 0 0-4.38 8.83l-1.65 1.65a1 1 0 1 0 1.41 1.41l1.65-1.65A5.5 5.5 0 1 0 8.5 3Zm-3.5 5.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {Array.isArray(items) && (
        <p className="mt-1 text-xs text-gray-500">
          {results.length} of {items.length} matches
        </p>
      )}
    </div>
  );
}
