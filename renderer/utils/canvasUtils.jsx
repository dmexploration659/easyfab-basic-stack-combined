import * as fabric from 'fabric';

// Function to create and add a guide line
export const createGuideLine = (coords, canvas) => {
  const line = new fabric.Line(coords, {
    stroke: '#0099ff',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5]
  });
  
  canvas.add(line);
  canvas.bringObjectToFront(line);
  return line;
};

// Function to remove all guide lines
export const removeAllGuideLines = (canvas) => {
  if (!canvas) return;
  
  // Remove existing guide lines
  canvas.getObjects().forEach(obj => {
    if (obj.guideLine === true) {
      canvas.remove(obj);
    }
  });
  
  canvas.renderAll();
};

// Function to show smart guides
export const showSmartGuides = (activeObj, canvas, SNAP_THRESHOLD = 10) => {
  if (!canvas) return;
  
  // First, remove any existing guide lines
  removeAllGuideLines(canvas);
  
  // Get all objects except the active one and grid lines
  const otherObjects = canvas.getObjects().filter(obj => {
    return obj !== activeObj && 
           obj.gridLine !== true && 
           obj.guideLine !== true;
  });
  
  if (otherObjects.length === 0) return;
  
  // The positions of the active object
  const activeObjCenter = activeObj.getCenterPoint();
  const activeObjBoundingRect = activeObj.getBoundingRect();
  const activeObjLeft = activeObjBoundingRect.left;
  const activeObjRight = activeObjLeft + activeObjBoundingRect.width;
  const activeObjTop = activeObjBoundingRect.top;
  const activeObjBottom = activeObjTop + activeObjBoundingRect.height;
  
  // Check alignment with each other object
  otherObjects.forEach(otherObj => {
    if (otherObj.excludeFromExport) return; // Skip grid lines
    
    const otherObjCenter = otherObj.getCenterPoint();
    const otherObjBoundingRect = otherObj.getBoundingRect();
    const otherObjLeft = otherObjBoundingRect.left;
    const otherObjRight = otherObjLeft + otherObjBoundingRect.width;
    const otherObjTop = otherObjBoundingRect.top;
    const otherObjBottom = otherObjTop + otherObjBoundingRect.height;
    
    // Check horizontal center alignment
    if (Math.abs(activeObjCenter.x - otherObjCenter.x) < SNAP_THRESHOLD) {
      // Snap to horizontal center
      activeObj.set({
        left: activeObj.left + (otherObjCenter.x - activeObjCenter.x)
      });
      
      // Create vertical guide line through centers
      const guideLine = createGuideLine(
        [otherObjCenter.x, 0, otherObjCenter.x, canvas.height],
        canvas
      );
      guideLine.guideLine = true;
    }
    
    // Check vertical center alignment
    if (Math.abs(activeObjCenter.y - otherObjCenter.y) < SNAP_THRESHOLD) {
      // Snap to vertical center
      activeObj.set({
        top: activeObj.top + (otherObjCenter.y - activeObjCenter.y)
      });
      
      // Create horizontal guide line through centers
      const guideLine = createGuideLine(
        [0, otherObjCenter.y, canvas.width, otherObjCenter.y],
        canvas
      );
      guideLine.guideLine = true;
    }
    
    // Check left edge alignment
    if (Math.abs(activeObjLeft - otherObjLeft) < SNAP_THRESHOLD) {
      // Snap left edges
      const diff = otherObjLeft - activeObjLeft;
      activeObj.set({
        left: activeObj.left + diff
      });
      
      // Create vertical guide line along left edges
      const guideLine = createGuideLine(
        [otherObjLeft, 0, otherObjLeft, canvas.height],
        canvas
      );
      guideLine.guideLine = true;
    }
    
    // Check right edge alignment
    if (Math.abs(activeObjRight - otherObjRight) < SNAP_THRESHOLD) {
      // Snap right edges
      const activeNewLeft = otherObjRight - activeObjBoundingRect.width;
      const diff = activeNewLeft - activeObjLeft;
      activeObj.set({
        left: activeObj.left + diff
      });
      
      // Create vertical guide line along right edges
      const guideLine = createGuideLine(
        [otherObjRight, 0, otherObjRight, canvas.height],
        canvas
      );
      guideLine.guideLine = true;
    }
    
    // Check top edge alignment
    if (Math.abs(activeObjTop - otherObjTop) < SNAP_THRESHOLD) {
      // Snap top edges
      const diff = otherObjTop - activeObjTop;
      activeObj.set({
        top: activeObj.top + diff
      });
      
      // Create horizontal guide line along top edges
      const guideLine = createGuideLine(
        [0, otherObjTop, canvas.width, otherObjTop],
        canvas
      );
      guideLine.guideLine = true;
    }
    
    // Check bottom edge alignment
    if (Math.abs(activeObjBottom - otherObjBottom) < SNAP_THRESHOLD) {
      // Snap bottom edges
      const activeNewTop = otherObjBottom - activeObjBoundingRect.height;
      const diff = activeNewTop - activeObjTop;
      activeObj.set({
        top: activeObj.top + diff
      });
      
      // Create horizontal guide line along bottom edges
      const guideLine = createGuideLine(
        [0, otherObjBottom, canvas.width, otherObjBottom],
        canvas
      );
      guideLine.guideLine = true;
    }
  });
  
  canvas.renderAll();
};

// Function to create grid
export const createGrid = (canvas, gridSize = 20, color = 'rgba(100, 100, 100, 0.3)') => {
  if (!canvas) return;
  const gridLines = [];
  
  // Create vertical lines
  for (let i = 0; i <= canvas.width / gridSize; i++) {
    const line = new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
      stroke: color,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      strokeWidth: 1
    });
    line.gridLine = true;
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
    line.gridLine = true;
    gridLines.push(line);
    canvas.add(line);
  }

  // Store grid lines for potential removal later
  canvas.gridLines = gridLines;

  // Make sure to render the canvas
  canvas.renderAll();
};

// Update grid when zooming
export const updateGridWithZoom = (canvas, newZoom) => {
  if (!canvas || !canvas.gridLines) return;
  
  // Make grid lines thinner when zooming in, thicker when zooming out
  const newThickness = 1 / newZoom;
  canvas.gridLines.forEach(line => {
    line.set({ strokeWidth: newThickness });
  });
};