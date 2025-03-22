'use client';
import React, { useState, useEffect } from "react";
import { useCanvas } from "../CanvasContext";
import { generateGCode } from "../../utils/exportUtils";

const PortSelector = () => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [sendingStatus, setSendingStatus] = useState('');
  const [sendingProcess, setSendingProcess] = useState('idle'); // idle, generating, sending, success, error
  const [connectionProcess, setConnectionProcess] = useState('disconnected'); // disconnected, connecting, connected, error
  const { canvas } = useCanvas();

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/serial-ports");
        const data = await response.json();
        setPorts(data);
      } catch (error) {
        console.error("Error fetching serial ports:", error);
        setConnectionStatus('Error fetching ports');
        setConnectionProcess('error');
      }
    };

    fetchPorts();
    
    // Refresh ports list every 5 seconds
    const intervalId = setInterval(fetchPorts, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handlePortChange = (e) => {
    setSelectedPort(e.target.value);
  };

  const connectToPort = async () => {
    if (!selectedPort) {
      setConnectionStatus('Please select a port first');
      return;
    }

    try {
      setConnectionStatus('Connecting...');
      setConnectionProcess('connecting');
      
      const response = await fetch('http://localhost:5000/api/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          port: selectedPort,
          baudRate: 115200 // Common baud rate for many CNC controllers
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsConnected(true);
        setConnectionStatus(`Connected to ${selectedPort}`);
        setConnectionProcess('connected');
      } else {
        setConnectionStatus(`Connection failed: ${result.error}`);
        setConnectionProcess('error');
      }
    } catch (error) {
      console.error('Error connecting to port:', error);
      setConnectionStatus(`Connection error: ${error.message}`);
      setConnectionProcess('error');
    }
  };

  const disconnectFromPort = async () => {
    try {
      setConnectionStatus('Disconnecting...');
      
      const response = await fetch('http://localhost:5000/api/disconnect', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        setConnectionProcess('disconnected');
      } else {
        setConnectionStatus(`Disconnection failed: ${result.error}`);
        setConnectionProcess('error');
      }
    } catch (error) {
      console.error('Error disconnecting from port:', error);
      setConnectionStatus(`Disconnection error: ${error.message}`);
      setConnectionProcess('error');
    }
  };

  const sendGCodeToPort = async () => {
    if (!isConnected) {
      setSendingStatus('Not connected to any port');
      setSendingProcess('error');
      return;
    }

    if (!canvas) {
      setSendingStatus('Canvas not available');
      setSendingProcess('error');
      return;
    }

    try {
      setSendingStatus('Generating G-code...');
      setSendingProcess('generating');
      const gcode = generateGCode(canvas);
      
      // Simulate a small delay to show the generating state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSendingStatus('Sending G-code to port...');
      setSendingProcess('sending');
      const response = await fetch('http://localhost:5000/api/send-gcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gcode }),
      });
      
      const result = await response.json();
      console.log('G-code send result:', result);
      
      if (result.success) {
        setSendingStatus('G-code sent successfully');
        setSendingProcess('success');
      } else {
        setSendingStatus(`Failed to send G-code: ${result.error}`);
        setSendingProcess('error');
      }
    } catch (error) {
      console.error('Error sending G-code:', error);
      setSendingStatus(`Error sending G-code: ${error.message}`);
      setSendingProcess('error');
    }
  };

  // Common button styles
  const buttonBaseStyle = {
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    padding: '10px 16px',
  };

  // Status text styles
  const getStatusStyle = (processState) => {
    const baseStyle = {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginTop: '6px',
      padding: '4px 8px',
      borderRadius: '4px',
      display: 'inline-block',
      transition: 'all 0.3s ease',
    };

    switch (processState) {
      case 'connected':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        };
      case 'connecting':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        };
      case 'disconnected':
      default:
        return {
          ...baseStyle,
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          color: '#6b7280',
          border: '1px solid rgba(107, 114, 128, 0.2)',
        };
    }
  };

  // Select styles
  const selectStyle = {
    appearance: 'none',
    backgroundColor: 'black',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '10px 10px',
    paddingRight: '32px', // Space for the dropdown arrow
    fontWeight: '500',
    cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23666666\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    minWidth: '80px',
  };

  // Container styles
  const containerStyle = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  };

  // Process indicator styles
  const getProcessIndicator = (process) => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginRight: '8px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    };

    switch (process) {
      case 'connected':
      case 'success':
        return (
          <span style={{
            ...baseStyle,
            backgroundColor: '#10b981',
            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
          }}></span>
        );
      case 'connecting':
      case 'generating':
      case 'sending':
        return (
          <span style={{
            ...baseStyle,
            borderTop: '2px solid #3b82f6',
            borderRight: '2px solid transparent',
            animation: 'spin 1s linear infinite',
          }}></span>
        );
      case 'error':
        return (
          <span style={{
            ...baseStyle,
            backgroundColor: '#ef4444',
            boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)',
          }}></span>
        );
      case 'disconnected':
      case 'idle':
      default:
        return (
          <span style={{
            ...baseStyle,
            backgroundColor: '#9ca3af',
            boxShadow: '0 0 0 2px rgba(156, 163, 175, 0.2)',
          }}></span>
        );
    }
  };

  // Progress Model for Sending G-code
  const SendingProgressModel = () => {
    const progressSteps = [
      { id: 'idle', label: 'Ready' },
      { id: 'generating', label: 'Generating G-code' },
      { id: 'sending', label: 'Sending to Machine' },
      { id: 'success', label: 'Complete' },
    ];

    return (
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '10px', color: '#4b5563' }}>G-code Progress</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {progressSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                opacity: ['idle', 'generating', 'sending', 'success'].indexOf(sendingProcess) >= ['idle', 'generating', 'sending', 'success'].indexOf(step.id) ? 1 : 0.4,
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: sendingProcess === step.id ? (step.id === 'success' ? '#10b981' : '#3b82f6') : 
                                  ['idle', 'generating', 'sending', 'success'].indexOf(sendingProcess) > ['idle', 'generating', 'sending', 'success'].indexOf(step.id) ? '#10b981' : '#e5e7eb',
                  color: ['idle', 'generating', 'sending', 'success'].indexOf(sendingProcess) >= ['idle', 'generating', 'sending', 'success'].indexOf(step.id) ? 'white' : '#9ca3af',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  transition: 'all 0.3s ease',
                }}>
                  {['idle', 'generating', 'sending', 'success'].indexOf(sendingProcess) > ['idle', 'generating', 'sending', 'success'].indexOf(step.id) ? '✓' : index + 1}
                </div>
                <div style={{ marginTop: '4px', fontSize: '0.75rem', fontWeight: '500', color: sendingProcess === step.id ? '#3b82f6' : '#6b7280' }}>
                  {step.label}
                </div>
              </div>
              
              {index < progressSteps.length - 1 && (
                <div style={{ 
                  flex: 1, 
                  height: '2px', 
                  backgroundColor: ['idle', 'generating', 'sending', 'success'].indexOf(sendingProcess) > ['idle', 'generating', 'sending', 'success'].indexOf(step.id) ? '#10b981' : '#e5e7eb',
                  transition: 'all 0.3s ease',
                }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Connection Status Model
  const ConnectionStatusModel = () => {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '4px',
        backgroundColor: connectionProcess === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 
                       connectionProcess === 'connecting' ? 'rgba(245, 158, 11, 0.1)' : 
                       connectionProcess === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
        border: connectionProcess === 'connected' ? '1px solid rgba(16, 185, 129, 0.2)' : 
                connectionProcess === 'connecting' ? '1px solid rgba(245, 158, 11, 0.2)' : 
                connectionProcess === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(107, 114, 128, 0.2)',
        color: connectionProcess === 'connected' ? '#10b981' : 
               connectionProcess === 'connecting' ? '#f59e0b' : 
               connectionProcess === 'error' ? '#ef4444' : '#6b7280',
        transition: 'all 0.3s ease',
      }}>
        {getProcessIndicator(connectionProcess)}
        <span style={{ fontWeight: '500' }}>{connectionStatus}</span>
      </div>
    );
  };

  return (
    <div style={containerStyle} className="port_select_wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <select 
          style={{
            ...selectStyle,
            opacity: isConnected ? 0.6 : 1,
            border: selectedPort ? '1px solid #3b82f6' : '1px solid #e2e8f0',
          }}
          value={selectedPort}
          onChange={handlePortChange}
          disabled={isConnected}
        >
          <option value="">Select a serial port</option>
          {ports.map((port, index) => (
            <option key={index} value={port.path}>
              {port.path} - {port.friendlyName || "Unknown"}
            </option>
          ))}
        </select>
        
        {!isConnected ? (
          <button 
            style={{
              ...buttonBaseStyle,
              backgroundColor: selectedPort ? '#10b981' : '#d1d5db',
              color: 'white',
              transform: selectedPort ? 'scale(1)' : 'scale(0.98)',
              opacity: selectedPort ? 1 : 0.7,
              cursor: selectedPort ? 'pointer' : 'not-allowed',
            }}
            onClick={connectToPort}
            disabled={!selectedPort}
            onMouseOver={(e) => {
              if (selectedPort) e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseOut={(e) => {
              if (selectedPort) e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            Connect
          </button>
        ) : (
          <button 
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#ef4444',
              color: 'white',
            }}
            onClick={disconnectFromPort}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            Disconnect
          </button>
        )}
      </div>
      
      {connectionStatus && <ConnectionStatusModel />}

      {isConnected && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onClick={sendGCodeToPort}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Send G-code to Machine</span>
            <span style={{ fontSize: '1.2em' }}>➜</span>
          </button>
          
          {sendingStatus && (
            <div style={{
              fontSize: '0.875rem',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: sendingProcess === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
                               ['generating', 'sending'].includes(sendingProcess) ? 'rgba(59, 130, 246, 0.1)' : 
                               sendingProcess === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              border: sendingProcess === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : 
                      ['generating', 'sending'].includes(sendingProcess) ? '1px solid rgba(59, 130, 246, 0.2)' : 
                      sendingProcess === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(107, 114, 128, 0.2)',
              color: sendingProcess === 'success' ? '#10b981' : 
                     ['generating', 'sending'].includes(sendingProcess) ? '#3b82f6' : 
                     sendingProcess === 'error' ? '#ef4444' : '#6b7280',
              marginTop: '4px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {getProcessIndicator(sendingProcess)}
              {sendingStatus}
            </div>
          )}
          
          {/* Only show the progress model if we've started the sending process */}
          {sendingProcess !== 'idle' && <SendingProgressModel />}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PortSelector;