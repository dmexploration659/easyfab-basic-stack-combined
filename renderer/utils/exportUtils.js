import * as fabric from 'fabric';

/**
 * Export canvas as SVG data
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @returns {string} - SVG content as string
 */
export const exportSVG = (canvas) => {
  // Remove grid lines temporarily for export
  const gridLines = canvas.getObjects().filter(obj => obj.id === 'grid');
  
  // Save grid visibility state and hide grid for export
  const gridVisible = gridLines.map(line => ({
    obj: line,
    visible: line.visible
  }));
  
  gridVisible.forEach(item => {
    item.obj.visible = false;
  });
  
  // Get SVG from canvas
  const svgData = canvas.toSVG({
    viewBox: {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    },
    width: canvas.width,
    height: canvas.height
  });
  
  // Restore grid visibility
  gridVisible.forEach(item => {
    item.obj.visible = item.visible;
  });
  
  canvas.renderAll();
  
  return svgData;
};

/**
 * Generate G-code from canvas objects
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @returns {string} - G-code content as string
 */
export const generateGCode = (canvas) => {
  // Initialize G-code with setup commands
  let gcode = `;G-code generated from canvas\n`;
  gcode += `G21 ; Set units to millimeters\n`;
  gcode += `G90 ; Use absolute coordinates\n`;
  gcode += `G92 X0 Y0 Z0 ; Set current position as origin\n\n`;
  
  // Define conversion factor from canvas units to mm
  // Adjust this based on your specific requirements
  const SCALE_FACTOR = 0.1; // 10 canvas units = 1mm
  
  // Function to generate G-code for a path
  const generatePathGCode = (path) => {
    const pathData = path.path;
    let pathGCode = `; Path object\n`;
    pathGCode += `G0 Z5 ; Lift pen/tool\n`; // Lift tool before moving to new path
    
    let firstPoint = true;
    
    // Process each segment in the path
    for (let i = 0; i < pathData.length; i++) {
      const segment = pathData[i];
      const command = segment[0]; // M, L, C, etc.
      
      switch (command) {
        case 'M': // Move to
          const x = segment[1] * SCALE_FACTOR;
          const y = segment[2] * SCALE_FACTOR;
          pathGCode += `G0 X${x.toFixed(3)} Y${y.toFixed(3)} ; Move to start point\n`;
          if (firstPoint) {
            pathGCode += `G0 Z0 ; Lower pen/tool\n`; // Lower tool at the start of the path
            firstPoint = false;
          }
          break;
          
        case 'L': // Line to
          const lineX = segment[1] * SCALE_FACTOR;
          const lineY = segment[2] * SCALE_FACTOR;
          pathGCode += `G1 X${lineX.toFixed(3)} Y${lineY.toFixed(3)} ; Line\n`;
          break;
          
        case 'C': // Bezier curve - approximate with small line segments
          // For curves, we need to approximate using multiple line segments
          const startX = pathData[i-1][1] * SCALE_FACTOR;
          const startY = pathData[i-1][2] * SCALE_FACTOR;
          const endX = segment[5] * SCALE_FACTOR;
          const endY = segment[6] * SCALE_FACTOR;
          
          // Create 10 points along the curve (simplified approximation)
          for (let t = 0.1; t <= 1; t += 0.1) {
            const bezierX = bezierPoint(
              startX, 
              segment[1] * SCALE_FACTOR, 
              segment[3] * SCALE_FACTOR, 
              endX, 
              t
            );
            const bezierY = bezierPoint(
              startY, 
              segment[2] * SCALE_FACTOR, 
              segment[4] * SCALE_FACTOR, 
              endY, 
              t
            );
            pathGCode += `G1 X${bezierX.toFixed(3)} Y${bezierY.toFixed(3)} ; Curve segment\n`;
          }
          break;
          
        // Add more cases for other path commands as needed
      }
    }
    
    pathGCode += `G0 Z5 ; Lift pen/tool\n`; // Lift tool at the end of the path
    return pathGCode;
  };
  
  // Helper function for bezier curve point calculation
  const bezierPoint = (p0, p1, p2, p3, t) => {
    const mt = 1 - t;
    return mt*mt*mt*p0 + 3*mt*mt*t*p1 + 3*mt*t*t*p2 + t*t*t*p3;
  };
  
  // Process each object in the canvas
  canvas.getObjects().forEach(obj => {
    // Skip grid lines and background elements
    if (obj.id === 'grid' || obj.id === 'background') {
      return;
    }
    
    if (obj.type === 'path') {
      // Handle free-drawn paths
      gcode += generatePathGCode(obj);
    } else if (obj.type === 'rect') {
      // Handle rectangles
      const left = obj.left * SCALE_FACTOR;
      const top = obj.top * SCALE_FACTOR;
      const width = obj.width * obj.scaleX * SCALE_FACTOR;
      const height = obj.height * obj.scaleY * SCALE_FACTOR;
      
      gcode += `; Rectangle object\n`;
      gcode += `G0 Z5 ; Lift pen/tool\n`;
      gcode += `G0 X${left.toFixed(3)} Y${top.toFixed(3)} ; Move to start\n`;
      gcode += `G0 Z0 ; Lower pen/tool\n`;
      gcode += `G90 X${(left + width).toFixed(3)} Y${top.toFixed(3)} ; Top line\n`;
      gcode += `G90 X${(left + width).toFixed(3)} Y${(top + height).toFixed(3)} ; Right line\n`;
      gcode += `G90 X${left.toFixed(3)} Y${(top + height).toFixed(3)} ; Bottom line\n`;
      gcode += `G90 X${left.toFixed(3)} Y${top.toFixed(3)} ; Left line\n`;
      gcode += `G0 Z5 ; Lift pen/tool\n\n`;
    } else if (obj.type === 'circle') {
      // Handle circles with approximation
      const centerX = obj.left * SCALE_FACTOR;
      const centerY = obj.top * SCALE_FACTOR;
      const radius = obj.radius * obj.scaleX * SCALE_FACTOR;
      
      gcode += `; Circle object\n`;
      gcode += `G0 Z5 ; Lift pen/tool\n`;
      
      // Approximate circle with 36 line segments (every 10 degrees)
      for (let angle = 0; angle <= 360; angle += 10) {
        const radian = (angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(radian);
        const y = centerY + radius * Math.sin(radian);
        
        if (angle === 0) {
          gcode += `G0 X${x.toFixed(3)} Y${y.toFixed(3)} ; Move to start of circle\n`;
          gcode += `G0 Z0 ; Lower pen/tool\n`;
        } else {
          gcode += `G90 X${x.toFixed(3)} Y${y.toFixed(3)} ; Circle segment\n`;
        }
      }
      
      gcode += `G0 Z5 ; Lift pen/tool\n\n`;
    }
    // Add handlers for other object types as needed
  });
  
  // Add end code
  gcode += `\nG0 X0 Y0 ; Return to origin\n`;
  gcode += `M2 ; End program\n`;
  
  return gcode;
};