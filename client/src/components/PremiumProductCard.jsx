/**
 * Premium Product Card Component
 * 
 * DESIGN PHILOSOPHY:
 * - Mimics Amazon/Adafruit product card aesthetic
 * - High-quality product image is MANDATORY (no image = card doesn't render)
 * - Bold typography hierarchy: Title → Specs Banner → Stock Status
 * - Hover effects: Card lift, shadow enhancement, button prominence
 * - Color scheme: Dark background with electric blue/neon green accents
 * 
 * Props:
 * - product: Product object from premiumInventory
 * - onReserve: Callback function when Reserve button clicked
 */

export default function PremiumProductCard({ product, onReserve }) {
  // ===== VALIDATION: Only render if image exists =====
  // This ensures professional appearance without broken images
  if (!product.imageURL) {
    return null; // Don't render card without image
  }

  // ===== COMPUTE STOCK STATUS & COLOR =====
  // Green = In Stock (≥50%), Orange = Low Stock (10-50%), Red = Out of Stock (<10%)
  const stockPercentage = (product.currentAvailable / product.totalQuantity) * 100;
  
  let stockColor = 'bg-red-900 text-red-200'; // Out of Stock
  let stockLabel = 'Out of Stock';
  
  if (stockPercentage >= 50) {
    stockColor = 'bg-green-900 text-green-200';
    stockLabel = `${product.currentAvailable} In Stock`;
  } else if (stockPercentage >= 10) {
    stockColor = 'bg-orange-900 text-orange-200';
    stockLabel = `${product.currentAvailable} Low Stock`;
  }

  const isAvailable = product.currentAvailable > 0;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-gray-700 hover:border-blue-500">
      
      {/* IMAGE SECTION: High-Priority Visual */}
      <div className="relative w-full h-56 bg-gray-900 overflow-hidden group">
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* STOCK BADGE: Top Right Corner */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${stockColor}`}>
          {stockLabel}
        </div>

        {/* PRICE BADGE: Top Left Corner */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {product.price}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* CATEGORY LABEL */}
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
          {product.category}
        </span>

        {/* PRODUCT TITLE: Bold & Prominent */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-blue-300 transition-colors">
          {product.name}
        </h3>

        {/* SKU / PART NUMBER */}
        <p className="text-xs text-gray-400 mb-2">
          SKU: <span className="font-mono text-gray-300">{product.sku}</span>
        </p>

        {/* SPECS BANNER: High-Contrast Accent */}
        <div className="bg-blue-500 text-gray-900 px-3 py-2 rounded text-xs font-bold mb-3 text-center">
          ⚡ {product.specsBanner}
        </div>

        {/* DESCRIPTION / FEATURES */}
        <p className="text-sm text-gray-300 mb-3 flex-1">
          {product.features}
        </p>

        {/* STOCK DETAIL */}
        <div className="text-xs text-gray-400 mb-3 pb-3 border-b border-gray-700">
          {product.currentAvailable}/{product.totalQuantity} units available
        </div>

        {/* LEAD TIME */}
        <div className="text-xs mb-4">
          <span className={`inline-block px-2 py-1 rounded font-semibold ${
            product.leadTime === 'In Stock' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-yellow-900 text-yellow-300'
          }`}>
            {product.leadTime}
          </span>
        </div>

        {/* RESERVE BUTTON */}
        <button
          onClick={() => onReserve(product)}
          disabled={!isAvailable}
          className={`w-full py-3 rounded-lg font-bold text-center transition-all duration-200 ${
            isAvailable
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white cursor-pointer shadow-lg hover:shadow-blue-500/50'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          {isAvailable ? '🛒 Reserve Now' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
