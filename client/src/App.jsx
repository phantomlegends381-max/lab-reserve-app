/**
 * Lab-Reserve PREMIUM Edition
 * 
 * DESIGN PHILOSOPHY & ARCHITECTURE:
 * 
 * 1. VISUAL IDENTITY: "Command Center" Dark-Theme Storefront
 *    - Dark gray background (#111827) with blue accents (#0066FF, #00FF00)
 *    - Mimics: Amazon + Adafruit + SparkFun + Hackathon UI
 *    - Professional electronics retailer aesthetic
 * 
 * 2. LAYOUT STRUCTURE:
 *    - Sticky Header: Search + Filters (always visible)
 *    - Responsive Product Grid: 1→2→3-4 columns
 *    - Empty State: Helpful messaging when no products match
 *    - Footer: Professional branding
 * 
 * 3. STATE MANAGEMENT:
 *    - Inventory: All 20+ products from premiumInventory
 *    - Search: Real-time filtering by name, SKU, specs
 *    - Category Filter: Instant reorganization
 *    - Side Drawer: Toggle with selected product
 * 
 * 4. INTERACTIONS:
 *    - Click product card → Side drawer opens
 *    - Drawer overlay → Close on backdrop click
 *    - Form submission → API integration (backend checkout)
 * 
 * 5. PERFORMANCE OPTIMIZATION:
 *    - useMemo for filtered results (avoids recalculation)
 *    - PremiumProductCard only renders if image exists
 *    - Efficient event handlers
 * 
 * 6. PRODUCTION COMMENTS:
 *    - Each function includes purpose & responsibility
 *    - CSS classes documented for maintainability
 *    - Error states handled gracefully
 */

import React, { useState, useMemo } from 'react';
import PremiumHeader from './components/PremiumHeader';
import PremiumProductCard from './components/PremiumProductCard';
import SideDrawerCheckout from './components/SideDrawerCheckout';
import { premiumInventory } from './data/premiumInventory';

function App() {
  // ===== STATE MANAGEMENT =====
  // searchTerm: Current search query (name, SKU, specs)
  const [searchTerm, setSearchTerm] = useState('');
  
  // selectedCategory: Active category filter (default: 'All')
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // selectedProduct: Product object for side drawer checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // isDrawerOpen: Controls side drawer visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // inventoryList: Local inventory state (can be updated after checkout)
  const [inventoryList, setInventoryList] = useState(premiumInventory);

  // ===== FILTERED RESULTS COMPUTATION =====
  // Uses useMemo to prevent recalculation on every render
  // Combines category filter + search term matching
  const filteredProducts = useMemo(() => {
    return inventoryList.filter((product) => {
      // STEP 1: Category filtering
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // STEP 2: Search filtering (case-insensitive)
      // Searches across: name, SKU, specs, features
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const skuMatch = product.sku.toLowerCase().includes(searchLower);
        const specsMatch = product.specsBanner.toLowerCase().includes(searchLower);
        const featuresMatch = product.features.toLowerCase().includes(searchLower);
        const voltageMatch = product.voltage?.toLowerCase().includes(searchLower);
        
        return nameMatch || skuMatch || specsMatch || featuresMatch || voltageMatch;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, inventoryList]);

  // ===== EVENT HANDLERS =====

  /**
   * handleProductReserve
   * Opens side drawer when user clicks "Reserve Now" on a product card
   * 
   * @param {Object} product - Selected product object
   */
  const handleProductReserve = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  /**
   * handleCheckoutSuccess
   * Callback after successful checkout via API
   * In a real app, would refresh inventory from backend
   * For now, simulates by decrementing local state
   * 
   * @returns {void}
   */
  const handleCheckoutSuccess = () => {
    if (selectedProduct) {
      setInventoryList((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, currentAvailable: Math.max(0, item.currentAvailable - 1) }
            : item
        )
      );
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* HEADER: Sticky Search & Filters */}
      <PremiumHeader
        totalItems={inventoryList.length}
        filteredItems={filteredProducts.length}
        onSearch={setSearchTerm}
        onFilter={setSelectedCategory}
        activeCategory={selectedCategory}
      />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* PRODUCT GRID: Responsive layout */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <PremiumProductCard
                key={product.id}
                product={product}
                onReserve={handleProductReserve}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE: No products match filters */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-3xl font-bold text-white mb-2">No Products Found</h2>
            <p className="text-gray-400 max-w-md">
              No products match your search or filter criteria. Try adjusting your search terms or category filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg transition-all"
            >
              ↻ Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* FOOTER: Professional branding */}
      <footer className="bg-gray-950 border-t border-blue-500/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>
            ⚡ Lab-Reserve PRO | Professional STEM Hardware Inventory System
          </p>
          <p className="mt-2">
            © 2026 | Secure Electronics Checkout | 
            <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">
              Support
            </a>
          </p>
        </div>
      </footer>

      {/* SIDE DRAWER: Checkout panel */}
      {selectedProduct && (
        <SideDrawerCheckout
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onCheckout={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}

export default App;
