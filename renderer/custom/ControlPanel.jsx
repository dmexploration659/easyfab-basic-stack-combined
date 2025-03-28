'use client';
import React, { useState } from 'react';

const ControlPanel = () => {
  const [steps, setSteps] = useState(1);
  const [sendingStatus, setSendingStatus] = useState('idle');

  // Function to send G-code to the backend
  const sendGCode = async (gcode) => {
    try {
      setSendingStatus('sending');
      
      const response = await fetch('http://localhost:5000/api/send-gcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gcode }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSendingStatus('success');
        
        // Reset status after a short delay
        setTimeout(() => {
          setSendingStatus('idle');
        }, 1000);
      } else {
        setSendingStatus('error');
        console.error('Failed to send GCode:', result.error);
      }
    } catch (error) {
      setSendingStatus('error');
      console.error('Failed to send GCode:', error);
    }
  };

  // Handle step changes
  const changeSteps = () => {
    // Cycle through step values: 1 -> 0.1 -> 0.01 -> back to 1
    const stepValues = [1, 0.1, 0.01];
    const currentIndex = stepValues.indexOf(steps);
    const nextIndex = (currentIndex + 1) % stepValues.length;
    setSteps(stepValues[nextIndex]);
  };

  // Control button handlers
  const handleHomeBtn = () => {
    sendGCode('G28'); // Home all axes
  };

  const handleUpBtn = () => {
    sendGCode(`G0 Y${steps}`); // Move Y positive
  };

  const handleDownBtn = () => {
    sendGCode(`G0 Y-${steps}`); // Move Y negative
  };

  const handleLeftBtn = () => {
    sendGCode(`G0 X-${steps}`); // Move X negative
  };

  const handleRightBtn = () => {
    sendGCode(`G0 X${steps}`); // Move X positive
  };

  const handleResetBtn = () => {
    sendGCode('G92 X0 Y0 Z0'); // Reset position to zero
  };

  const handleA1Btn = () => {
    sendGCode('A+'); // Specific command for A1
  };

  const handleSecondA1Btn = () => {
    sendGCode('A-'); // Another A1 command (opposite direction)
  };

  // Styles
  const containerStyle = {
    backgroundColor: 'black',
    borderRadius: '8px',
    padding: '16px',
    width: '200px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    bottom: '100px',
  };

  const stepsIndicatorStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const controlGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonStyle = {
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const navigationClusterStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
  };

  const statusIndicatorStyle = {
    textAlign: 'center',
    marginTop: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: sendingStatus === 'success' ? '#10b981' : 
           sendingStatus === 'error' ? '#ef4444' : '#6b7280',
  };

  return (
    <div style={containerStyle}>
      <div style={stepsIndicatorStyle} onClick={changeSteps}>
        <span>Steps: </span>
        <span style={{ 
          marginLeft: '8px', 
          fontWeight: 'bold',
          cursor: 'pointer',
          backgroundColor: '#e0e0e0',
          padding: '4px 8px',
          borderRadius: '4px',
          color: 'black',
        }}>
          {steps}
        </span>
      </div>
      
      <div style={controlGridStyle}>
        <button 
          style={buttonStyle} 
          onClick={handleHomeBtn}
        >
          🏠
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={handleUpBtn}
        >
          ↑
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={handleA1Btn}
        >
          a1
        </button>
        
        <div style={navigationClusterStyle}>
          <button 
            style={buttonStyle} 
            onClick={handleLeftBtn}
          >
            ←
          </button>
          
          <button 
            style={buttonStyle} 
            onClick={handleResetBtn}
          >
            ↻
          </button>
          
          <button 
            style={buttonStyle} 
            onClick={handleRightBtn}
          >
            →
          </button>
        </div>
        
        <button 
          style={buttonStyle} 
          onClick={handleDownBtn}
        >
          ↓
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={handleSecondA1Btn}
        >
          a1
        </button>
      </div>

      {sendingStatus !== 'idle' && (
        <div style={statusIndicatorStyle}>
          {sendingStatus === 'sending' && 'Sending command...'}
          {sendingStatus === 'success' && 'Command sent successfully!'}
          {sendingStatus === 'error' && 'Failed to send command'}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;