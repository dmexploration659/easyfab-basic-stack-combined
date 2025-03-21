import React from 'react';
import { useCanvas } from './CanvasContext';
import * as fabric from 'fabric';

// DrawingTools with canvas interaction
const DrawingTools = ({ toggleFreeDrawing, isFreeDrawing }) => {
  const { canvas, drawingMode, setDrawingMode } = useCanvas();
  
  const addShape = (shapeType) => {
    if (!canvas) return;
    
    // If we're switching to a regular shape, make sure we turn off free drawing
    if (isFreeDrawing) {
      toggleFreeDrawing(false);
    }
    
    let shape;
    
    switch(shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          fill: 'transparent',
          zIndex: 100,
          stroke: 'red',
          borderColor: 'gray',
          width: 100,
          height: 50,
          originX: 'left',
          originY: 'top'
        });
        break;
        
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          zIndex: 100,
          fill: 'transparent',
          stroke: 'red',
          borderColor: 'gray',
         
        });
        break;
        
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          fill: 'transparent',
          stroke: 'red',
          zIndex: 100,
          borderColor: 'gray',
          width: 100,
          height: 100
        });
        break;
        
      case 'polygon':
        shape = new fabric.Polygon([
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 50, y: 150 },
          { x: 0, y: 100 }
        ], {
          left: 100,
          top: 100,
          fill: 'transparent',
          zIndex: 100,
          stroke: 'red',
          borderColor: 'gray',
        });
        break;
        
      case 'line':
        // Clicking line tool now toggles free drawing mode
        toggleFreeDrawing(!isFreeDrawing);
        return;
        
      case 'arrow':
        // Create an arrow using path
        shape = new fabric.Path('M 0 0 L 100 0 L 100 -10 L 120 10 L 100 30 L 100 20 L 0 20 Z', {
          left: 100,
          top: 100,
          fill: 'transparent',
          stroke: 'red',
          zIndex: 100,
          borderColor: 'gray',
          scaleX: 0.5,
          scaleY: 0.5
        });
        break;
        
      case 'ellipse':
        shape = new fabric.Ellipse({
          left: 100,
          top: 100,
          fill: 'transparent',
          stroke: 'red',
          borderColor: 'gray',
          zIndex: 100,
          rx: 60,
          ry: 30
        });
        break;
        
      default:
        return;
    }
    
    // Only add a shape if one was created (not in free drawing mode)
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };
  
  return (
    <div className="draw_tools_btns">
      <button id="draw_rect" onClick={() => addShape('rect')}>▭</button>
      <button id="draw_circle" onClick={() => addShape('circle')}>⬤</button>
      <button id="draw_triangle" onClick={() => addShape('triangle')}>△</button>
      <button id="draw_polygon" onClick={() => addShape('polygon')}>⬠</button>
      <button 
        id="draw_line" 
        onClick={() => addShape('line')}
        style={{ backgroundColor: isFreeDrawing ? '#ff4444' : '' }}
      >
        ─
      </button>
      <button id="draw_arrow" onClick={() => addShape('arrow')}>→</button>
      <button id="draw_ellipse" onClick={() => addShape('ellipse')}>⬥</button>
    </div>
  );
};

export default DrawingTools;