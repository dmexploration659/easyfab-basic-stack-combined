'use client';
import React from 'react';

const PortSelector = () => {
  return (
    <div className="port_select_wrapper">
      <select id="port_select">
        <option value="none">select port</option>
      </select>
    </div>
  );
};

export default PortSelector;