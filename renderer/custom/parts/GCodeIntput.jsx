'use client';
import React, { useState } from 'react';

const GCodeInput = () => {
  const [gcode, setGcode] = useState('');
  const [isValidGCode, setIsValidGCode] = useState(false);
  const [sendingStatus, setSendingStatus] = useState('idle'); // idle, sending, success, error

  const handleGCodeChange = (e) => {
    const inputValue = e.target.value;
    setGcode(inputValue);

    // Basic GCode validation
    const gcodeTrimmed = inputValue.trim();
    const isValid = gcodeTrimmed.length > 0 &&
      /^[GMXYZF0-9\s\.\-]+$/.test(gcodeTrimmed);

    setIsValidGCode(isValid);
  };

  const sendGCode = async () => {
    if (!isValidGCode) return;

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
        // Clear textarea after successful send
        setGcode('');
        setIsValidGCode(false);
        
        // Reset status after a short delay
        setTimeout(() => {
          setSendingStatus('idle');
        }, 2000);
      } else {
        setSendingStatus('error');
        console.error('Failed to send GCode:', result.error);
      }
    } catch (error) {
      setSendingStatus('error');
      console.error('Failed to send GCode:', error);
    }
  };

  // Status message styles
  const getStatusStyle = () => {
    switch (sendingStatus) {
      case 'sending':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        };
      case 'success':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        };
      case 'error':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <textarea
        value={gcode}
        onChange={handleGCodeChange}
        placeholder="Enter GCode (e.g., G0 X10 Y20)"
        rows={3}
        style={{
          marginBottom: '8px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <button
        onClick={sendGCode}
        disabled={!isValidGCode || sendingStatus === 'sending'}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          backgroundColor: isValidGCode && sendingStatus !== 'sending' ? '#4CAF50' : '#ddd',
          color: isValidGCode && sendingStatus !== 'sending' ? 'white' : '#666',
          border: 'none',
          cursor: isValidGCode && sendingStatus !== 'sending' ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s ease',
          marginBottom: '8px'
        }}
      >
        Send GCode
      </button>

      {sendingStatus !== 'idle' && (
        <div
          style={{
            ...getStatusStyle(),
            padding: '8px',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {sendingStatus === 'sending' && 'Sending G-code...'}
          {sendingStatus === 'success' && 'G-code sent successfully!'}
          {sendingStatus === 'error' && 'Failed to send G-code'}
        </div>
      )}
    </div>
  );
};

export default GCodeInput;