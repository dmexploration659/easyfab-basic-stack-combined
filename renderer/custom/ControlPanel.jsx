import React from 'react';

const ControlPanel = () => {
  return (
    <div className="control_btns">
      <div className="input-row">
        <label htmlFor="step-input">Steps</label>
        <input type="number" id="step-input" defaultValue="1" min="0.01" step="0.1" />
      </div>
      <div className="button-row">
        <button className="jog-button" data-gcode_val="Y1">↑</button>
      </div>
      <div className="button-row">
        <button className="jog-button" data-gcode_val="X-1">←</button>
        <button className="jog-button" data-gcode_val="A-1">&#10226;</button>
        <button className="jog-button" data-gcode_val="X1">→</button>
      </div>
      <div className="button-row">
        <button className="jog-button" data-gcode_val="Y-1">↓</button>
      </div>
      <div className="button-row">
        <button className="home-button" data-gcode_val="G28">&#127968;</button>
      </div>
    </div>
  );
};

export default ControlPanel;