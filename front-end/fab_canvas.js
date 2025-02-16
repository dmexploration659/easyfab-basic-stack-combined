// FabricCanvasManager.js
export class FabricCanvasManager {
    constructor(containerDiv, dim_bar) {
      // Create and append the canvas element to the provided container div
      this.canvasEl = document.createElement('canvas');
      containerDiv.appendChild(this.canvasEl);
  
      // Initialize the Fabric.js canvas
      this.canvas = new fabric.Canvas(this.canvasEl);
  
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
  
      // Bind the resize event to the resizeCanvas method
      window.addEventListener('resize', () => this.resizeCanvas());

      const self = this;
      this.canvas.on('object:scaling', function(event) {
        const obj = event.target;
        const scaledWidth = (obj.getScaledWidth()*(1000/self.canvas.height)).toFixed(3);
        const scaledHeight = (obj.getScaledHeight()*(1000/self.canvas.height)).toFixed(3);
        dim_bar.innerHTML = `<p>Width: ${scaledWidth}mm</p>  <p>Height: ${scaledHeight}mm</p>`;
        console.log('Scaled Width:', scaledWidth);
        console.log('Scaled Height:', scaledHeight);
      });

    }
  
    // Method to resize the canvas to match its container
    resizeCanvas() {
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
  
    // Method to draw a rectangle on the canvas
    drawRectangle() {
      const rect = new fabric.Rect({
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 1,
        strokeUniform: true,
        width: 50,
        height: 50,
        selectable: true,
        originX: 'center',
        originY: 'center',
        top: this.canvas.height / 2,
        left: this.canvas.width / 2,
        name: 'rectangle',
      });
      this.canvas.add(rect);
    }
  
    // Method to draw a circle on the canvas
    drawCircle() {
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
  
      const hInPixels = this.convertToScaledPixels(partH, partHUnit).height;
      const wInPixels = this.convertToScaledPixels(partW, partWUnit).width;
  
      const partRect = new fabric.Rect({
        fill: '#555555',
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
        fill: 'white',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        angle: -90,
      });
  
      const partGroup = new fabric.Group([partRect, partLabel], {
        left: Math.random() * (this.canvas.width - wInPixels),
        top: Math.random() * (this.canvas.height - hInPixels),
        selectable: true,
        data: partData,
        lockScalingX: true,
        lockScalingY: true,
      });
  
      this.canvas.add(partGroup);
    }
  
    // Method to convert dimensions to pixels
    convertToScaledPixels(length, unit) {
        const scaleX = this.canvas.width / (2 * this.unitToPixels.m); 
        const scaleY = this.canvas.height / (7 * this.unitToPixels.m)
        const lengthInPixels = length * this.unitToPixels[unit];
        console.log(lengthInPixels);
        console.log(lengthInPixels * scaleX)
        return {
          width: lengthInPixels * scaleX, 
          height: lengthInPixels * scaleY, 
        };
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
            
              const scaleY = 1000 / this.canvas.height;
              const start_x = obj.aCoords.bl.x*scaleY
              const start_y = (this.canvas.height - obj.aCoords.bl.y)*scaleY

              return {
                gcode_data: {
                  shape: obj.name,
                  width: (obj.getScaledWidth()*scaleY),
                  height: (obj.getScaledHeight()*scaleY),
                  radius: (obj.getScaledWidth()*scaleY)/2,
                  start_x: start_x,
                  start_y: start_y,
                },
                canvas_obj: obj
              }
            });
           
            return allObjects;
        
    }
    
  }
  