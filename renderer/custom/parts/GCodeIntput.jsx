'use client';
import React from 'react';

const GCodeInput = () => {
  return (
    <>
      <textarea
        id="json_string"
        placeholder="enter gcode"
        rows="3"
        style={{
          width: '100%',
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
    </>
  );
};

export default GCodeInput;