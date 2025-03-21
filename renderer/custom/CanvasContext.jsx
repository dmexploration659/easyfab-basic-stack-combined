import React, { createContext, useContext, useState } from 'react';

// Create a context for the canvas
const CanvasContext = createContext(null);

// Create a provider for other components to access canvas
export const CanvasProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [drawingMode, setDrawingMode] = useState(null);
  const [freeDrawing, setFreeDrawing] = useState(false);

  return (
    <CanvasContext.Provider value={{ 
      canvas, 
      setCanvas, 
      selectedObject, 
      setSelectedObject,
      zoom,
      setZoom,
      drawingMode,
      setDrawingMode,
      freeDrawing,
      setFreeDrawing
    }}>
      {children}
    </CanvasContext.Provider>
  );
};

// Hook to use canvas in other components
export const useCanvas = () => useContext(CanvasContext);