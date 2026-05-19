/**
 * Premium Header Component
 * 
 * DESIGN PHILOSOPHY:
 * - Command Center aesthetic: Bold logo, prominent search, category filters
 * - High-contrast accents (electric blue on dark background)
 * - Search bar is the focal point for discoverability
 * - Category pills for instant filtering
 * 
 * Features:
 * - Live search across product names, SKUs, specs
 * - Filter buttons for instant category switching
 * - Results counter showing filtered/total items
 * - Professional branding
 */

import { useState } from 'react';

const CATEGORIES = [
  'All Products',
  'Microcontroller',
  'Sensor',
  'Actuator',
  'Prototyping',
  'Power',
  'Connectivity',
  'Passive Components',
];

export default function PremiumHeader({ 
  totalItems, 
  filteredItems, 
  onSearch, 
  onFilter,
  activeCategory 
}) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  return (
    <header className="bg-gradient-to-b from-gray-900 to-gray-800 border-b border-blue-500/30 sticky top-0 z-40 shadow-lg">
      {/* TOP BANNER: Logo & Branding */}
      <div className="bg-gray-950 px-6 py-4">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="text-4xl">⚡</span>
          <span>Lab-Reserve</span>
          <span className="text-xl text-blue-400 font-mono">PRO</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Premium Electronics Hardware Storefront | {filteredItems} / {totalItems} Products
        </p>
      </div>

      {/* SEARCH SECTION: Main Discovery Interface */}
      <div className="px-6 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl">
            🔍
          </div>
          <input
            type="text"
            placeholder="Search by product name, SKU, or specs (e.g., 'ESP32', 'I2C', '3.3V')..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-6 py-3 rounded-lg bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* CATEGORY FILTERS: Quick Navigation */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">Filter by Category:</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onFilter(category === 'All Products' ? 'All' : category)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                  activeCategory === (category === 'All Products' ? 'All' : category)
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-300'
                }`}
              >
                {category.split(' ')[0]}
                {category.includes(' ') && ` ${category.split(' ').pop().charAt(0)}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
