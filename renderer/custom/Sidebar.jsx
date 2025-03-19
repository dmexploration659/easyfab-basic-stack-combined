import React from 'react';

const Sidebar = () => {
  return (
    <div className="side_bar" data-title="Parts Library">
      <div className="sidebar_head">
        <PortSelector />
        <GCodeInput />
        <pre id="debug_response_pre" data-title="cnc response"></pre>
      </div>
      <div className="sidebar_card_wrapper"></div>
      <div className="preset_stock_wrapper"></div>
    </div>
  );
};

const PortSelector = () => {
  return (
    <div className="port_select_wrapper">   
      <select id="port_select">
        <option value="none">select port</option>
      </select>
    </div>
  );
};

const GCodeInput = () => {
  return (
    <>
      <textarea id="json_string" placeholder="enter gcode" rows="3"></textarea>
      <button id="send_gcode" disabled>Send</button>
    </>
  );
};

export default Sidebar;