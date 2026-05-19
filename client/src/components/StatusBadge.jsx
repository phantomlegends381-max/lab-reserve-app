/**
 * StatusBadge Component
 * Displays inventory status with color-coded indicators
 * - Green: In Stock (≥50% available)
 * - Yellow: Low Stock (10-50% available)
 * - Red: Out of Stock (<10% or 0)
 */

export default function StatusBadge({ available, total }) {
  const percentage = total > 0 ? (available / total) * 100 : 0;

  let bgColor = 'bg-red-100';
  let textColor = 'text-red-800';
  let statusText = 'Out of Stock';

  if (percentage >= 50) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
    statusText = 'In Stock';
  } else if (percentage >= 10 && percentage < 50) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    statusText = 'Low Stock';
  }

  return (
    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>
      {statusText} ({available}/{total})
    </div>
  );
}
