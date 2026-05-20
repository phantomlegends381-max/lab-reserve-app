/**
 * E-COMMERCE PRODUCT CARD
 * 
 * Professional product card for storefront display
 * 
 * Features:
 * - High-quality product image with fallback placeholder
 * - Price badge (prominent, top-left)
 * - Stock status indicator (color-coded)
 * - Product title and SKU
 * - Detailed specs/voltage display
 * - Features description
 * - "Add to Cart" button
 * - Hover effects (lift, shadow)
 * 
 * DESIGN:
 * - Clean white card (bg-white)
 * - Subtle drop shadow
 * - Professional typography
 * - Blue accent color
 * - Responsive layout
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function ECommerceProductCard({ product }) {
  // ===== STATE =====
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // ===== DERIVED VALUES =====
  /**
   * stockStatus
   * Determines stock availability level
   */
  const stockStatus = (() => {
    const percentage = (product.currentAvailable / product.totalQuantity) * 100;
    if (percentage >= 50) return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    if (percentage >= 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  })();

  const isOutOfStock = product.currentAvailable === 0;

  // ===== EVENT HANDLERS =====
  /**
   * handleAddToCart
   * Adds product to cart and shows feedback
   */
  const handleAddToCart = () => {
    setIsAdding(true);

    // Simulate slight delay for feedback
    setTimeout(() => {
      addToCart(product, 1);
      setIsAdding(false);
      setAddedFeedback(true);

      // Clear feedback after 2 seconds
      setTimeout(() => {
        setAddedFeedback(false);
      }, 2000);
    }, 300);
  };

  // ===== RENDER =====
  // Don't render if no image (image validation)
  if (!product.imageURL) {
    return null;
  }

  return (
    <div className="group h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* IMAGE CONTAINER */}
      <div className="relative bg-gray-100 h-48 overflow-hidden">
        {/* PRODUCT IMAGE */}
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Hide broken images
            e.target.style.display = 'none';
          }}
        />

        {/* PRICE BADGE - Top Left */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm shadow-md">
          {product.price}
        </div>

        {/* STOCK STATUS BADGE - Top Right */}
        <div
          className={`
            absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold
            ${stockStatus.color}
          `}
        >
          {stockStatus.label}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-grow p-4 flex flex-col">
        {/* CATEGORY LABEL */}
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
          {product.category}
        </span>

        {/* PRODUCT TITLE */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* SKU */}
        <p className="text-xs text-gray-500 font-mono mb-3">
          SKU: {product.sku}
        </p>

        {/* SPECS BANNER */}
        {product.specsBanner && (
          <div className="bg-blue-100 text-blue-900 px-2 py-1 rounded text-xs font-bold mb-3 text-center">
            ⚡ {product.specsBanner}
          </div>
        )}

        {/* FEATURES DESCRIPTION */}
        <p className="text-sm text-gray-600 mb-3 flex-grow">
          {product.features}
        </p>

        {/* VOLTAGE DISPLAY */}
        {product.voltage && (
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold">
              {product.voltage}
            </span>
          </div>
        )}

        {/* STOCK DETAIL */}
        <p className="text-xs text-gray-600 mb-4">
          <span className="font-semibold text-gray-900">{product.currentAvailable}</span>/
          <span className="font-semibold">{product.totalQuantity}</span> available
        </p>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`
            w-full py-3 px-4 rounded-lg font-bold transition-all duration-300
            flex items-center justify-center gap-2
            ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : addedFeedback
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }
          `}
        >
          {isAdding ? (
            <>
              <span className="animate-spin">⟳</span>
              Adding...
            </>
          ) : addedFeedback ? (
            <>
              <span>✓</span>
              Added to Cart!
            </>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <span>🛒</span>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ECommerceProductCard;
