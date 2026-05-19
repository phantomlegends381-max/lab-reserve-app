/**
 * FilterBar Component
 * Category filtering with active state indicators
 */

import { useState } from 'react';

const CATEGORIES = [
  'All',
  'Microcontroller',
  'Sensor',
  'Prototyping',
  'Power',
  'Connectivity',
];

export default function FilterBar({ onFilter }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const handleFilter = (category) => {
    setActiveCategory(category);
    onFilter(category);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeCategory === category
              ? 'bg-stem-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
