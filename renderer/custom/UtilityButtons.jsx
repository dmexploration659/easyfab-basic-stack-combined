import React, { useEffect } from 'react';
import { useCanvas } from './CanvasContext';
import { exportSVG, generateGCode } from '../utils/exportUtils';

const UtilityButtons = () => {
  const { canvas } = useCanvas();

  const handleSendSVG = () => {
    if (!canvas) return;
    
    const svgData = exportSVG(canvas);
    
    // Create a file and trigger download
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'canvas_export.svg';
    link.click();
    
    console.log('SVG exported and download triggered');
  };

  const handleExportGCode = () => {
    if (!canvas) return;
    
    const gcode = generateGCode(canvas);
    
    // Create a file and trigger download
    const blob = new Blob([gcode], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'canvas_export.gcode';
    link.click();
    
    console.log('G-code exported and download triggered');
  };

  // Handle build action
  const handleBuild = () => {
    console.log('Build action triggered');
    // Implement your build functionality here
  };

  // Handle send JSON action
  const handleSendJSON = () => {
    console.log('Send JSON action triggered');
    // Implement your send JSON functionality here
  };

  useEffect(() => {
    // Set up a listener for menu actions
    const menuActionHandler = (action) => {
      switch (action) {
        case 'build':
          handleBuild();
          break;
        case 'send-svg':
          handleSendSVG();
          break;
        case 'export-gcode':
          handleExportGCode();
          break;
        case 'send-json':
          handleSendJSON();
          break;
        default:
          console.log(`Unknown menu action: ${action}`);
      }
    };

    // Register the listener
    window.electronAPI.onMenuAction(menuActionHandler);

    // Clean up the listener when component unmounts
    return () => {
      // Note: Electron doesn't provide a direct way to remove listeners from preload,
      // but in a real app you might use a custom event system that supports removal
    };
  }, [canvas]); // Re-register when canvas changes

  // No UI is rendered as functionality is now in the menu
  return null;
};

export default UtilityButtons;