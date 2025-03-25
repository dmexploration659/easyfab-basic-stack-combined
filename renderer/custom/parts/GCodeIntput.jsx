'use client';
import React from 'react';

const GCodeInput = () => {
  return (
    <div
    style={{
      padding: '10px',
      border: '1px solid #ddd',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '6px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    }}>
      <textarea
        id="json_string"
        placeholder="enter gcode"
        rows="3"
        style={{
          marginBottom: '8px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      ></textarea>
      <button
        id="send_gcode"
        disabled
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          backgroundColor: '#ddd',
          border: 'none',
          cursor: 'not-allowed'
        }}
      >
        Send
      </button>
    </div>
  );
};

export default GCodeInput;