import React, { useRef, useEffect } from 'react';

const Build_canvas = () => {
  const canvasRef = useRef(null);

  // Drawing grid lines on the canvas
  const drawGrid = (ctx, canvasWidth, canvasHeight, gridSize) => {
    ctx.strokeStyle = '#BEBEBE'; // Set color for grid lines
    ctx.lineWidth = 0.5;         // Set line width for grid lines

    // Draw vertical grid lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);          // Move to the top of the canvas
      ctx.lineTo(x, canvasHeight); // Draw to the bottom of the canvas
      ctx.stroke();              // Render the line
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);          // Move to the left side of the canvas
      ctx.lineTo(canvasWidth, y); // Draw to the right side of the canvas
      ctx.stroke();              // Render the line
    }
  };
/*--------------draw part-----------*/
    // const prevTriggerRef = useRef(draw_part);
    // console.log('p c',part_num, draw_part)
    // useEffect(() => {
    //   console.log("is equal",part_num == prevTriggerRef.current);
    //   if(prevTriggerRef.current != part_num ){
    //     const DPI = window.devicePixelRatio * 96;  // Standard DPI is 96 on most screens
    //     const w_InPixels = jsonData.width * (DPI / 25.4);
    //     const h_InPixels = jsonData.height * (DPI / 25.4);
        
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext("2d");
    //     const x = Math.random() * (canvas.width - 100);
    //     const y = Math.random() * (canvas.height - 60);
    //     ctx.fillStyle = "grey";
    //     ctx.fillRect(x, y, 20, 300); 
    //     prevTriggerRef.current = draw_part;
    //   }
        
    // },[draw_part])

/*--------------draw part-----------*/
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set the canvas size
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Grid size (adjust the value to control the size of the squares)
    const gridSize = 30;

    // Draw the grid
    drawGrid(ctx, canvasWidth, canvasHeight, gridSize);

    // ctx.fillStyle = 'blue';
    // ctx.fillRect(100, 100, 150, 100);  // Draw a rectangle for testing

  }, []);

  return (
    <div  className="canvas_container">
      <canvas
        id='build_canva'
        ref={canvasRef}
        width="600"
        height="600"
        style={{ border: '1px solid black' }}
      ></canvas>
    </div>
  );
};

export default Build_canvas;
