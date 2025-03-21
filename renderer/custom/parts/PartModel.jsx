'use client';
import React from 'react';

const PartModal = ({ 
  selectedPart, 
  partDimensions, 
  selectedUnits,
  onDimensionChange,
  onUnitChange,
  onCancel,
  onSubmit
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 1000,
        width: '400px',
        maxWidth: '90vw'
      }}
    >
      <h2 style={{
        margin: '0 0 15px 0', 
        color: "black",
        fontSize: '20px'
      }}>{selectedPart.title}</h2>

      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
      }}>
        {Object.keys(selectedPart.params).map(paramKey => {
          const param = selectedPart.params[paramKey];
          return (
            <div key={paramKey} style={{ marginBottom: '10px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                marginBottom: '3px',
                color: "black"
              }}>
                {param.name}
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type={param.in_type}
                  value={partDimensions[paramKey] || ''}
                  onChange={(e) => onDimensionChange(paramKey, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <select
                  value={selectedUnits[paramKey]}
                  onChange={(e) => onUnitChange(paramKey, e.target.value)}
                  style={{
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white'
                  }}
                >
                  {param.units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default PartModal;