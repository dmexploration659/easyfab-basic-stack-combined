import React, { useRef, useState } from "react";

const ShapeCanvas = () => {
  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState([]);

  const addShape = (shape) => {
    const newShape = {
      type: shape,
      x: Math.random() * (canvasRef.current.width - 100), // Random x position
      y: Math.random() * (canvasRef.current.height - 100), // Random y position
    };
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const drawShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    shapes.forEach((shape) => {
      switch (shape.type) {
        case "rectangle":
          ctx.fillStyle = "blue";
          ctx.fillRect(shape.x, shape.y, 100, 60); // Draw rectangle
          break;
        case "circle":
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, 50, 0, 2 * Math.PI); // Draw circle
          ctx.fill();
          break;
        case "triangle":
          ctx.fillStyle = "green";
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y);
          ctx.lineTo(shape.x + 50, shape.y + 100); // Draw triangle
          ctx.lineTo(shape.x - 50, shape.y + 100);
          ctx.closePath();
          ctx.fill();
          break;
        default:
          break;
      }
    });
  };

  // Re-draw shapes when the shape list changes
  React.useEffect(() => {
    drawShapes();
  }, [shapes]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "10px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 20} // Adjust for padding
        height={window.innerHeight - 20}
        style={{
          border: "1px solid black",
          display: "block",
        }}
      ></canvas>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button onClick={() => addShape("rectangle")}>Add Rectangle</button>
        <button onClick={() => addShape("circle")}>Add Circle</button>
        <button onClick={() => addShape("triangle")}>Add Triangle</button>
      </div>
    </div>
  );
};

export default ShapeCanvas;
