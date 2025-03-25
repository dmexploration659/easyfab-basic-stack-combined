// FabricCanvasManager.js
export class FabricCanvasManager {
    constructor(containerDiv, dim_bar, shape_config_bar) {
      // Create and append the canvas element to the provided container div
      this.canvasEl = document.createElement('canvas');
      containerDiv.appendChild(this.canvasEl);


  
      // Initialize the Fabric.js canvas
      this.canvas = new fabric.Canvas(this.canvasEl);
      initCenteringGuidelines(this.canvas);
      initAligningGuidelines(this.canvas);
      ///+++++++++++++++++++++++++++++++++++++++++++++++++++++///

    //       // Add zoom properties
    this.canvas.zoomLevel = 1;
    this.canvas.minZoom = 1;
    this.canvas.maxZoom = 8;
    
    // Add mouse wheel zoom handler
    this.canvas.on('mouse:wheel', (opt) => {
        const delta = opt.e.deltaY;
        let zoom = this.canvas.getZoom();
        zoom *= 0.999 ** delta;
        
        // Limit zoom to reasonable values
        zoom = Math.min(Math.max(this.canvas.minZoom, zoom), this.canvas.maxZoom);
        
        // Get mouse position
        const pointer = this.canvas.getPointer(opt.e);
        
        // Set zoom point (zoom towards mouse position)
        this.canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom);
        
        // Prevent page scrolling
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });

