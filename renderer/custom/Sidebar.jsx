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

  const handleAddToCanvas = () => {
    if (!canvas || !selectedPart || !selectedSize) return;

    // Get the dimensions from the selected part and size
    const sizeDetails = selectedPart.sizes[selectedSize];
    if (!sizeDetails) return;
    
    // Create a shape based on the part type
    let shape;

    // Extract dimensions from the selected size
    const width = parseFloat(sizeDetails.width) || 100;
    const height = parseFloat(sizeDetails.height || width) || 100;
    const length = parseFloat(sizeDetails.length) || 200;
    const thickness = parseFloat(sizeDetails.thickness || selectedPart.thickness) || 2;

    // Get canvas center coordinates
    const canvasCenterX = canvas.getWidth() / 2;
    const canvasCenterY = canvas.getHeight() / 2;

    switch (selectedPart.type) {
      case "sheet_metal":
        shape = new fabric.Rect({
          left: canvasCenterX - (width / 2),
          top: canvasCenterY - (length / 2),
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white',
          width: width,
          height: length,
          originX: 'left',
          originY: 'top'
        });
        break;

      case "square_tube":
        // Create a square tube as a group of rectangles
        const outerRect = new fabric.Rect({
          left: 0,
          top: 0,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white',
          width: width,
          height: height
        });

        const innerRect = new fabric.Rect({
          left: thickness,
          top: thickness,
          fill: 'black',
          stroke: 'white',
          width: width - (thickness * 2),
          height: height - (thickness * 2)
        });

        shape = new fabric.Group([outerRect, innerRect], {
          left: canvasCenterX - (width / 2),
          top: canvasCenterY - (height / 2)
        });
        break;

      case "round_tube":
        // Create a round tube as a group of circles
        const diameter = width; // Assuming width is the diameter for round tubes
        const outerCircle = new fabric.Circle({
          left: 0,
          top: 0,
          radius: diameter / 2,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        const innerCircle = new fabric.Circle({
          left: thickness,
          top: thickness,
          radius: (diameter / 2) - thickness,
          fill: 'black',
          stroke: 'white'
        });

        shape = new fabric.Group([outerCircle, innerCircle], {
          left: canvasCenterX - (diameter / 2),
          top: canvasCenterY - (diameter / 2)
        });
        break;

      default:
        // Default to a rectangle for unhandled types
        shape = new fabric.Rect({
          left: canvasCenterX - (width / 2),
          top: canvasCenterY - (height / 2),
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white',
          width: width,
          height: height,
          originX: 'left',
          originY: 'top'
        });
    }

    // Add metadata to the shape
    shape.set('partType', selectedPart.type);
    shape.set('partSize', selectedSize);
    shape.set('partDimensions', { ...sizeDetails });

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