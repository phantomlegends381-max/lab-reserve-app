import React, { useState, useMemo } from 'react';
import EquipmentCard from './components/EquipmentCard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import CheckoutModal from './components/CheckoutModal';
import { inventory } from './data/inventory';

/**
 * Lab-Reserve Application
 * Professional STEM hardware inventory and checkout system
 * Features:
 * - Advanced search and filtering
 * - Real-time availability tracking
 * - Voltage compatibility warnings
 * - Clean, dark-theme STEM aesthetic
 */

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventoryItems, setInventoryItems] = useState(inventory);

  // Filter and search logic
  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search filter (name + specs)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(searchLower);
        const specMatch = JSON.stringify(item.specs).toLowerCase().includes(searchLower);
        return nameMatch || specMatch;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, inventoryItems]);

  // Handle checkout completion
  const handleCheckoutComplete = () => {
    // In a real app, you'd fetch updated inventory from backend
    // For now, simulate by decrementing the item
    setInventoryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem?.id
          ? { ...item, currentAvailable: Math.max(0, item.currentAvailable - 1) }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stem-900 to-slate-900">
      {/* Navigation Header */}
      <header className="bg-stem-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">🔬 Lab-Reserve</h1>
          <p className="text-stem-100 text-lg">
            Professional STEM prototyping hub. Reserve components, check compatibility, build innovation.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Section: Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-5">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">🔍 Search:</span>
              <SearchBar onSearch={setSearchTerm} />
            </div>

            {/* Category Filter */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-semibold text-gray-700 pt-2">📂 Filter:</span>
              <FilterBar onFilter={setSelectedCategory} />
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600 border-t pt-3">
              Showing <span className="font-bold text-stem-600">{filteredInventory.length}</span> of{' '}
              <span className="font-bold">{inventoryItems.length}</span> items
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onCheckout={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-500 mb-2">📭 No items found</p>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you need.
            </p>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {selectedItem && (
        <CheckoutModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onCheckout={handleCheckoutComplete}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12">
        <p>
          Lab-Reserve © 2026 | Secure STEM Hardware Inventory Management |{' '}
          <a href="#" className="text-stem-400 hover:underline">
            Report Issue
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
