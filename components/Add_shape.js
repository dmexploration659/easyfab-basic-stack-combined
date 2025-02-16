import React from 'react';
import * as fabric from 'fabric';

const AddShapeButton = () => {
  const addShape = () => {
    // Get the canvas using its ID
    const canvasEl = document.getElementById('fabricCanvas');
    const canvas = canvasEl && canvasEl.fabric;

    if (canvas) {
      const randomRect = new fabric.Rect({
        left: Math.random() * 700,
        top: Math.random() * 500,
        fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        width: 100,
        height: 100,
        selectable: true,
      });
      canvas.add(randomRect);
    } else {
      console.error('Canvas not found or Fabric.js instance is missing!');
    }
  };

  return (
    <button onClick={addShape} style={{ marginBottom: '10px' }}>
      Add Shape
    </button>
  );
};

export default AddShapeButton;
