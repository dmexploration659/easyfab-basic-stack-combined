import React from 'react';

// DimensionBar component with measurements and delete button
const DimensionBar = ({ width, height, rotation, onZoomIn, onZoomOut, onDelete, hasSelection }) => {
  return (
    <div className="dimansion_bar h-screen" id="dimansion_bar">
      <p id="width_dim">Width: {width}px</p>
      <p id="height_dim">Height: {height}px</p>
      <p id="rotation_dim">Rotation: {rotation}°</p>
      <div className="zoom_btns">
        <button id="zoomIn" onClick={onZoomIn}>+</button>
        <button id="zoomOut" onClick={onZoomOut}>-</button>
      </div>
      <div className="delete_btn">
        <button 
          id="deleteObject" 
          onClick={onDelete} 
          disabled={!hasSelection}
          style={{ opacity: hasSelection ? 1 : 0.5 }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default DimensionBar;