import React from 'react';
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

  return (
    <div className="utils_btns">
      <button id="build_btn">Build</button>
      <button id="send_svg" onClick={handleSendSVG}>Send SVG</button>
      <button id="export_btn" onClick={handleExportGCode}>Export</button>
      <button id="send_json">Send JSON</button>
    </div>
  );
};

export default UtilityButtons;