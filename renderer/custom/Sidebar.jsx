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
  const [partDimensions, setPartDimensions] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});

  const { canvas } = useCanvas();

  const handlePartClick = (part) => {
    // Initialize the dimensions with default values
    const initialDimensions = {};
    const initialUnits = {};

    // For each parameter in the part, set an initial value
    Object.keys(part.params).forEach(paramKey => {
      const param = part.params[paramKey];
      initialDimensions[paramKey] = part.stock_dimensions[paramKey] || 100; // Default to 100 if no stock dimension
      initialUnits[paramKey] = param.units[0]; // Default to first unit in the array
    });

    setPartDimensions(initialDimensions);
    setSelectedUnits(initialUnits);
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleDimensionChange = (param, value) => {
    setPartDimensions({
      ...partDimensions,
      [param]: value
    });
  };

  const handleUnitChange = (param, unit) => {
    setSelectedUnits({
      ...selectedUnits,
      [param]: unit
    });
  };

  const handleAddToCavas = () => {
    if (!canvas || !selectedPart) return;

    // Create a shape based on the part type
    let shape;

    // Determine the shape dimensions
    const width = parseFloat(partDimensions.width) || 100;
    const height = parseFloat(partDimensions.height || partDimensions.thickness) || 50;
    const length = parseFloat(partDimensions.length) || 200;
    const diameter = parseFloat(partDimensions.diameter) || 50;

    switch (selectedPart.title) {
      case "Sheet metal":
        shape = new fabric.Rect({
          left: 100,
          top: 100,
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

      case "Flat bar":
        shape = new fabric.Rect({
          left: 100,
          top: 100,
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

      case "Square tube":
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

        const innerThickness = parseFloat(partDimensions.thickness) || 2;
        const innerRect = new fabric.Rect({
          left: innerThickness,
          top: innerThickness,
          fill: 'black',
          stroke: 'white',
          width: width - (innerThickness * 2),
          height: height - (innerThickness * 2)
        });

        shape = new fabric.Group([outerRect, innerRect], {
          left: 100,
          top: 100
        });
        break;

      case "Round tube":
        // Create a round tube as a group of circles
        const outerCircle = new fabric.Circle({
          left: 0,
          top: 0,
          radius: diameter / 2,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        const tubeThickness = parseFloat(partDimensions.thickness) || 2;
        const innerCircle = new fabric.Circle({
          left: tubeThickness,
          top: tubeThickness,
          radius: (diameter / 2) - tubeThickness,
          fill: 'black',
          stroke: 'white'
        });

        shape = new fabric.Group([outerCircle, innerCircle], {
          left: 100,
          top: 100
        });
        break;

      case "H beam profile":
        // Create H beam as a group of rectangles
        const hBeamThickness = parseFloat(partDimensions.thickness) || 5;
        const hBeamWidth = width;
        const hBeamHeight = height || 100;

        const hBeamHorizontal1 = new fabric.Rect({
          left: 0,
          top: 0,
          width: hBeamWidth,
          height: hBeamThickness,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        const hBeamHorizontal2 = new fabric.Rect({
          left: 0,
          top: hBeamHeight - hBeamThickness,
          width: hBeamWidth,
          height: hBeamThickness,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        const hBeamVertical = new fabric.Rect({
          left: (hBeamWidth - hBeamThickness) / 2,
          top: hBeamThickness,
          width: hBeamThickness,
          height: hBeamHeight - (hBeamThickness * 2),
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        shape = new fabric.Group([hBeamHorizontal1, hBeamHorizontal2, hBeamVertical], {
          left: 100,
          top: 100
        });
        break;

      case "L beam profile":
        // Create L beam as a group of rectangles
        const lBeamThickness = parseFloat(partDimensions.thickness) || 5;
        const lBeamWidth = width;
        const lBeamHeight = height || 100;

        const lBeamHorizontal = new fabric.Rect({
          left: 0,
          top: 0,
          width: lBeamWidth,
          height: lBeamThickness,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        const lBeamVertical = new fabric.Rect({
          left: 0,
          top: lBeamThickness,
          width: lBeamThickness,
          height: lBeamHeight - lBeamThickness,
          fill: 'transparent',
          zIndex: 0,
          backgroundColor: "white",
          stroke: 'white'
        });

        shape = new fabric.Group([lBeamHorizontal, lBeamVertical], {
          left: 100,
          top: 100
        });
        break;

      default:
        // Default to a rectangle for unhandled types
        shape = new fabric.Rect({
          left: 100,
          top: 100,
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
    shape.set('partType', selectedPart.title);
    shape.set('partDimensions', { ...partDimensions });

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
          overflowY: 'auto',
          padding: '10px'
        }}
      >
        {partsLibrary.map((part) => (
          <PartCard
            key={part.id}
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
          partDimensions={partDimensions}
          selectedUnits={selectedUnits}
          onDimensionChange={handleDimensionChange}
          onUnitChange={handleUnitChange}
          onCancel={() => setShowModal(false)}
          onSubmit={handleAddToCavas}
        />
      )}
    </div>
  );
};

export default Sidebar;