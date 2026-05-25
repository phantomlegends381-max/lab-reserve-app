/**
 * Side Drawer Checkout Component
 * 
 * DESIGN PHILOSOPHY:
 * - Elegant slide-in panel from the right (not a modal overlay)
 * - Displays full product details: image, voltage, specs
 * - Clean form for Project Name and Expected Return Date
 * - Confirmation summary before checkout
 * - Professional animations and transitions
 * 
 * Features:
 * - Semi-transparent backdrop click to close
 * - Smooth slide animation
 * - Form validation before submission
 * - Voltage display with safety emphasis
 * - Return date picker with smart defaults
 */

import { useState } from 'react';
import { safeJsonFetch } from '../utils/api';

export default function SideDrawerCheckout({ product, onClose, onCheckout, isOpen }) {
  const [projectName, setProjectName] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // ===== COMPUTE RECOMMENDED RETURN DATE (7 days from today) =====
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDefaultReturnDate = () => {
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    return sevenDaysLater.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // ===== VALIDATION: Required fields =====
    if (!projectName.trim()) {
      setValidationError('Project name is required');
      return;
    }
    if (!returnDate) {
      setValidationError('Expected return date is required');
      return;
    }

    // ===== VALIDATION: Return date cannot be in the past =====
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(returnDate);
    if (selectedDate < today) {
      setValidationError('Return date cannot be in the past');
      return;
    }

    setIsSubmitting(true);

    try {
      // ===== API CALL: Submit checkout =====
      await safeJsonFetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              itemId: product.id,
              quantity: 1,
              productName: product.name,
            },
          ],
          studentId: projectName, // Using project name as identifier
          projectName,
          expectedReturnDate: returnDate,
        }),
      });

      alert(`${product.name} reserved successfully.\n\nProject: ${projectName}\nReturn by: ${returnDate}`);
      onCheckout();
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      setValidationError(error.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== COMPUTE VOLTAGE DISPLAY & WARNING =====
  const voltageColor = product.voltage?.includes('3.3V') 
    ? 'text-blue-300' 
    : product.voltage?.includes('5V') 
    ? 'text-orange-300' 
    : 'text-gray-300';

  return (
    <>
      {/* BACKDROP: Click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* SIDE DRAWER: Slide in from right */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 shadow-2xl z-50 overflow-y-auto transition-transform duration-300 border-l border-blue-500/30 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HEADER */}
        <div className="bg-gray-950 p-6 border-b border-blue-500/30 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Reserve Component</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          
          {/* PRODUCT IMAGE */}
          {product.imageURL && (
            <div className="rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* PRODUCT DETAILS */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
            <h3 className="text-lg font-bold text-white">{product.name}</h3>
            <p className="text-sm text-gray-400">SKU: {product.sku}</p>
            
            {/* VOLTAGE: High-Visibility */}
            <div className="bg-gray-900 p-3 rounded flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">Operating Voltage:</span>
              <span className={`text-xl font-bold ${voltageColor}`}>{product.voltage}</span>
            </div>

            {/* FEATURES */}
            <p className="text-sm text-gray-300">{product.features}</p>

            {/* SPECS BANNER */}
            <div className="bg-blue-600/20 border border-blue-500 p-2 rounded text-xs font-mono text-blue-300 text-center">
              ⚡ {product.specsBanner}
            </div>

            {/* AVAILABILITY */}
            <div className="text-xs text-gray-400">
              <span className="font-semibold text-green-400">✓ {product.currentAvailable}</span>
              {' '}of {product.totalQuantity} available
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PROJECT NAME */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g., 'Smart Thermostat v2'"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-xs text-gray-500 mt-1">Help us track component usage</p>
            </div>

            {/* EXPECTED RETURN DATE */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Expected Return Date *
              </label>
              <input
                type="date"
                value={returnDate || getDefaultReturnDate()}
                onChange={(e) => setReturnDate(e.target.value)}
                min={getTodayDate()}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 7 days from today</p>
            </div>

            {/* VALIDATION ERROR */}
            {validationError && (
              <div className="bg-red-900/30 border border-red-500 p-3 rounded text-red-300 text-sm">
                ⚠️ {validationError}
              </div>
            )}

            {/* SUMMARY */}
            <div className="bg-blue-600/10 border border-blue-500 p-4 rounded text-sm space-y-2">
              <p className="font-semibold text-blue-300">📋 Reservation Summary:</p>
              <div className="text-gray-300 space-y-1">
                <p><span className="text-gray-500">Component:</span> {product.name}</p>
                <p><span className="text-gray-500">Project:</span> {projectName || '(pending)'}</p>
                <p><span className="text-gray-500">Return by:</span> {returnDate || getDefaultReturnDate()}</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Processing...' : '✓ Confirm Reservation'}
              </button>
            </div>
          </form>

          {/* TERMS */}
          <div className="bg-gray-800 p-4 rounded border border-gray-700 text-xs text-gray-400 space-y-2">
            <p className="font-semibold text-gray-300">Terms:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Components must be returned by the specified date</li>
              <li>Damage warranty: 30 days from reservation</li>
              <li>Late return fee: $5/day per component</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
