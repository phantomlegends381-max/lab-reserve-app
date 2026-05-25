/**
 * E-COMMERCE HEADER COMPONENT
 * 
 * Professional shopping site header with:
 * - Logo + branding
 * - Search bar
 * - Category filters
 * - Cart icon with dynamic badge
 * 
 * DESIGN:
 * - Clean white background (bg-white)
 * - Professional typography
 * - Sticky positioning (z-30)
 * - Subtle drop shadow on scroll
 * - Blue accent color (#1F40AF or #0066FF)
 * 
 * ACCESSIBILITY:
 * - High contrast text (white bg, gray text)
 * - Cart icon has aria-label
 * - Search input is clearly labeled
 */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * CATEGORY FILTERS
 * Define available hardware categories for filtering
 */
const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '📦' },
  { id: 'microcontroller', label: 'Microcontrollers', icon: '🎯' },
  { id: 'sensor', label: 'Sensors', icon: '📡' },
  { id: 'actuator', label: 'Actuators', icon: '⚙️' },
  { id: 'prototyping', label: 'Prototyping', icon: '🔌' },
  { id: 'power', label: 'Power & Supply', icon: '🔋' },
  { id: 'connectivity', label: 'Connectivity', icon: '📶' },
  { id: 'passive', label: 'Passive Components', icon: '⚛️' }
];

function ECommerceHeader({ searchInput, onSearch, onFilter, activeCategory, filteredCount, totalCount }) {
  // ===== STATE =====
  const { cartCount } = useCart();

  // ===== MEMOIZED HANDLERS =====
  /**
   * handleSearch
   * Triggers search callback immediately (debouncing happens in parent)
   */
  const handleSearch = useCallback((e) => {
    onSearch(e.target.value);
  }, [onSearch]);

  /**
   * handleCategoryClick
   * Triggers filter callback when category selected
   */
  const handleCategoryClick = useCallback((categoryId) => {
    onFilter(categoryId === 'all' ? 'All' : categoryId);
  }, [onFilter]);

  // ===== RENDER =====
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      {/* TOP BAR: Logo + Search + Cart */}
      <div className="bg-white px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* LOGO & BRANDING */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-3xl font-bold text-blue-600">
              ⚡ Lab-Reserve
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-gray-600 leading-tight">
                PROFESSIONAL
              </span>
              <span className="text-xs text-gray-500">
                Hardware Store
              </span>
            </div>
          </Link>

          {/* SEARCH BAR - Centered, prominent */}
          <div className="flex-grow max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, SKU, or specs..."
                value={searchInput}
                onChange={handleSearch}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <span className="absolute right-3 top-3 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* CART ICON WITH BADGE */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            {/* CART ICON */}
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {/* BADGE: Shows cart item count */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* CATEGORY FILTER BAR */}
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
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS COUNTER */}
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
