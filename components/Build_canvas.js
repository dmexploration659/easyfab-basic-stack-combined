import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import Draw_tools from "./draw_tools";
import Utils_buttons from "./Utils_buttons";

const Build_canvas = () => {
  const canvas_container_ref = useRef(null);
  useEffect(() => {
    const c_container = canvas_container_ref.current;
    const c_containerWidth = c_container.offsetWidth;
    const c_containerHeight = c_container.offsetHeight;
    const canvas = new fabric.Canvas('fabricCanvas', {
      width: c_containerWidth,
      height: c_containerHeight,
      backgroundColor: '#1E1E1E',
    });

    const resizeCanvas = () => {
      const c_containerWidth = c_container.offsetWidth;
      const c_containerHeight = c_container.offsetHeight;
      canvas.setDimensions({
        width: c_containerWidth,
        height: c_containerHeight
      });

    };

    window.addEventListener('resize', resizeCanvas);

    // Store the Fabric.js canvas instance on the DOM element for access by ID
    const canvasEl = document.getElementById('fabricCanvas');
    if (canvasEl) {
      canvasEl.fabric = canvas;
    }

    // Clean up on component unmount
    return () => {
      canvas.dispose();
      if (canvasEl) {
        canvasEl.fabric = null;
      }
    };
  }, []);

  return (
    <div className="canvas_container" ref={canvas_container_ref} >
      <canvas id="fabricCanvas" />
      <Draw_tools key="draw_tools" />
      <Utils_buttons key="utils_buttons" />
    </div>
  );
};

export default Build_canvas;
