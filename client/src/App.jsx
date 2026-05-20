/**
 * LAB-RESERVE: E-COMMERCE EDITION
 * 
 * TRANSFORMATION: From dark "Command Center" → Professional E-Commerce Site
 * 
 * DESIGN PHILOSOPHY:
 * - Light, clean white aesthetic (Amazon + DigiKey style)
 * - Professional typography and spacing
 * - Trust-building design elements
 * - Smooth shopping experience
 * - High-quality product presentation
 * 
 * ARCHITECTURE:
 * - React Router for multi-page navigation
 * - CartContext for global cart state
 * - Responsive product grid
 * - Dedicated cart page for checkout
 * - Professional header with search + filters
 * 
 * PAGES:
 * 1. Storefront (/) - Product grid with filters and search
 * 2. Cart (/cart) - Review items, adjust quantities, checkout
 * 
 * STATE MANAGEMENT:
 * - CartContext: Global shopping cart state
 * - Local state: Search, category filters, loading
 */

import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ECommerceHeader from './components/ECommerceHeader';
import ECommerceProductCard from './components/ECommerceProductCard';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import { premiumInventory } from './data/premiumInventory';

/**
 * StorefrontPage
 * Main product browsing and shopping page
 */
function StorefrontPage() {
  // ===== STATE =====
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ===== FILTERING LOGIC =====
  // useMemo optimizes filtering to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return premiumInventory.filter((product) => {
      // STEP 1: Category filtering
      if (selectedCategory !== 'All') {
        const categoryMatch = product.category.toLowerCase().includes(
          selectedCategory.toLowerCase()
        );
        if (!categoryMatch) return false;
      }

      // STEP 2: Search filtering (multiple fields)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        
        const matches = [
          product.name.toLowerCase(),
          product.sku.toLowerCase(),
          product.specsBanner.toLowerCase(),
          product.features.toLowerCase(),
          product.voltage?.toLowerCase()
        ];

        const hasMatch = matches.some((field) =>
          field.includes(searchLower)
        );

        if (!hasMatch) return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory]);

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <ECommerceHeader
        onSearch={setSearchTerm}
        onFilter={setSelectedCategory}
        activeCategory={selectedCategory}
        filteredCount={filteredProducts.length}
        totalCount={premiumInventory.length}
      />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ECommerceProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600 max-w-md">
              No products match your search or filter. Try adjusting your search terms or category selections.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              ↻ Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p className="font-semibold text-gray-900">
            ⚡ Lab-Reserve Pro | Professional STEM Hardware Store
          </p>
          <p className="mt-2">
            © 2026 Lab-Reserve. All Rights Reserved. |{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * App
 * Main application component with routing and cart context
 */
function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StorefrontPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