    // Add pan functionality when space is held down
    let isPanning = false;
    let lastPosX;
    let lastPosY;
    let isSpacePressed = false;  // Add this to track space key state

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();  // Prevent page scroll
            isSpacePressed = true;
            this.canvas.defaultCursor = 'grab';
            this.canvas.setCursor('grab');
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            isSpacePressed = false;
            this.canvas.defaultCursor = 'default';
            this.canvas.setCursor('default');
            isPanning = false;
        }
    });

    this.canvas.on('mouse:down', (opt) => {
        if (isSpacePressed || opt.e.shiftKey || opt.e.altKey) {
            isPanning = true;
            lastPosX = opt.e.clientX;
            lastPosY = opt.e.clientY;
            this.canvas.defaultCursor = 'grabbing';
            this.canvas.setCursor('grabbing');
        }
    });

    this.canvas.on('mouse:move', (opt) => {
        if (isPanning && (isSpacePressed || opt.e.shiftKey || opt.e.altKey)) {
            const deltaX = opt.e.clientX - lastPosX;
            const deltaY = opt.e.clientY - lastPosY;
            lastPosX = opt.e.clientX;
            lastPosY = opt.e.clientY;

            const delta = new fabric.Point(deltaX, deltaY);
            this.canvas.relativePan(delta);
        }
    });

    this.canvas.on('mouse:up', () => {
        isPanning = false;
        this.canvas.defaultCursor = 'default';
        this.canvas.setCursor('default');
    });





      ///+++++++++++++++++++++++++++++++++++++++++++++++++++++///

      // Set initial canvas dimensions to match the container
      this.resizeCanvas();
  
      // Initialize part count
      this.partCount = 0;
  
      // Unit to pixels conversion factors
      this.unitToPixels = {
        mm: 3.78,
        cm: 37.8,
        m: 3780,
      };
      this.all_in_mm = {
        mm: 1,
        cm: 10,
        m: 1000,
      }


      this.scaleY = 1000 / this.canvas.height;
  
      // Bind the resize event to the resizeCanvas method
      window.addEventListener('resize', () => this.resizeCanvas());
      
      const updateDimensions = (obj) => {
        console.log('obj^^^^',obj);
        const scaledWidth = this.pixelsToMetrics(obj.getScaledWidth(),'mm');
        const scaledHeight = this.pixelsToMetrics(obj.getScaledHeight(),'mm');
        console.log('scaledWidth',obj.getScaledWidth());
        console.log('scaledHeight',obj.getScaledWidth());
        const angle = (obj.angle || 0).toFixed(2);
        
        const width_dim = dim_bar.querySelector('#width_dim');
        const height_dim = dim_bar.querySelector('#height_dim');
        const rotation_dim = dim_bar.querySelector('#rotation_dim');
        const shape_conf_w = shape_config_bar.querySelector('#width_input');
        const shape_conf_h = shape_config_bar.querySelector('#height_input');
        const shape_conf_t = shape_config_bar.querySelector('#thickness_input');

        width_dim.innerHTML = `Width: ${scaledWidth}mm`;
        shape_conf_w.value = scaledWidth;
        height_dim.innerHTML = `Height: ${scaledHeight}mm`;
        shape_conf_h.value = scaledHeight;
        rotation_dim.innerHTML = `Rotation: ${angle}°`;
        shape_conf_t.value = obj.data.thickness;
      };
      const clearDimensions = () => {
        const width_dim = dim_bar.querySelector('#width_dim');
        const height_dim = dim_bar.querySelector('#height_dim');
        const rotation_dim = dim_bar.querySelector('#rotation_dim');
        
        width_dim.innerHTML = 'Width: -';
        height_dim.innerHTML = 'Height: -';
        rotation_dim.innerHTML = 'Rotation: -';
      };

      const self = this;
      this.canvas.on('object:scaling', function(event) {
        const obj = event.target;
        const scaledWidth = self.pixelsToMetrics(obj.getScaledWidth(),'mm');
        const scaledHeight = self.pixelsToMetrics(obj.getScaledHeight(),'mm');
        
        const width_dim = dim_bar.querySelector('#width_dim');
        const height_dim = dim_bar.querySelector('#height_dim');
        width_dim.innerHTML = `Width: ${scaledWidth}mm`;
        height_dim.innerHTML = `Height: ${scaledHeight}mm`;
        
        // Force canvas to render the scaling in real-time
        obj.setCoords();
        self.canvas.renderAll();
        
        console.log('Scaled Width:', scaledWidth);
        console.log('Scaled Height:', scaledHeight);
      });

      this.canvas.on('object:rotating', function(event) {
        const obj = event.target;
        const angle = (obj.angle).toFixed(2);
        console.log('Rotation Angle:', angle);
        const rotation_dim = dim_bar.querySelector('#rotation_dim');
        rotation_dim.innerHTML = `Rotation: ${angle}°`;
      });

      this.canvas.on('selection:updated', function(event) {
        const obj = event.selected[0];
        updateDimensions(obj);
      });
      this.canvas.on('selection:cleared', function() {
        clearDimensions();
      });
      this.canvas.on('selection:created', function(event) {
        const obj = event.selected[0];
        updateDimensions(obj);
      });
      this.drawGrid();

    }

    drawGrid(gridSize = 20, gridColor = '#FFFFFF') {
      const width = this.canvas.getWidth();
      const height = this.canvas.getHeight();
      const gridGroup = new fabric.Group([], {
        selectable: false,
        evented: false,
        isGrid: true, // Parent group property (optional, but useful for grouping)
        opacity: 0.05,
      });
    
      // Vertical lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new fabric.Line([i, 0, i, height], {
          stroke: gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          isGrid: true, // Mark individual lines as grid
        });
        gridGroup.add(line);
      }
    
      // Horizontal lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new fabric.Line([0, i, width, i], {
          stroke: gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          isGrid: true, // Mark individual lines as grid
        });
        gridGroup.add(line);
      }
    
      this.canvas.add(gridGroup);
      this.canvas.renderAll();
    }


 
    resizeCanvas() { // Method to resize the canvas to match its container
      const container = this.canvasEl.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        this.canvas.setWidth(containerWidth);
        this.canvas.setHeight(containerHeight);
        this.canvas.renderAll();
      } else {
        console.error('Canvas container not found!');
      }
    }

    ////new rect with paths =====
    drawRectangle() {
      // Define the rectangle's dimensions
      const width = 50;
      const height = 50;
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      // Determine the center of the canvas
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      // Create a path string for a rectangle centered on the canvas.
      // The path moves to the top-left corner and draws lines to each corner, closing the path.
      const pathStr = `
        M ${centerX - halfWidth} ${centerY - halfHeight}
        L ${centerX + halfWidth} ${centerY - halfHeight}
        L ${centerX + halfWidth} ${centerY + halfHeight}
        L ${centerX - halfWidth} ${centerY + halfHeight}
        Z
      `;
    
      const rectPath = new fabric.Path(pathStr, {
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 1,
        strokeUniform: true,
        selectable: true,
        name: 'rectangle',
        snapAngle: 45,
        snapThreshold: 5,
      });
    
      this.canvas.add(rectPath);
    }
      
    // drawRectangle() {// Method to draw a rectangle on the canvas
    //   const rect = new fabric.Rect({
    //     fill: 'transparent',
    //     stroke: 'red',
    //     strokeWidth: 1,
    //     strokeUniform: true,
    //     width: 50,
    //     height: 50,
    //     width: 50,
    //     height: 50,
    //     selectable: true,
    //     originX: 'center',
    //     originY: 'center',
    //     top: this.canvas.height / 2,
    //     left: this.canvas.width / 2,
    //     name: 'rectangle',
    //     snapAngle: 45,
    //     snapThreshold: 5,
    //     noScaleCache: false,
    //     objectCaching: false
    //   });
    //   this.canvas.add(rect);
    // }

    //----draw line --------------------------------

    drawLine() {
      // Calculate canvas center
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      
      // Define the line length
      const length = 100;
      
      // The coordinates array is: [x1, y1, x2, y2]
      // This will create a horizontal line centered at the canvas.
      const x1 = centerX - length / 2;
      const y1 = centerY;
      const x2 = centerX + length / 2;
      const y2 = centerY;
      
      // Create the line
      const line = new fabric.Line([x1, y1, x2, y2], {
        stroke: 'red',
        strokeWidth: 2,
        strokeUniform: true,
        selectable: true,
        name: 'line',
        snapAngle: 45,
        snapThreshold: 5,
      });
      
      // Add the line to the canvas
      this.canvas.add(line);
    }


    //-------line --------------------------------

    //--------------------poly line --------------

    enablePolylineDrawing() {
      // If needed, check if this.canvas is valid
      if (!this.canvas) {
        console.error('No Fabric canvas found on this instance!');
        return;
      }
    
      let isDrawingPolyline = true;
      let polylinePoints = [];
      let polylinePreviewLine = null;
      let polylinePreviewShape = null;
    
      // Use this.canvas instead of the parameter
      const canvas = this.canvas;
    
      // Change cursor to indicate drawing mode
      canvas.defaultCursor = 'crosshair';
    
      // Event listeners
      canvas.on('mouse:down', onMouseDown);
      canvas.on('mouse:move', onMouseMove);
      canvas.on('mouse:dblclick', onDblClick);
    
      console.log('Polyline drawing mode activated. Click to add points, double-click to finish.');
    
      function onMouseDown(opt) {
        if (!isDrawingPolyline) return;
        const pointer = canvas.getPointer(opt.e);
        polylinePoints.push({ x: pointer.x, y: pointer.y });
    
        // Remove old preview line
        if (polylinePreviewLine) {
          canvas.remove(polylinePreviewLine);
          polylinePreviewLine = null;
        }
    
        // Update the preview of the entire polyline
        updatePreviewPolyline();
      }
    
      function onMouseMove(opt) {
        if (!isDrawingPolyline || polylinePoints.length === 0) return;
        const pointer = canvas.getPointer(opt.e);
    
        // Remove old preview line if it exists
        if (polylinePreviewLine) {
          canvas.remove(polylinePreviewLine);
        }
    
        // Draw a line from the last placed point to the current mouse position
        const lastPoint = polylinePoints[polylinePoints.length - 1];
        polylinePreviewLine = new fabric.Line(
          [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
          {
            stroke: 'red',
            strokeWidth: 2,
            selectable: false,
            evented: false,
          }
        );
    
        canvas.add(polylinePreviewLine);
        canvas.renderAll();
    
        updatePreviewPolyline(pointer);
      }
    
      function onDblClick(opt) {
        if (!isDrawingPolyline) return;
    
        // Make sure we have at least two points for a valid line
        if (polylinePoints.length < 2) {
          console.warn('Not enough points to create a polyline.');
          cleanupAndDeactivate();
          return;
        }
    
        // Create the Fabric.js Polyline with the collected points
        const polyline = new fabric.Polyline(polylinePoints, {
          fill: '',
          stroke: 'red',
          strokeWidth: 2,
          selectable: true,
        });
        canvas.add(polyline);
    
        console.log('Polyline finalized.');
        cleanupAndDeactivate();
      }
    
      function updatePreviewPolyline(pointer) {
        // Remove old preview polyline if any
        if (polylinePreviewShape) {
          canvas.remove(polylinePreviewShape);
        }
    
        // Build a temporary list of points: existing points + current mouse pointer (optional)
        let tempPoints = [...polylinePoints];
        if (pointer) {
          tempPoints.push({ x: pointer.x, y: pointer.y });
        }
    
        // Create a new polyline for preview (no fill, just a stroke)
        polylinePreviewShape = new fabric.Polyline(tempPoints, {
          fill: '',
          stroke: 'red',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
    
        canvas.add(polylinePreviewShape);
        canvas.renderAll();
      }
    
      function cleanupAndDeactivate() {
        isDrawingPolyline = false;
        canvas.defaultCursor = 'default';
    
        // Remove the temporary objects
        if (polylinePreviewLine) {
          canvas.remove(polylinePreviewLine);
          polylinePreviewLine = null;
        }
        if (polylinePreviewShape) {
          canvas.remove(polylinePreviewShape);
          polylinePreviewShape = null;
        }
    
        // Remove events
        canvas.off('mouse:down', onMouseDown);
        canvas.off('mouse:move', onMouseMove);
        canvas.off('mouse:dblclick', onDblClick);
    
        console.log('Polyline drawing mode deactivated.');
      }
    }
    









    //-------------------drow polyline end-----------




    //-------------------------------------other shapes-------------------------------------/

    drawShape(shape) {
      // Get the center of the canvas
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
    
      switch (shape.toLowerCase()) {
        case 'rectangle': {
          // Example: create a rectangle via a path (like your drawRectangle example)
          const width = 50;
          const height = 50;
          const halfWidth = width / 2;
          const halfHeight = height / 2;
    
          const pathStr = `
            M ${centerX - halfWidth} ${centerY - halfHeight}
            L ${centerX + halfWidth} ${centerY - halfHeight}
            L ${centerX + halfWidth} ${centerY + halfHeight}
            L ${centerX - halfWidth} ${centerY + halfHeight}
            Z
          `;
    
          const rectPath = new fabric.Path(pathStr, {
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 1,
            strokeUniform: true,
            selectable: true,
            name: 'rectangle',
            snapAngle: 45,
            snapThreshold: 5,
          });
    
          this.canvas.add(rectPath);
          break;
        }
    
        case 'circle': {
          // Example: create a circle using fabric.Circle
          const radius = 25;
          const circle = new fabric.Circle({
            radius,
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 1,
            strokeUniform: true,
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            name: 'circle',
            snapAngle: 45,
            snapThreshold: 5,
          });
    
          this.canvas.add(circle);
          break;
        }
    
        case 'ellipse': {
          // Example: create an ellipse using fabric.Ellipse
          const rx = 30; // radius x
          const ry = 20; // radius y
          const ellipse = new fabric.Ellipse({
            rx,
            ry,
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 1,
            strokeUniform: true,
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            name: 'ellipse',
            snapAngle: 45,
            snapThreshold: 5,
          });
    
          this.canvas.add(ellipse);
          break;
        }
    
        case 'triangle': {
          // Example: create a triangle using fabric.Triangle
          const size = 50;
          const triangle = new fabric.Triangle({
            width: size,
            height: size,
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 1,
            strokeUniform: true,
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            name: 'triangle',
            snapAngle: 45,
            snapThreshold: 5,
          });
    
          this.canvas.add(triangle);
          break;
        }
    
        case 'hexagon': {
          // Create a hexagon as a Polygon
          // A regular hexagon can be approximated using 6 points equally spaced around a circle
          const sideLength = 30; 
          const angle = (2 * Math.PI) / 6;
          const points = [];
    
          for (let i = 0; i < 6; i++) {
            points.push({
              x: centerX + sideLength * Math.cos(i * angle),
              y: centerY + sideLength * Math.sin(i * angle),
            });
          }
    
          const hexagon = new fabric.Polygon(points, {
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 1,
            strokeUniform: true,
            selectable: true,
            name: 'hexagon',
            snapAngle: 45,
            snapThreshold: 5,
          });
    
          this.canvas.add(hexagon);
          break;
        }
    
        case 'rhombus':
        case 'lozenge': {
          // A rhombus (lozenge) can be created as a rotated square, or via a path.
          // Let's do a simple diamond shape via 4 points (like a square rotated 45 degrees).
          const size = 40; // distance from center to each corner
          const points = [
            { x: centerX - size, y: centerY }, // left
            { x: centerX, y: centerY - size }, // top
            { x: centerX + size, y: centerY }, // right
            { x: centerX, y: centerY + size }, // bottom
          ];
    
          const rhombus = new fabric.Polygon(points, {
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 1,
            strokeUniform: true,
            selectable: true,
            name: 'rhombus',
            snapAngle: 45,
            snapThreshold: 5,
          });
    
          this.canvas.add(rhombus);
          break;
        }
    
        default:
          console.warn(`Unknown shape: ${shape}`);
          break;
      }
    }

    //-------------------------------------other shapes-------------------------------------/





    drawCircle() {// Method to draw a circle on the canvas
      const circle = new fabric.Circle({
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 1,
        strokeUniform: true,
        radius: 25,
        selectable: true,
        originX: 'center',
        originY: 'center',
        top: this.canvas.height / 2,
        left: this.canvas.width / 2,
        name: 'circle',
        snapAngle: 45,
        snapThreshold: 5,
        noScaleCache: false,
        objectCaching: false
      });
      this.canvas.add(circle);
    }
  
    // Method to draw a part shape on the canvas
    drawPartShape(partData) {
      this.partCount += 1;
  
      const partH = parseFloat(partData.length.val);
      const partW = parseFloat(partData?.width?.val || partData?.diameter?.val);
      const partHUnit = partData.length.unit;
      const partWUnit = partData?.width?.unit || partData?.diameter?.unit;
  
      // const hInPixels = this.convertToScaledPixels(partH, partHUnit).height;
      // const wInPixels = this.convertToScaledPixels(partW, partWUnit).width;
      const hInPixels = this.metricsToPixels(partH, partHUnit);
      const wInPixels = this.metricsToPixels(partW, partWUnit);
  
      const partRect = new fabric.Rect({
        fill: '#FDFBF6',
        width: wInPixels,
        height: hInPixels,
        selectable: true,
        originX: 'left',
        originY: 'bottom',
      });
  
    //   const labelFont = Math.min(18, hInPixels / 12);
      const labelText = `${this.partCount}/  ${partData.title} ${partData.length.val}${partData.length.unit}`;
      const partLabel = new fabric.Text(labelText, {
        fontSize: 9,
        fill: 'black',
        textAlign: 'center',
        originX: 'left',
        originY: 'left',
        angle: -90,
      });
  
      const partGroup = new fabric.Group([partRect, partLabel], {
        left: Math.random() * (this.canvas.width - wInPixels),
        top: Math.random() * (this.canvas.height - hInPixels),
        selectable: true,
        data: partData,
        snapAngle: 45,
        snapThreshold: 5,
        // lockScalingX: true,
        // lockScalingY: true,
      });
  
      this.canvas.add(partGroup);
    }

    //-------------------------------------draw part shape 2nd way-------------------------------------/
    drawPartShape2(partData){
      this.partCount += 1;
      const part_type = partData.data.type;
      const is_sheet_metal = part_type =='sheet_metal';
      const partH =is_sheet_metal ? parseFloat(partData.length) : 100;
      const partW = parseFloat(partData.width);
      const partUnit = partData.unit;
      console.log('partData', partData);
      console.log('partH', partH, 'partW', partW, 'partUnit', partUnit);
      const hInPixels = this.metricsToPixels(partH, partUnit); // 100; // Keep hardcoded height
      const wInPixels = this.metricsToPixels(partW, partUnit);
      // console.log('converted to px', partW, 'mm =', wInPixels, 'pixels');
      
      const pathString = `
          M 0 0 
          L ${wInPixels} 0  
          L ${wInPixels} ${hInPixels} 
          L 0 ${hInPixels} 
          Z
      `;
      
      // console.log('partPath --- directly', pathString);
  
      const partPath = new fabric.Path(pathString, {
          fill: '#FDFBF6',
          selectable: true,
          originX: 'left',
          originY: 'bottom',
          lockScalingX: !is_sheet_metal,
          top: this.canvas.height / 2,
          left: this.canvas.width / 2,
          snapAngle: 45,
          snapThreshold: 5,
          data: partData,

      });  
      this.canvas.add(partPath);

  }
  


    //-------------------------------------draw part shape2 end-------------------------------------/



  
    // Method to convert dimensions to pixels
    convertToScaledPixels(length, unit) {
        const scaleX = this.canvas.width / (2 * this.unitToPixels.m); 
        const scaleY = this.canvas.height / (7 * this.unitToPixels.m)
        const lengthInPixels = length * this.unitToPixels[unit];
        console.log(lengthInPixels);
        console.log(lengthInPixels * this.scaleY)
        return {
          width: lengthInPixels * this.scaleY, 
          height: lengthInPixels * this.scaleY, 
        };
      }

      metricsToPixels(length, unit){
        const val_in_mm = length * this.all_in_mm[unit];
        const val_in_pixels = val_in_mm * this.scaleY;
        return val_in_pixels;
      }

      pixelsToMetrics(pixels, unit) {
        // Convert pixels to millimeters first
        const val_in_mm = pixels / this.scaleY;
    
        // Convert millimeters to the desired unit
        const val_in_unit = val_in_mm / this.all_in_mm[unit];
    
        return val_in_unit;
    }

    pxToMm(pixels) {
        const scaleY = 3000/this.canvas.height
        return  pixels * scaleY;;
      }
  
    // Method to delete a shape by its ID
    deleteShape(shapeId) {
      const object = this.canvas.getObjects().find(obj => obj.data && obj.data.id === shapeId);
      if (object) {
        this.canvas.remove(object);
      } else {
        console.error(`Shape with ID ${shapeId} not found!`);
      }
    }

    deleteSelected() {
        const activeObjects = this.canvas.getActiveObjects();
        if (activeObjects.length) {
          activeObjects.forEach((obj) => this.canvas.remove(obj));
          this.canvas.discardActiveObject();
          this.canvas.requestRenderAll();
        }
    }

    // Method to get all objects from the canvas
    collectObjects() {
          if (!this.canvas) {
            console.error('Canvas not found!');
            return "error: canvas not found";
          }
          const allObjects = this.canvas.getObjects().map(obj => {
            const start_x = obj.aCoords.bl.x*this.scaleY
            const start_y = (this.canvas.height - obj.aCoords.bl.y)*this.scaleY

            return {
              gcode_data: {
                shape: obj.name,
                width: (obj.getScaledWidth()*this.scaleY),
                height: (obj.getScaledHeight()*this.scaleY),
                radius: (obj.getScaledWidth()*this.scaleY)/2,
                start_x: start_x,
                start_y: start_y,
              },
              canvas_obj: obj
            }
          });
            
        return allObjects;
        
    }
    // getSvg(){
    //     return this.canvas.toSVG({ suppressPreamble: true });
    // }
    getSvg() {
      const gridObjects = this.canvas.getObjects().filter(obj => obj.isGrid);
      gridObjects.forEach(obj => this.canvas.remove(obj));
      const svg = this.canvas.toSVG({ suppressPreamble: true });
      gridObjects.forEach(obj => this.canvas.add(obj));
      this.canvas.renderAll();
      return svg;
    }


 ///+++++++++++++++++++++++++++++++++++++++++++++++++++++///

  zoomIn() {
      let zoom = this.canvas.getZoom();
      const oldZoom = zoom;
      zoom *= 1.1;
      zoom = Math.min(zoom, this.canvas.maxZoom);
      this.canvas.setZoom(zoom);
      this.canvas.getObjects().forEach(obj => {
        obj.strokeWidth = obj.strokeWidth * (oldZoom / zoom);
    });
  }
  
  zoomOut() {
      let zoom = this.canvas.getZoom();
      const oldZoom = zoom;
      zoom /= 1.1;
      zoom = Math.max(zoom, this.canvas.minZoom);
      this.canvas.setZoom(zoom);
      this.canvas.getObjects().forEach(obj => {
        obj.strokeWidth = obj.strokeWidth * (oldZoom / zoom);
    });
  }
  
  resetZoom() {
      this.canvas.setZoom(1);
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  }
  
  zoomToFit() {
      const objects = this.canvas.getObjects();
      if (objects.length === 0) return;
  
      const group = new fabric.Group(objects);
      const groupWidth = group.width * group.scaleX;
      const groupHeight = group.height * group.scaleY;
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
  
      const scaleX = canvasWidth / groupWidth;
      const scaleY = canvasHeight / groupHeight;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 0.9 to add some padding
  
      this.canvas.setZoom(scale);
      this.canvas.setViewportTransform([scale, 0, 0, scale, 
          (canvasWidth - groupWidth * scale) / 2,
          (canvasHeight - groupHeight * scale) / 2
      ]);
  
      // Clean up temporary group
      group.destroy();
      this.canvas.renderAll();

    }

///+++++++++++++++++++++++++++++++++++++++++++++++++++++///
    
  }
  