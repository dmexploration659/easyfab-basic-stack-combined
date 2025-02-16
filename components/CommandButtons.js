import React from "react";

const CommandButtons = () => {
  const buttons = [
    { id: "start_btn", label: "Start" },
    { id: "stop_btn", label: "Stop" },
    { id: "pause_btn", label: "Pause" },
    { id: "estop_btn", label: "E-stop", style: { backgroundColor: "red" } },
  ];

  return (
    <div className="command_btns">
      {buttons.map((button) => (
        <button key={button.id} id={button.id} style={button.style}>
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default CommandButtons;
