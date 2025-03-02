// FabricCanvasManager.js
export class FabricCanvasManager {
    constructor(containerDiv, dim_bar) {
      // Create and append the canvas element to the provided container div
      this.canvasEl = document.createElement('canvas');
      containerDiv.appendChild(this.canvasEl);
  
      // Initialize the Fabric.js canvas
      this.canvas = new fabric.Canvas(this.canvasEl);
      initCenteringGuidelines(this.canvas);
      initAligningGuidelines(this.canvas);
  
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
        const scaledWidth = (obj.getScaledWidth()*this.scaleY).toFixed(3);
        const scaledHeight = (obj.getScaledHeight()*this.scaleY).toFixed(3);
        const angle = (obj.angle || 0).toFixed(2);
        
        const width_dim = dim_bar.querySelector('#width_dim');
        const height_dim = dim_bar.querySelector('#height_dim');
        const rotation_dim = dim_bar.querySelector('#rotation_dim');
        
        width_dim.innerHTML = `Width: ${scaledWidth}mm`;
        height_dim.innerHTML = `Height: ${scaledHeight}mm`;
        rotation_dim.innerHTML = `Rotation: ${angle}°`;
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
        const scaledWidth = (obj.getScaledWidth()*this.scaleY).toFixed(3);
        const scaledHeight = (obj.getScaledHeight()*this.scaleY).toFixed(3);
        // dim_bar.innerHTML = `<p>Width: ${scaledWidth}mm</p>  <p>Height: ${scaledHeight}mm</p>`;
        const width_dim = dim_bar.querySelector('#width_dim');
        const height_dim = dim_bar.querySelector('#height_dim');
        width_dim.innerHTML = `Width: ${scaledWidth}mm`;
        height_dim.innerHTML = `Height: ${scaledHeight}mm`;
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
      //this.drawGrid();

    }


    drawGrid(gridSize = 20, gridColor = '#FFFFFF') {
      const width = this.canvas.getWidth();
      const height = this.canvas.getHeight();
      const gridGroup = new fabric.Group([], {// Create a grid pattern using Fabric.js Path
          selectable: false,
          evented: false, // Make the grid non-interactive
          isGrid: true,
          opacity: 0.05,
      });
      for (let i = 0; i <= width; i += gridSize) {// Draw vertical lines
          const line = new fabric.Line([i, 0, i, height], {
              stroke: gridColor,
              strokeWidth: 1,
              selectable: false,
              evented: false,
          });
          gridGroup.add(line);
      }
      for (let i = 0; i <= height; i += gridSize) {// Draw horizontal lines
          const line = new fabric.Line([0, i, width, i], {
              stroke: gridColor,
              strokeWidth: 1,
              selectable: false,
              evented: false,
          });
          gridGroup.add(line);
      }
      // Add the grid to the canvas
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

    //////new rect with paths =====
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
    //     selectable: true,
    //     originX: 'center',
    //     originY: 'center',
    //     top: this.canvas.height / 2,
    //     left: this.canvas.width / 2,
    //     name: 'rectangle',
    //     snapAngle: 45,
    //     snapThreshold: 5,
    //   });
    //   this.canvas.add(rect);
    // }
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
    getSvg(){
        return this.canvas.toSVG({ suppressPreamble: true });
    }
    
  }
  