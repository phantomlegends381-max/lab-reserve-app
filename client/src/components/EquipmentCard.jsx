import React from 'react';

const EquipmentCard = ({ equipment, onReserve }) => {
  const isAvailable = equipment.status;
  const badgeStyle = {
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    color: '#fff',
    backgroundColor: isAvailable ? '#28a745' : '#dc3545',
    fontWeight: '600',
    display: 'inline-block',
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', maxWidth: '320px', marginBottom: '1rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <img
          src={equipment.imageURL || 'https://via.placeholder.com/320x180?text=Equipment'}
          alt={equipment.name}
          style={{ width: '100%', borderRadius: '6px', objectFit: 'cover' }}
        />
      </div>

      <h3 style={{ margin: '0 0 0.5rem 0' }}>{equipment.name}</h3>
      <p style={{ margin: '0 0 0.75rem 0', color: '#555' }}>{equipment.category}</p>
      <span style={badgeStyle}>{isAvailable ? 'Available' : 'In Use'}</span>

      <div style={{ marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => onReserve(equipment._id)}
          disabled={!isAvailable}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: 'none',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            backgroundColor: isAvailable ? '#007bff' : '#6c757d',
            color: '#fff',
            fontWeight: '600',
          }}
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;
