import React from 'react';

const CommandButtons = () => {
  return (
    <div className="command_btns">
      <button id="start_btn">Start</button>
      <button id="stop_btn">Stop</button>
      <button id="pause_btn">Pause</button>
      <button id="estop_btn" style={{ backgroundColor: 'red' }}>E-stop</button>
    </div>
  );
};

export default CommandButtons;