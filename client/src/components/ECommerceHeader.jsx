import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'microcontroller', label: 'Microcontrollers' },
  { id: 'sensor', label: 'Sensors' },
  { id: 'actuator', label: 'Actuators' },
  { id: 'prototyping', label: 'Prototyping' },
  { id: 'power', label: 'Power & Supply' },
  { id: 'connectivity', label: 'Connectivity' },
  { id: 'passive', label: 'Passive Components' },
];

function ECommerceHeader({ searchInput, onSearch, onFilter, activeCategory, filteredCount, totalCount }) {
  const { cartCount } = useCart();

  const handleCategoryClick = useCallback((categoryId) => {
    onFilter(categoryId === 'all' ? 'All' : categoryId);
  }, [onFilter]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="bg-white px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-3xl font-bold text-blue-600">Lab-Reserve</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-gray-600 leading-tight">
                PROFESSIONAL
              </span>
              <span className="text-xs text-gray-500">Hardware Store</span>
            </div>
          </Link>

          <div className="flex-grow max-w-2xl">
            <SearchBar
              value={searchInput}
              onSearch={onSearch}
              placeholder="Search products, SKU, or specs..."
            />
          </div>

          <Link
            to="/cart"
            className="relative flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 md:px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${
                  (activeCategory === 'All' && category.id === 'all') ||
                  (activeCategory !== 'All' && activeCategory.toLowerCase().includes(category.id))
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white px-4 py-2 md:px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span> products
        </div>
      </div>
    </header>
  );
}

export default ECommerceHeader;
