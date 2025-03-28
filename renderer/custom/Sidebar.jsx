'use client';
import React, { useState } from 'react';
import partsLibrary from '../parts-library';
import { useCanvas } from './CanvasContext';
import * as fabric from 'fabric';
import PartCard from './parts/PartCard';
import PortSelector from './parts/PortSelection';
import GCodeInput from './parts/GcodeIntput';
import PartModal from './parts/PartModel';

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const { canvas } = useCanvas();

  const handlePartClick = (part) => {
    // Set the default selected size to the first size in the list
    const defaultSize = Object.keys(part.sizes)[0] || '';
    setSelectedSize(defaultSize);
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleSizeChange = (sizeKey) => {
    setSelectedSize(sizeKey);
  };

  const handleAddToCanvas = (customLength) => {
    if (!canvas || !selectedPart || !selectedSize) return;

    // Get the dimensions from the selected part and size
    const sizeDetails = selectedPart.sizes[selectedSize];
    if (!sizeDetails) return;
    
    // Create a shape based on the part type
    let shape;

    // Extract dimensions from the selected size
    const width = parseFloat(sizeDetails.width) || 100;
    const height = parseFloat(sizeDetails.height || width) || 100;
    const thickness = parseFloat(sizeDetails.thickness || selectedPart.thickness) || 2;
    
    // Use custom length if provided, otherwise use default or calculated length
    const length = customLength 
      ? parseFloat(customLength) 
      : (parseFloat(sizeDetails.length) || 200);

    // Get canvas center coordinates
    const canvasCenterX = canvas.getWidth() / 2;
    const canvasCenterY = canvas.getHeight() / 2;

    // Create side view representations
    switch (selectedPart.type) {
      case "sheet_metal":
        shape = new fabric.Rect({
          left: canvasCenterX - (thickness / 2),
          top: canvasCenterY - (length / 2),
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white',
          width: thickness,
          height: length,
          originX: 'center',
          originY: 'center'
        });
        break;

      case "square_tube":
        // Side view of square tube with thickness
        const outerRectSide = new fabric.Rect({
          left: 0,
          top: 0,
          fill: 'transparent',
          stroke: 'white',
          width: thickness,
          height: length
        });

        const innerRectSide = new fabric.Rect({
          left: thickness / 4,
          top: thickness / 4,
          fill: 'black',
          stroke: 'white',
          width: thickness / 2,
          height: length - (thickness / 2)
        });

        shape = new fabric.Group([outerRectSide, innerRectSide], {
          left: canvasCenterX - (thickness / 2),
          top: canvasCenterY - (length / 2),
          originX: 'center',
          originY: 'center'
        });
        break;

      case "round_tube":
        // Side view of round tube
        const outerCircle = new fabric.Ellipse({
          left: 0,
          top: 0,
          rx: thickness / 2,
          ry: length / 2,
          fill: 'transparent',
          stroke: 'white'
        });

        const innerCircle = new fabric.Ellipse({
          left: thickness / 4,
          top: thickness / 4,
          rx: (thickness / 4),
          ry: (length / 2) - (thickness / 2),
          fill: 'black',
          stroke: 'white'
        });

        shape = new fabric.Group([outerCircle, innerCircle], {
          left: canvasCenterX - (thickness / 2),
          top: canvasCenterY - (length / 2),
          originX: 'center',
          originY: 'center'
        });
        break;

      default:
        // Default to a thin rectangle for side view
        shape = new fabric.Rect({
          left: canvasCenterX - (thickness / 2),
          top: canvasCenterY - (length / 2),
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white',
          width: thickness,
          height: length,
          originX: 'center',
          originY: 'center'
        });
    }

    // Add metadata to the shape
    shape.set('partType', selectedPart.type);
    shape.set('partSize', selectedSize);
    shape.set('partDimensions', { 
      ...sizeDetails, 
      customLength: customLength ? customLength : undefined 
    });

    // Add the shape to canvas
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();

    // Close the modal
    setShowModal(false);
  };

  return (
    <div className="side_bar" data-title="Parts Library">
      <div className="sidebar_head">
        <PortSelector />
        <GCodeInput />
        <pre id="debug_response_pre" data-title="cnc response"></pre>
      </div>
      <div
        className="sidebar_card_wrapper"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          maxHeight: '250px',
          overflowY: 'hidden',
          padding: '10px'
        }}
      >
        {partsLibrary.map((part, index) => (
          <PartCard
            key={index}
            part={part}
            onClick={() => handlePartClick(part)}
          />
        ))}
      </div>
      <div className="preset_stock_wrapper"></div>

      {/* Modal for part dimensions */}
      {showModal && selectedPart && (
        <PartModal
          selectedPart={selectedPart}
          selectedSize={selectedSize}
          onSizeChange={handleSizeChange}
          onCancel={() => setShowModal(false)}
          onSubmit={handleAddToCanvas}
        />
      )}
    </div>
  );
};

export default Sidebar;