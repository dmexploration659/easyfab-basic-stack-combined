'use client';
import React from 'react';

const PartModal = ({
  selectedPart,
  selectedSize,
  onSizeChange,
  onCancel,
  onSubmit
}) => {
  if (!selectedPart || !selectedPart.sizes) return null;
  
  const sizeDetails = selectedPart.sizes[selectedSize] || {};
  
  // Convert type to a display title (e.g., "sheet_metal" → "Sheet Metal")
  const displayTitle = selectedPart.type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
      }}>{displayTitle}</h2>
      
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            marginBottom: '5px',
            color: "black",
            fontWeight: 'bold'
          }}>
            Select Size
          </label>
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          >
            {Object.keys(selectedPart.sizes).map(sizeKey => (
              <option key={sizeKey} value={sizeKey}>{sizeKey}</option>
            ))}
          </select>
        </div>
        
        {/* Display the details of the selected size */}
        <div style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '10px', 
          borderRadius: '5px',
          marginTop: '10px'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            margin: '0 0 10px 0',
            color: 'black'
          }}>
            Specifications
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(sizeDetails).map(([key, value]) => (
                key !== 'unit' && (
                  <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ 
                      padding: '5px 0', 
                      color: 'black', 
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {key}:
                    </td>
                    <td style={{ 
                      padding: '5px 0', 
                      color: 'black',
                      textAlign: 'right'
                    }}>
                      {value} {sizeDetails.unit || selectedPart.unit}
                    </td>
                  </tr>
                )
              ))}
              <tr>
                <td style={{ 
                  padding: '5px 0', 
                  color: 'black', 
                  fontWeight: 'bold' 
                }}>
                  Material:
                </td>
                <td style={{ 
                  padding: '5px 0', 
                  color: 'black',
                  textAlign: 'right',
                  textTransform: 'capitalize'
                }}>
                  {selectedPart.material}
                </td>
              </tr>
              <tr>
                <td style={{ 
                  padding: '5px 0', 
                  color: 'black', 
                  fontWeight: 'bold' 
                }}>
                  Machining Tool:
                </td>
                <td style={{ 
                  padding: '5px 0', 
                  color: 'black',
                  textAlign: 'right',
                  textTransform: 'capitalize'
                }}>
                  {selectedPart.machining_tool.replace('_', ' ')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 16px',
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
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Add to Canvas
        </button>
      </div>
    </div>
  );
};

export default PartModal;