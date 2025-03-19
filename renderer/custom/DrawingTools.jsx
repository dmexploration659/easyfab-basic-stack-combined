import React from 'react';

const DrawingTools = () => {
  return (
    <div className="draw_tools_btns">
      <button id="draw_rect">▭</button>
      <button id="draw_circle">⬤</button>
      <button id="draw_triangle">△</button>
      <button id="draw_polygon">⬠</button>
      <button id="draw_line">─</button>
      <button id="draw_arrow">→</button>
      <button id="draw_ellipse">⬥</button>
    </div>
  );
};

export default DrawingTools;