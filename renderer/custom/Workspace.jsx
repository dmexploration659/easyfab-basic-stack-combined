import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import CommandButtons from './CommandButtons';
import DrawingTools from './DrawingTools';
import ControlPanel from './ControlPanel';
import DimensionBar from './DimensionBar';
import DimensionsPanel from './DimensionPanel';
import Sidebar from './Sidebar';
import { useCanvas } from './CanvasContext';
import {
  createGrid,
  removeAllGuideLines,
  showSmartGuides,
  updateGridWithZoom
} from '../utils/canvasUtils';

const Workspace = () => {
  const canvasEl = useRef(null);
  const canvasContainerRef = useRef(null);
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
    if (!canvasEl.current || !canvasContainerRef.current) return;

    // Get container dimensions
    const containerWidth = canvasContainerRef.current.clientWidth;
    const containerHeight = canvasContainerRef.current.clientHeight;

    const options = {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: '#1a1a1a',
      isDrawingMode: false,
      originX: 'left',   // Set origin to left
      originY: 'bottom'  // Set origin to bottom
    };

    const fabricCanvas = new fabric.Canvas(canvasEl.current, options);
    const height = (fabricCanvas.height-10)


    // Create origin marker (red dot with white border)
    const originMarker = new fabric.Circle({
      left: 0,
      top: height, // Position at bottom left
      radius: 3,
      fill: 'red',
      stroke: 'white',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectCaching: false
    });

    // Create small precise origin point
    const preciseOriginMarker = new fabric.Circle({
      left: 0,
      top: fabricCanvas.height,
      radius: 3,
      fill: 'white',
      selectable: false,
      evented: false,
      objectCaching: false
    });

    // Add origin markers to canvas
    fabricCanvas.add(originMarker, preciseOriginMarker);

    // Coordinate system lines
    const xAxisLine = new fabric.Line([0, fabricCanvas.height, fabricCanvas.width, fabricCanvas.height], {
      stroke: 'rgba(255,255,255,0.5)',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });

    const yAxisLine = new fabric.Line([0, fabricCanvas.height, 0, 0], {
      stroke: 'rgba(255,255,255,0.5)',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });

    fabricCanvas.add(xAxisLine, yAxisLine);

    // Create grid
    createGrid(fabricCanvas);

    // Set up free drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = 'red';
    fabricCanvas.freeDrawingBrush.width = 2;

    // Object selection events
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
      removeAllGuideLines(fabricCanvas);
    });

    // Keyboard delete event
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && fabricCanvas.getActiveObject()) {
        deleteSelectedObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Handle window resize
    const handleResize = () => {
      const newWidth = canvasContainerRef.current.clientWidth;
      const newHeight = canvasContainerRef.current.clientHeight;
      
      fabricCanvas.setWidth(newWidth);
      fabricCanvas.setHeight(newHeight);
      fabricCanvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    // Set canvas in context
    setCanvas(fabricCanvas);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [setCanvas, setSelectedObject]);

  // Update dimensions display
  const updateDimensions = (obj) => {
    if (!obj) return;

    setDimensions({
      width: Math.round(obj.getScaledWidth()),
      height: Math.round(obj.getScaledHeight()),
      rotation: Math.round(obj.angle || 0)
    });
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type === 'activeSelection') {
        activeObject.forEachObject(obj => {
          canvas.remove(obj);
        });
      } else {
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
    const newZoom = Math.min(zoom * 1.2, 5);
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, newZoom);
    setZoom(newZoom);
    updateGridWithZoom(canvas, newZoom);
    canvas.renderAll();
  };

  const zoomOut = () => {
    if (!canvas) return;
    
    const viewportTransform = canvas.viewportTransform;
    const centerPoint = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };

    const newZoom = Math.max(zoom / 1.2, 1);
    const zoomFactor = newZoom / zoom;

    viewportTransform[0] = newZoom;
    viewportTransform[3] = newZoom;
    viewportTransform[4] = centerPoint.x - (centerPoint.x * zoomFactor);
    viewportTransform[5] = centerPoint.y - (centerPoint.y * zoomFactor);

    canvas.setViewportTransform(viewportTransform);
    
    setZoom(newZoom);
    updateGridWithZoom(canvas, newZoom);
    canvas.renderAll();
  };

  // Toggle drawing mode
  const toggleFreeDrawing = (isEnabled) => {
    setFreeDrawing(isEnabled);

    if (!isEnabled && canvas) {
      canvas.selection = true;
    }
  };

  return (
    <div className="work-space" data-title="Build space">
      <div className="workspace-layout">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        
        <div className="main-content">
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
          
          <div className="canvas-area">
            <div className="drawing-tools-container">
              <DrawingTools 
                toggleFreeDrawing={toggleFreeDrawing} 
                isFreeDrawing={freeDrawing} 
              />
            </div>
            
            <div 
              ref={canvasContainerRef}
              className="canvas-container"
              style={{
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              <canvas
                id="fabricCanvas"
                className="canvas-wrapper"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                ref={canvasEl}
              />
            </div>
            
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }} 
              className="dimensions-panel-container"
            >
              <DimensionsPanel />
              <ControlPanel />
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-container">
        <CommandButtons />
      </div>
    </div>
  );
};

export default Workspace;