import { useEffect, useRef } from 'react';

export default function useCanvasManager(containerRef, dimBarRef) {
  const canvasManagerRef = useRef(null);
  
  useEffect(() => {
    const loadCanvasManager = async () => {
      if (containerRef.current && dimBarRef.current) {
        const { FabricCanvasManager } = await import('../utils/fab_canvas.js');
        canvasManagerRef.current = new FabricCanvasManager(
          containerRef.current, 
          dimBarRef.current
        );
      }
    };
    
    loadCanvasManager();
  }, []);
  
  const drawRectangle = () => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.drawRectangle();
    }
  };
  
  const drawCircle = () => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.drawCircle();
    }
  };
  
  const deleteSelected = () => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.deleteSelected();
    }
  };
  
  const zoomIn = () => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.zoomIn();
    }
  };
  
  const zoomOut = () => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.zoomOut();
    }
  };
  
  const collectObjects = () => {
    if (canvasManagerRef.current) {
      return canvasManagerRef.current.collectObjects();
    }
    return [];
  };
  
  const getSvg = () => {
    if (canvasManagerRef.current) {
      return canvasManagerRef.current.getSvg();
    }
    return '';
  };
  
  const drawPartShape = (partData) => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.drawPartShape(partData);
    }
  };
  
  return {
    drawRectangle,
    drawCircle,
    deleteSelected,
    zoomIn,
    zoomOut,
    collectObjects,
    getSvg,
    drawPartShape
  };
}
