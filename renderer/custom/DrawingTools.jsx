import React from 'react';
import { useCanvas } from './CanvasContext';
import * as fabric from 'fabric';

const DrawingTools = ({ toggleFreeDrawing, isFreeDrawing }) => {
  const { canvas, drawingMode, setDrawingMode } = useCanvas();
  
  const addShape = (shapeType) => {
    if (!canvas) return;
    
    if (isFreeDrawing) {
      toggleFreeDrawing(false);
    }
    
    let shape;
    
    // Get the center of the canvas
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    
    const commonShapeProps = {
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
      strokeUniform: true,
      zIndex: 100,
      borderColor: 'gray',
    };
    
    switch(shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          ...commonShapeProps,
          width: 100,
          height: 50,
          left: canvasCenterX,
          top: canvasCenterY,
          originX: 'center',
          originY: 'center'
        });
        break;
        
      case 'circle':
        shape = new fabric.Circle({
          ...commonShapeProps,
          radius: 50,
          left: canvasCenterX,
          top: canvasCenterY,
          originX: 'center',
          originY: 'center'
        });
        break;
        
      case 'triangle':
        shape = new fabric.Triangle({
          ...commonShapeProps,
          width: 100,
          height: 100,
          left: canvasCenterX,
          top: canvasCenterY,
          originX: 'center',
          originY: 'center'
        });
        break;
        
      case 'polygon':
        shape = new fabric.Polygon([
          { x: -50, y: -50 },
          { x: 50, y: -50 },
          { x: 50, y: 50 },
          { x: 0, y: 75 },
          { x: -50, y: 50 }
        ], {
          ...commonShapeProps,
          left: canvasCenterX,
          top: canvasCenterY,
          originX: 'center',
          originY: 'center'
        });
        break;
        
      case 'line':
        toggleFreeDrawing(!isFreeDrawing);
        return;
        
      case 'arrow':
        shape = new fabric.Path('M 0 0 L 100 0 L 100 -10 L 120 10 L 100 30 L 100 20 L 0 20 Z', {
          ...commonShapeProps,
          left: canvasCenterX,
          top: canvasCenterY,
          originX: 'center',
          originY: 'center',
          scaleX: 0.5,
          scaleY: 0.5
        });
        break;
        
      case 'ellipse':
        shape = new fabric.Ellipse({
          ...commonShapeProps,
          left: canvasCenterX,
          top: canvasCenterY,
          originX: 'center',
          originY: 'center',
          rx: 60,
          ry: 30
        });
        break;
        
      default:
        return;
    }
    
    if (shape) {
      // Enable object controls for resizing and moving
      shape.set({
        cornerColor: 'blue',
        cornerStyle: 'circle',
        cornerSize: 12,
        transparentCorners: false,
        borderScaleFactor: 2,
      });
      
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };

  // Rest of the component remains the same
  return (
    <div className="drawing-tools">
      <button 
        className={`tool-btn ${isFreeDrawing ? 'active' : ''}`}
        title="Pencil"
        onClick={() => addShape('line')}
      >
        <span className="tool-icon">✏️</span>
      </button>
      
      <button 
        className="tool-btn"
        title="Rectangle"
        onClick={() => addShape('rect')}
      >
        <span className="tool-icon">□</span>
      </button>
      
      <button 
        className="tool-btn"
        title="Circle"
        onClick={() => addShape('circle')}
      >
        <span className="tool-icon">○</span>
      </button>
      
      <button 
        className="tool-btn"
        title="Triangle"
        onClick={() => addShape('triangle')}
      >
        <span className="tool-icon">△</span>
      </button>
      
      <button 
        className="tool-btn"
        title="Polygon"
        onClick={() => addShape('polygon')}
      >
        <span className="tool-icon">⬠</span>
      </button>
      
      <button 
        className="tool-btn"
        title="Arrow"
        onClick={() => addShape('arrow')}
      >
        <span className="tool-icon">→</span>
      </button>
      
      <button 
        className="tool-btn"
        title="Ellipse"
        onClick={() => addShape('ellipse')}
      >
        <span className="tool-icon">⬭</span>
      </button>
    </div>
  );
};

export default DrawingTools;