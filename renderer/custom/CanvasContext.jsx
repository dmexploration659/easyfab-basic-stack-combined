// src/CanvasContext.js
import React, { createContext, useContext, useState } from 'react';

const CanvasContext = createContext(null);

export const CanvasProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [drawingMode, setDrawingMode] = useState('select');
  const [freeDrawing, setFreeDrawing] = useState(false);
  
  return (
    <CanvasContext.Provider 
      value={{
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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};