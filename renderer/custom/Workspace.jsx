import React, { useEffect, useRef, createContext, useContext, useState } from 'react';
import CommandButtons from './CommandButtons';
import DrawingTools from './DrawingTools';
import UtilityButtons from './UtilityButtons';
import ControlPanel from './ControlPanel';
import * as fabric from 'fabric';

// Create a context for the canvas
const CanvasContext = createContext(null);

// Create a provider for other components to access canvas
export const CanvasProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [drawingMode, setDrawingMode] = useState(null);

  return (
    <CanvasContext.Provider value={{ 
      canvas, 
      setCanvas, 
      selectedObject, 
      setSelectedObject,
      zoom,
      setZoom,
      drawingMode,
      setDrawingMode
    }}>
      {children}
    </CanvasContext.Provider>
  );
};

// Hook to use canvas in other components
export const useCanvas = () => useContext(CanvasContext);

const Workspace = () => {
  const canvasEl = useRef(null);
  const { 
    setCanvas, 
    canvas, 
    setSelectedObject, 
    zoom, 
    setZoom,
    drawingMode,
    setDrawingMode 
  } = useCanvas();
  
  // State for dimensions display
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    rotation: 0
  });

  useEffect(() => {
    if (!canvasEl.current) return;

    const options = {
      width: 1000,
      height: 600,
      backgroundColor: '#1a1a1a'
    };

    const fabricCanvas = new fabric.Canvas(canvasEl.current, options);
    createGrid(fabricCanvas);
    setCanvas(fabricCanvas);

    // Object selection event
    fabricCanvas.on('selection:created', (e) => {
      updateDimensions(e.selected[0]);
      setSelectedObject(e.selected[0]);
    });

    fabricCanvas.on('selection:updated', (e) => {
      updateDimensions(e.selected[0]);
      setSelectedObject(e.selected[0]);
    });

    fabricCanvas.on('selection:cleared', () => {
      setDimensions({ width: 0, height: 0, rotation: 0 });
      setSelectedObject(null);
    });

    // Object modification events
    fabricCanvas.on('object:modified', (e) => {
      updateDimensions(e.target);
    });

    fabricCanvas.on('object:scaling', (e) => {
      updateDimensions(e.target);
    });

    fabricCanvas.on('object:rotating', (e) => {
      updateDimensions(e.target);
    });

    return () => {
      setCanvas(null);
      fabricCanvas.dispose();
    };
  }, [setCanvas, setSelectedObject]);

  // Update dimensions display when object is selected or modified
  const updateDimensions = (obj) => {
    if (!obj) return;
    
    setDimensions({
      width: Math.round(obj.getScaledWidth()),
      height: Math.round(obj.getScaledHeight()),
      rotation: Math.round(obj.angle || 0)
    });
  };

  const createGrid = (canvas, gridSize = 20, color = 'rgba(100, 100, 100, 0.3)') => {
    if (!canvas) return;
    const gridLines = [];
    
    for (let i = 0; i <= canvas.width / gridSize; i++) {
      const line = new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
        stroke: color,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        strokeWidth: 1
      });
      gridLines.push(line);
      canvas.add(line);
    }

    // Create horizontal lines
    for (let i = 0; i <= canvas.height / gridSize; i++) {
      const line = new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], {
        stroke: color,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        strokeWidth: 1
      });
      gridLines.push(line);
      canvas.add(line);
    }

    // Store grid lines for potential removal later
    canvas.gridLines = gridLines;

    // Make sure to render the canvas
    canvas.renderAll();
  };

  // Zoom functions
  const zoomIn = () => {
    if (!canvas) return;
    const newZoom = Math.min(zoom * 1.2, 5); // Limit max zoom to 5x
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
    setZoom(newZoom);
    
    // Update grid scale
    updateGridWithZoom(newZoom);
    
    canvas.renderAll();
  };

  const zoomOut = () => {
    if (!canvas) return;
    const newZoom = Math.max(zoom / 1.2, 0.2); // Limit min zoom to 0.2x
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
    setZoom(newZoom);
    
    // Update grid scale
    updateGridWithZoom(newZoom);
    
    canvas.renderAll();
  };

  // Update grid when zooming
  const updateGridWithZoom = (newZoom) => {
    if (!canvas || !canvas.gridLines) return;
    
    // Make grid lines thinner when zooming in, thicker when zooming out
    const newThickness = 1 / newZoom;
    canvas.gridLines.forEach(line => {
      line.set({ strokeWidth: newThickness });
    });
  };

  return (
    <div className="work_space" data-title="Build space">
      <CommandButtons />
      <div className="canvas_container">
        <DimensionBar 
          width={dimensions.width} 
          height={dimensions.height} 
          rotation={dimensions.rotation} 
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
        <DrawingToolsWithCanvas />
        <UtilityButtons />
        <ControlPanel />
        <canvas
          id="fabricCanvas"
          className='canvas_wrapper'
          width="1000"
          height="600"
          ref={canvasEl}
        />
      </div>
    </div>
  );
};

// Enhanced DimensionBar component with actual measurements
const DimensionBar = ({ width, height, rotation, onZoomIn, onZoomOut }) => {
  return (
    <div className="dimansion_bar" id="dimansion_bar">
      <p id="width_dim">Width: {width}px</p>
      <p id="height_dim">Height: {height}px</p>
      <p id="rotation_dim">Rotation: {rotation}°</p>
      <div className="zoom_btns">
        <button id="zoomIn" onClick={onZoomIn}>+</button>
        <button id="zoomOut" onClick={onZoomOut}>-</button>
      </div>
    </div>
  );
};

// Enhanced DrawingTools with canvas interaction
const DrawingToolsWithCanvas = () => {
  const { canvas, drawingMode, setDrawingMode } = useCanvas();
  
  const addShape = (shapeType) => {
    if (!canvas) return;
    
    let shape;
    
    switch(shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          fill: '#ffffff',
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
          fill: '#ffffff',
          radius: 50
        });
        break;
        
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          fill: '#ffffff',
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
          fill: '#ffffff'
        });
        break;
        
      case 'line':
        shape = new fabric.Line([50, 50, 150, 50], {
          left: 100,
          top: 100,
          stroke: '#ffffff',
          strokeWidth: 2
        });
        break;
        
      case 'arrow':
        // Create an arrow using path
        shape = new fabric.Path('M 0 0 L 100 0 L 100 -10 L 120 10 L 100 30 L 100 20 L 0 20 Z', {
          left: 100,
          top: 100,
          fill: '#ffffff',
          scaleX: 0.5,
          scaleY: 0.5
        });
        break;
        
      case 'ellipse':
        shape = new fabric.Ellipse({
          left: 100,
          top: 100,
          fill: '#ffffff',
          rx: 60,
          ry: 30
        });
        break;
        
      default:
        return;
    }
    
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };
  
  return (
    <div className="draw_tools_btns">
      <button id="draw_rect" onClick={() => addShape('rect')}>▭</button>
      <button id="draw_circle" onClick={() => addShape('circle')}>⬤</button>
      <button id="draw_triangle" onClick={() => addShape('triangle')}>△</button>
      <button id="draw_polygon" onClick={() => addShape('polygon')}>⬠</button>
      <button id="draw_line" onClick={() => addShape('line')}>─</button>
      <button id="draw_arrow" onClick={() => addShape('arrow')}>→</button>
      <button id="draw_ellipse" onClick={() => addShape('ellipse')}>⬥</button>
    </div>
  );
};

export default Workspace;