'use client';
import React, { useState, useEffect } from "react";

const SerialPortSelector = () => {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/serial-ports");
        const data = await response.json();
        setPorts(data);
      } catch (error) {
        console.error("Error fetching serial ports:", error);
      }
    };

    fetchPorts();
  }, []);

  return (
    <div className="port_select_wrapper">
      <select className="px-4 py-2 border rounded-md">
        <option value="">Select a serial port</option>
        {ports.map((port, index) => (
          <option key={index} value={port.path}>
            {port.path} - {port.manufacturer || "Unknown"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SerialPortSelector;
