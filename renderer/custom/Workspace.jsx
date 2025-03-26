import React, { useEffect, useRef, useState } from 'react';
import CommandButtons from './CommandButtons';
import DrawingTools from './DrawingTools';
import ControlPanel from './ControlPanel';
import DimensionBar from './DimensionBar';
import DimensionsPanel from './DimensionPanel';
import { useCanvas } from './CanvasContext';
import {
  createGrid,
  removeAllGuideLines,
  showSmartGuides,
  updateGridWithZoom
} from '../utils/canvasUtils';
import * as fabric from 'fabric';
import Sidebar from './Sidebar';

const Workspace = () => {
  const canvasEl = useRef(null);
  const {
    setCanvas,
    canvas,
    setSelectedObject,
    selectedObject,
    zoom,
    setZoom,
    drawingMode,
    setDrawingMode,
    freeDrawing,
    setFreeDrawing
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
      // set width and height of window screen size
      width: 6000,
      height: 6000,
      backgroundColor: '#1a1a1a',
      isDrawingMode: false
    };

    const fabricCanvas = new fabric.Canvas(canvasEl.current, options);
    createGrid(fabricCanvas);
    setCanvas(fabricCanvas);

    // Set up free drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = 'red';
    fabricCanvas.freeDrawingBrush.width = 2;

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

    // Smart guides implementation
    fabricCanvas.on('object:moving', (e) => {
      showSmartGuides(e.target, fabricCanvas);
    });

    fabricCanvas.on('mouse:up', () => {
      // Clear all guide lines when mouse is released
      removeAllGuideLines(fabricCanvas);
    });

    // Setup keyboard delete event
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && fabricCanvas.getActiveObject()) {
        deleteSelectedObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setCanvas(null);
      fabricCanvas.dispose();
    };
  }, [setCanvas, setSelectedObject]);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = freeDrawing;
    canvas.renderAll();
  }, [canvas, freeDrawing]);

  // Update dimensions display when object is selected or modified
  const updateDimensions = (obj) => {
    if (!obj) return;

    setDimensions({
      width: Math.round(obj.getScaledWidth()),
      height: Math.round(obj.getScaledHeight()),
      rotation: Math.round(obj.angle || 0)
    });
  };

  // Delete the selected object
  const deleteSelectedObject = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type === 'activeSelection') {
        // If multiple objects are selected
        activeObject.forEachObject(obj => {
          canvas.remove(obj);
        });
      } else {
        // If a single object is selected
        canvas.remove(activeObject);
      }

      canvas.discardActiveObject();
      canvas.renderAll();
      setSelectedObject(null);
      setDimensions({ width: 0, height: 0, rotation: 0 });
    }
  };

  // Zoom functions
  const zoomIn = () => {
    if (!canvas) return;
    const newZoom = Math.min(zoom * 1.2, 5); // Limit max zoom to 5x
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
    setZoom(newZoom);

    // Update grid scale
    updateGridWithZoom(canvas, newZoom);

    canvas.renderAll();
  };

  const zoomOut = () => {
    if (!canvas) return;
    
    // Get the current viewport center point
    const viewportTransform = canvas.viewportTransform;
    const centerPoint = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };

    // Calculate new zoom level
    const newZoom = Math.max(zoom / 1.2, 1); // Limit min zoom to 0.1x
    const zoomFactor = newZoom / zoom;

    // Adjust viewport transform to zoom around center
    viewportTransform[0] = newZoom;
    viewportTransform[3] = newZoom;
    viewportTransform[4] = centerPoint.x - (centerPoint.x * zoomFactor);
    viewportTransform[5] = centerPoint.y - (centerPoint.y * zoomFactor);

    // Apply the new viewport transform
    canvas.setViewportTransform(viewportTransform);
    
    setZoom(newZoom);

    // Update grid scale
    updateGridWithZoom(canvas, newZoom);

    canvas.renderAll();
  };

  // Toggle drawing mode on and off
  const toggleFreeDrawing = (isEnabled) => {
    setFreeDrawing(isEnabled);

    // If turning off drawing mode, make sure we restore selection ability
    if (!isEnabled && canvas) {
      canvas.selection = true;
    }
  };

  return (
    <div className="work-space" data-title="Build space">
      <div className="workspace-layout">
        {/* Left sidebar */}
        <div className="sidebar-container">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="main-content">
          {/* Top dimension bar */}
          <div className="dimension-bar-container">
            <DimensionBar
              width={dimensions.width}
              height={dimensions.height}
              rotation={dimensions.rotation}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onDelete={deleteSelectedObject}
              hasSelection={!!selectedObject}
            />
          </div>
          
          {/* Canvas area with drawing tools and dimensions panel */}
          <div className="canvas-area">
            {/* Left drawing tools */}
            <div className="drawing-tools-container">
              <DrawingTools toggleFreeDrawing={toggleFreeDrawing} isFreeDrawing={freeDrawing} />
            </div>
            
            {/* Center canvas */}
            <div className="canvas-container">
              <canvas
                id="fabricCanvas"
                className="canvas-wrapper"
                width="1000"
                height="600"
                ref={canvasEl}
              />
              {/* <ControlPanel /> */}
            </div>
            
            {/* Right dimensions panel */}
            <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
             className="dimensions-panel-container">
              <DimensionsPanel />
              <ControlPanel />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer command buttons */}
      <div className="footer-container">
        <CommandButtons />
      </div>
    </div>
  );
};

export default Workspace;