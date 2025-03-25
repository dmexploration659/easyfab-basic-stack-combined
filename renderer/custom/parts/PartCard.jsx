'use client';
import React from 'react';

const PartCard = ({ part, onClick }) => {
  // Convert type to a display title (e.g., "sheet_metal" → "Sheet Metal")
  const displayTitle = part.type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ marginBottom: '8px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {part.thumbnail ? (
          <img 
            src={part.thumbnail} 
            alt={displayTitle} 
            style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }} 
          />
        ) : (
          <div 
            style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            No Image
          </div>
        )}
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}>
        {displayTitle}
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        {part.material}, {part.thickness}{part.unit}
      </div>
    </div>
  );
};

export default PartCard;