import React from 'react';
import StatusBadge from './StatusBadge';

/**
 * EquipmentCard Component
 * Displays individual hardware item with specifications, availability, and checkout button
 * Styled with Tailwind CSS for modern dark-theme aesthetic
 */
const EquipmentCard = ({ equipment, onCheckout }) => {
  const isAvailable = equipment.currentAvailable > 0;

  return (
    <div className="bg-white rounded-xl shadow-md card-hover overflow-hidden max-w-sm border border-gray-200">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={equipment.imageURL || 'https://via.placeholder.com/320x240?text=Equipment'}
          alt={equipment.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge available={equipment.currentAvailable} total={equipment.totalQuantity} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title & Category */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{equipment.name}</h3>
        <p className="text-xs font-semibold text-stem-600 uppercase mb-3">{equipment.category}</p>

        {/* Specifications Preview */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4 space-y-1 text-xs">
          {Object.entries(equipment.specs).slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex justify-between text-gray-700">
              <span className="font-semibold">{key}:</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
          {Object.keys(equipment.specs).length > 2 && (
            <p className="text-gray-500 italic">+ {Object.keys(equipment.specs).length - 2} more specs</p>
          )}
        </div>

        {/* Availability Summary */}
        <div className="bg-blue-50 p-2 rounded mb-4 text-xs text-blue-900">
          <span className="font-semibold">{equipment.currentAvailable}</span> of{' '}
          <span className="font-semibold">{equipment.totalQuantity}</span> available
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => onCheckout(equipment)}
          disabled={!isAvailable}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isAvailable
              ? 'bg-stem-600 hover:bg-stem-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          {isAvailable ? 'Checkout' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;
