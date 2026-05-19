/**
 * CheckoutModal Component
 * Polished checkout interface with:
 * - Quantity selection
 * - Student ID input
 * - Real-time voltage compatibility warnings
 * - Summary display
 */

import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';

export default function CheckoutModal({ item, onClose, onCheckout }) {
  const [quantity, setQuantity] = useState(1);
  const [studentId, setStudentId] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety validation: warn if low voltage sensor selected
  const hasLowVoltageWarning = useMemo(() => {
    if (item.category === 'Sensor') {
      const voltage = item.specs.voltage;
      return voltage && voltage.includes('3.3V');
    }
    return false;
  }, [item]);

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(1, Math.min(item.currentAvailable, quantity + delta));
    setQuantity(newQty);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!studentId.trim()) {
      alert('Please enter your Student ID');
      return;
    }

    if (quantity > item.currentAvailable) {
      alert(`Only ${item.currentAvailable} units available`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          quantity,
          studentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✓ Checkout successful! Thank you for using Lab-Reserve.');
        onCheckout();
        onClose();
      } else {
        alert(`Checkout failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-stem-700 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <p className="text-stem-100 text-sm mt-1">{item.category}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Current Stock Status */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Stock Status:</p>
            <StatusBadge available={item.currentAvailable} total={item.totalQuantity} />
          </div>

          {/* Specifications */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-900 mb-2">Specifications:</p>
            <div className="space-y-1 text-sm text-gray-700">
              {Object.entries(item.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Warning (if applicable) */}
          {hasLowVoltageWarning && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-400 flex gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">Voltage Compatibility Warning</p>
                <p className="text-xs text-amber-800 mt-0.5">
                  This is a 3.3V sensor. Ensure your microcontroller is 3.3V compatible to avoid damage.
                </p>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 font-bold"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={item.currentAvailable}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(item.currentAvailable, parseInt(e.target.value) || 1))}
                className="w-16 px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-stem-500"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 font-bold"
              >
                +
              </button>
              <span className="text-sm text-gray-600">Max: {item.currentAvailable}</span>
            </div>
          </div>

          {/* Student ID Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Student ID</label>
            <input
              type="text"
              placeholder="Enter your Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-stem-500"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <div className="flex justify-between text-sm mb-2">
              <span>Unit:</span>
              <span className="font-semibold">{item.name}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
              <span>Quantity:</span>
              <span className="font-bold text-stem-700">{quantity}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 rounded-b-xl flex gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || !studentId.trim() || quantity > item.currentAvailable}
            className="flex-1 px-4 py-2 rounded-lg bg-stem-600 hover:bg-stem-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
