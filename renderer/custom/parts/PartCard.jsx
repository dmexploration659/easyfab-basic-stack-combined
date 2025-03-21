'use client';
import React from 'react';
import Image from 'next/image';

const PartCard = ({ part, onClick }) => {
  // Handle Next.js image paths - remove the "img/" prefix if needed
  const imagePath = part.thumbnail.startsWith('/')
    ? part.thumbnail
    : `/${part.thumbnail}`;

  return (
    <div
      className="part_card"
      data-part-id={part.id}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="part_thumbnail"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '8px'
        }}
      >
        <Image
          src={imagePath}
          alt={part.title}
          width={80}
          height={80}
          unoptimized
          style={{
            objectFit: 'contain',
            borderRadius: '4px'
          }}
        />
      </div>
      <div
        className="part_details"
        style={{
          textAlign: 'center'
        }}
      >
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333'
        }}>
          {part.title}
        </h3>
        <div
          className="part_stock_info"
          style={{
            fontSize: '12px',
            color: '#666'
          }}
        >
          Stock: {part.stock_dimensions.length} {part.stock_dimensions.unit}
          {part.stock_dimensions.width && ` × ${part.stock_dimensions.width} ${part.stock_dimensions.unit}`}
        </div>
      </div>
    </div>
  );
};

export default PartCard;