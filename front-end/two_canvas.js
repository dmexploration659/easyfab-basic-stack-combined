export class TwoApp {
    constructor(containerId) {
        this.cncWidthMm = 3000;
        this.cncHeightMm = 2000;

        const container = document.getElementById(containerId);
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        this.two = new Two({
            width: containerWidth,
            height: containerHeight,
        }).appendTo(container);

        this.scaleFactor = Math.min(
            containerWidth / this.cncWidthMm,
            containerHeight / this.cncHeightMm
        );

        this.selectedShape = null;
        this.enableInteraction();
    }

    drawCircle(diameterMm) {
        const radiusMm = diameterMm / 2;
        const circle = this.two.makeCircle(
            this.cncWidthMm / 2 * this.scaleFactor,
            this.cncHeightMm / 2 * this.scaleFactor,
            radiusMm * this.scaleFactor
        );
        circle.fill = 'blue';
        circle.stroke = 'black';
        circle.linewidth = 1;
        circle.selectable = true;
        circle.onClick = () => this.selectShape(circle);
        this.two.update();
    }

    drawRectangle(widthMm, heightMm) {
        const rect = this.two.makeRectangle(
            this.cncWidthMm / 2 * this.scaleFactor,
            this.cncHeightMm / 2 * this.scaleFactor,
            widthMm * this.scaleFactor,
            heightMm * this.scaleFactor
        );
        rect.fill = 'green';
        rect.stroke = 'black';
        rect.linewidth = 1;
        rect.selectable = true;
        rect.onClick = () => this.selectShape(rect);
        this.two.update();
    }

    selectShape(shape) {
        console.log("selectShape called with:", shape);
        if (this.selectedShape) {
            this.selectedShape.stroke = 'black';
        }
        this.selectedShape = shape;
        if (shape) {
            shape.stroke = 'red';
        }
        this.two.update();
    }

    enableInteraction() {
        const two = this.two;
        let isDragging = false;
        let selectedShape = null;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const handleMouseDown = (event) => { // Separate function
            console.log("mousedown");
            const mouseX = event.clientX - two.renderer.domElement.offsetLeft;
            const mouseY = event.clientY - two.renderer.domElement.offsetTop;
            console.log("Mouse coordinates:", mouseX, mouseY);

            let foundShape = null;
            for (let i = two.scene.children.length - 1; i >= 0; i--) {
                const shape = two.scene.children[i];
                if (shape.selectable && this.isPointInShape(shape, mouseX, mouseY)) {
                    foundShape = shape;
                    break;
                }
            }

            if (foundShape) {
                selectedShape = foundShape;
                isDragging = true;
                this.selectShape(selectedShape);
                dragOffsetX = mouseX - selectedShape.translation.x;
                dragOffsetY = mouseY - selectedShape.translation.y;
            } else {
                this.selectShape(null);
            }
        };

        const handleMouseMove = (event) => { // Separate function
            console.log("mousemove");
            if (isDragging && selectedShape) {
                const mouseX = event.clientX - two.renderer.domElement.offsetLeft;
                const mouseY = event.clientY - two.renderer.domElement.offsetTop;

                selectedShape.translation.set(mouseX - dragOffsetX, mouseY - dragOffsetY);
                console.log("Shape position:", selectedShape.translation.x, selectedShape.translation.y);
                two.update();  // Ensure update is called
                console.log("two.update() called"); // Confirmation
            }
        };

        const handleMouseUp = () => { // Separate function
            console.log("mouseup");
            isDragging = false;
            selectedShape = null;
        };

        two.renderer.domElement.addEventListener('mousedown', handleMouseDown);
        two.renderer.domElement.addEventListener('mousemove', handleMouseMove);
        two.renderer.domElement.addEventListener('mouseup', handleMouseUp);
    }


    isPointInShape(shape, x, y) {
        console.log("isPointInShape called for:", shape, x, y);
        if (shape instanceof Two.Circle) {
            const dx = x - shape.translation.x;
            const dy = y - shape.translation.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const isInCircle = distance <= shape.radius;
            console.log("Distance:", distance, "Radius:", shape.radius, "In circle:", isInCircle);
            return isInCircle;
        } else if (shape instanceof Two.Rectangle) {
            const halfWidth = shape.width / 2;
            const halfHeight = shape.height / 2;
            const left = shape.translation.x - halfWidth;
            const top = shape.translation.y - halfHeight;
            const right = shape.translation.x + halfWidth;
            const bottom = shape.translation.y + halfHeight;
            const isInRect = x >= left && x <= right && y >= top && y <= bottom;
            console.log("Rectangle bounds:", left, top, right, bottom, "In rectangle:", isInRect);
            return isInRect;
        }
        return false;
    }
}





























// export class PaperApp {
//     constructor(canvasId, scaleFactor = 3.78) {
//         // Set up the Paper.js project
//         this.canvas = document.getElementById(canvasId);
//         paper.setup(this.canvas);

//         // Store the scale factor (1 unit = 1 mm)
//         this.scaleFactor = scaleFactor;

//         // Set default styles
//         paper.project.currentStyle = {
//             fillColor: 'blue',
//             strokeColor: 'yellow',
//             strokeWidth: 1 / this.scaleFactor, // Stroke width in mm
//         };
//     }

//     // Draw a circle with a given diameter in mm
//     drawCircle(diameterMm) {
//         const radiusMm = diameterMm / 2; // Convert diameter to radius
//         const radiusPixels = radiusMm * this.scaleFactor; // Convert mm to pixels
//         const center = paper.view.center; // Center of the canvas

//         // Create the circle
//         new paper.Path.Circle({
//             center: center,
//             radius: radiusPixels,
//         });
//     }

//     // Draw a rectangle with a given width and height in mm
//     drawRectangle(widthMm, heightMm) {
//         // Convert mm to pixels
//         const widthPixels = widthMm * this.scaleFactor;
//         const heightPixels = heightMm * this.scaleFactor;
    
//         // Calculate the top-left position to center the rectangle
//         const center = paper.view.center;
//         const position = new paper.Point(
//             center.x - widthPixels / 2, // X position
//             center.y - heightPixels / 2 // Y position
//         );
    
//         // Create the rectangle
//         new paper.Path.Rectangle({
//             point: position,
//             size: [widthPixels, heightPixels],
//         });
//     }
// }

// // Export the class for use in other files
// //export default PaperApp;