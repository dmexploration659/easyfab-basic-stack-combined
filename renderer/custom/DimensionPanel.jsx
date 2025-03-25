'use client';
import React, { useState, useEffect } from 'react';
import { useCanvas } from './CanvasContext';

const DimensionsPanel = () => {
  const { canvas, selectedObject } = useCanvas();
  const [dimensions, setDimensions] = useState({
    width: '',
    height: '',
    thickness: '',
    length: ''
  });
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');

  // Update dimensions when a new object is selected
  useEffect(() => {
    if (!selectedObject) {
      setDimensions({
        width: '',
        height: '',
        thickness: '',
        length: ''
      });
      setAvailableSizes([]);
      setSelectedSize('');
      return;
    }

    // Get dimensions from the selected object
    const width = Math.round(selectedObject.getScaledWidth() * 100) / 100;
    const height = Math.round(selectedObject.getScaledHeight() * 100) / 100;
    
    // Get metadata from the object (if it exists)
    const partType = selectedObject.partType;
    const partDimensions = selectedObject.partDimensions || {};
    
    setDimensions({
      width: width,
      height: height,
      thickness: partDimensions.thickness || '',
      length: partDimensions.length || ''
    });

    // If this is a library part with available sizes
    if (partType && selectedObject.partSize) {
      // Here we would ideally fetch the available sizes for this part type
      // For now, we'll just set the current size
      setSelectedSize(selectedObject.partSize);
      
      // This would come from your parts library
      // For now, just adding a placeholder
      setAvailableSizes([selectedObject.partSize]);
    } else {
      setAvailableSizes([]);
      setSelectedSize('');
    }
  }, [selectedObject]);

  // Handle dimension changes
  const handleDimensionChange = (dimension, value) => {
    setDimensions({
      ...dimensions,
      [dimension]: value
    });
  };

  // Apply dimension changes to the selected object
  const applyDimensions = () => {
    if (!canvas || !selectedObject) return;

    const widthScale = dimensions.width / selectedObject.getScaledWidth();
    const heightScale = dimensions.height / selectedObject.getScaledHeight();

    // Apply scaling to maintain aspect ratio if it's a group
    if (selectedObject.type === 'group') {
      selectedObject.scale(selectedObject.scaleX * widthScale, selectedObject.scaleY * heightScale);
    } else {
      selectedObject.set({
        scaleX: selectedObject.scaleX * widthScale,
        scaleY: selectedObject.scaleY * heightScale
      });
    }

    // If it's a part with metadata, update the thickness if applicable
    if (selectedObject.partDimensions && dimensions.thickness) {
      const updatedDimensions = { ...selectedObject.partDimensions };
      updatedDimensions.thickness = parseFloat(dimensions.thickness);
      selectedObject.set('partDimensions', updatedDimensions);
      
      // For visual update of thickness, we would need to redraw the object
      // This is a simplification and would depend on your implementation
      if (selectedObject.type === 'group') {
        // Assuming the second object in group is the inner shape for tubes
        const innerShape = selectedObject.getObjects()[1];
        if (innerShape) {
          // Update the inner shape based on thickness
          // This is a simplification - actual implementation would depend on the shape type
        }
      }
    }

    canvas.renderAll();
  };

  // Handle size change from dropdown
  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
    
    // Find the selected size details from the parts library
    // This is a placeholder - you would need to implement this based on your parts library
    // For example, find the part and size in partsLibrary and update dimensions
    
    // For now, we'll just update the UI without applying changes
    // In a real implementation, you would update the object dimensions based on the new size
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '100px',
        right: '30px',
        width: '180px',
        backgroundColor: '#222',
        borderRadius: '5px',
        padding: '10px',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        display: selectedObject ? 'block' : 'none'
      }}
    >
      <div 
        style={{
          marginBottom: '15px',
          borderBottom: '1px solid #444',
          paddingBottom: '10px'
        }}
      >
        <h3 
          style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Edit Dimensions
        </h3>
        
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '3px' }}>Width(mm):</label>
          <input 
            type="number" 
            value={dimensions.width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            onBlur={applyDimensions}
            style={{
              width: '100%',
              padding: '4px',
              backgroundColor: '#333',
              border: '1px solid #555',
              borderRadius: '3px',
              color: 'white'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '3px' }}>Height(mm):</label>
          <input 
            type="number" 
            value={dimensions.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            onBlur={applyDimensions}
            style={{
              width: '100%',
              padding: '4px',
              backgroundColor: '#333',
              border: '1px solid #555',
              borderRadius: '3px',
              color: 'white'
            }}
          />
        </div>
        
        {dimensions.thickness !== '' && (
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '3px' }}>Thickness(mm):</label>
            <input 
              type="number" 
              value={dimensions.thickness}
              onChange={(e) => handleDimensionChange('thickness', e.target.value)}
              onBlur={applyDimensions}
              style={{
                width: '100%',
                padding: '4px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '3px',
                color: 'white'
              }}
            />
          </div>
        )}
        
        {dimensions.length !== '' && (
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '3px' }}>Length(mm):</label>
            <input 
              type="number" 
              value={dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              onBlur={applyDimensions}
              style={{
                width: '100%',
                padding: '4px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '3px',
                color: 'white'
              }}
            />
          </div>
        )}
      </div>
      
      {availableSizes.length > 0 && (
        <div>
          <h3 
            style={{
              margin: '0 0 10px 0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Change Part
          </h3>
          
          <select
            value={selectedSize}
            onChange={handleSizeChange}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#333',
              border: '1px solid #555',
              borderRadius: '3px',
              color: 'white'
            }}
          >
            <option value="">Available Part size</option>
            {availableSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DimensionsPanel;