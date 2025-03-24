import React from 'react';

// DimensionBar component with measurements and delete button
const DimensionBar = ({ width, height, rotation, onZoomIn, onZoomOut, onDelete, hasSelection }) => {
  return (
    <div className="dimension-bar">
      <div className="dimension-info">
        <div className="dimension-item">
          <span className="dimension-label">Width</span>
          <span className="dimension-value">{width} mm</span>
        </div>
        <div className="dimension-item">
          <span className="dimension-label">Height</span>
          <span className="dimension-value">{height} mm</span>
        </div>
        <div className="dimension-item">
          <span className="dimension-label">Rotation</span>
          <span className="dimension-value">{rotation}°</span>
        </div>
        <button 
          className="delete-btn" 
          onClick={onDelete} 
          disabled={!hasSelection}
        >
          <span className="delete-icon">🗑️</span>
          <span className="delete-text">Delete</span>
        </button>
      </div>
      
      <div className="dimension-controls">
        <div className="zoom-controls">
       
          <button 
            className="zoom-btn zoom-in" 
            onClick={onZoomIn}
            title="Zoom In"
          >
            <span>+</span>
          </button>
          <button 
            className="zoom-btn zoom-out" 
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <span>-</span>
          </button>
        </div>
     
      </div>
         
   
    </div>
  );
};

export default DimensionBar;