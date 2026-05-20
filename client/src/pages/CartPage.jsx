/**
 * CART PAGE COMPONENT
 * 
 * Dedicated page for reviewing and managing shopping cart
 * 
 * Features:
 * - Product review with images
 * - Quantity adjustment (increase/decrease/remove)
 * - Cart summary (total price)
 * - "Submit Reservation" button for checkout
 * - Empty cart state with "Continue Shopping" link
 * 
 * DESIGN:
 * - Two-column layout: Products (left), Summary (right)
 * - Clean white cards with subtle shadows
 * - Professional typography
 * - Clear call-to-action button
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  // ===== STATE =====
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ===== EVENT HANDLERS =====

  /**
   * handleQuantityChange
   * Updates quantity when user adjusts amount
   */
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  /**
   * handleSubmitReservation
   * Submits cart to backend for validation and checkout
   */
  const handleSubmitReservation = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare checkout payload
      const checkoutData = {
        items: cartItems.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          productName: item.name
        })),
        totalPrice: cartTotal,
        timestamp: new Date().toISOString()
      };

      // Call backend checkout endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      // Success!
      setSuccess(true);
      clearCart();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err) {
      setError(err.message || 'An error occurred during checkout');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== EMPTY CART STATE =====
  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 max-w-md mb-8">
              Start adding products to your cart and come back here to complete your reservation.
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== SUCCESS STATE =====
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Reservation Submitted!
            </h1>
            <p className="text-gray-600 max-w-md mb-8">
              Your hardware reservation has been confirmed. You will be redirected to the storefront shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN CART PAGE =====
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for reservation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: CART ITEMS */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemPrice = parseFloat(item.price?.replace('$', '') || 0);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* PRODUCT IMAGE */}
                      {item.imageURL ? (
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageURL}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}

                      {/* PRODUCT INFO */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          SKU: {item.sku || 'N/A'}
                        </p>

                        {/* SPECS */}
                        {item.voltage && (
                          <div className="flex gap-2 mb-3">
                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                              {item.voltage}
                            </span>
                            {item.specsBanner && (
                              <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded">
                                {item.specsBanner}
                              </span>
                            )}
                          </div>
                        )}

                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 border-l border-r border-gray-300 text-gray-900 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm text-gray-600 mb-2">Price each</p>
                        <p className="text-lg font-bold text-gray-900 mb-6">
                          {item.price}
                        </p>
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-xl font-bold text-blue-600">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY & CHECKOUT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              {/* ORDER SUMMARY */}
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${(cartTotal * 1.08).toFixed(2)}
                </span>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* CHECKOUT BUTTON */}
              <button
                onClick={handleSubmitReservation}
                disabled={isSubmitting || cartItems.length === 0}
                className={`
                  w-full py-3 px-4 rounded-lg font-bold text-white transition-colors mb-3
                  ${
                    isSubmitting || cartItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isSubmitting ? 'Processing...' : '✓ Submit Reservation'}
              </button>

              {/* CONTINUE SHOPPING LINK */}
              <Link
                to="/"
                className="block w-full py-2 px-4 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ← Continue Shopping
              </Link>

              {/* TRUST BADGES */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>30-day return guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Expert support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
