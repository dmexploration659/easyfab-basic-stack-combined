// server.js
const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Store the active connection
let activePort = null;
let parser = null;

// Get list of available serial ports
app.get('/api/serial-ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports);
  } catch (error) {
    console.error('Error listing serial ports:', error);
    res.status(500).json({ error: 'Failed to list serial ports' });
  }
});

// Connect to a serial port
app.post('/api/connect', async (req, res) => {
  const { port, baudRate } = req.body;
  
  if (!port) {
    return res.status(400).json({ success: false, error: 'Port is required' });
  }

  try {
    // Close existing connection if any
    if (activePort && activePort.isOpen) {
      await new Promise(resolve => activePort.close(resolve));
    }

    // Create a new connection
    activePort = new SerialPort({
      path: port,
      baudRate: baudRate || 115200,
      autoOpen: false
    });

    // Setup parser for reading responses
    parser = activePort.pipe(new ReadlineParser({ delimiter: '\n' }));
    
    // Handle incoming data
    parser.on('data', (data) => {
      console.log('Received from serial port:', data);
      // You can add websocket here to send this data back to the frontend in real-time
    });

    // Open the connection
    await new Promise((resolve, reject) => {
      activePort.open((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Wait for the controller to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send initialization commands if needed
    if (activePort.isOpen) {
      // For GRBL-based controllers, you might want to send some initial commands
      activePort.write("\r\n\r\n"); // Wake up the controller
      setTimeout(() => {
        activePort.write("$X\r\n"); // Unlock
        setTimeout(() => {
          activePort.write("G90\r\n"); // Absolute positioning
        }, 200);
      }, 1000);
    }

    res.json({ success: true, message: `Connected to ${port}` });
  } catch (error) {
    console.error('Error connecting to serial port:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to connect to port' 
    });
  }
});

// Disconnect from the serial port
app.post('/api/disconnect', async (req, res) => {
  try {
    if (activePort && activePort.isOpen) {
      await new Promise(resolve => activePort.close(resolve));
      activePort = null;
      parser = null;
      res.json({ success: true, message: 'Disconnected' });
    } else {
      res.json({ success: false, error: 'No active connection' });
    }
  } catch (error) {
    console.error('Error disconnecting from serial port:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to disconnect' 
    });
  }
});
// Modified /api/send-gcode endpoint for the server.js file

// Send G-code to the connected port
app.post('/api/send-gcode', async (req, res) => {
    const { gcode } = req.body;
    
    if (!gcode) {
      return res.status(400).json({ success: false, error: 'G-code is required' });
    }
  
    try {
      if (!activePort || !activePort.isOpen) {
        return res.status(400).json({ 
          success: false, 
          error: 'No active connection' 
        });
      }
  
      // Split the G-code into lines
      const lines = gcode.split('\n').filter(line => 
        line.trim() && !line.startsWith(';')
      );
      
      // Start sending G-code in the background
      console.log(`Starting to send ${lines.length} G-code lines`);
      
      // Respond immediately to avoid timeout
      res.json({ 
        success: true, 
        message: `Started sending ${lines.length} G-code commands` 
      });
      
      // Send G-code lines in the background
      sendGCodeLines(lines);
      
    } catch (error) {
      console.error('Error initiating G-code send:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to send G-code' 
      });
    }
  });
  
  // Function to send G-code lines with delay
  function sendGCodeLines(lines) {
    let lineIndex = 0;
    let isSending = false;
    
    // This variable will track if there was an error during sending
    let sendingError = null;
    
    // Function to send a single line with proper flow control
    function sendNextLine() {
      if (lineIndex >= lines.length) {
        console.log('All G-code lines sent successfully');
        isSending = false;
        return;
      }
      
      if (!activePort || !activePort.isOpen) {
        console.error('Port disconnected during G-code sending');
        isSending = false;
        return;
      }
      
      const line = lines[lineIndex] + '\n';
      console.log(`Sending line ${lineIndex + 1}/${lines.length}: ${line.trim()}`);
      
      activePort.write(line, (writeErr) => {
        if (writeErr) {
          console.error(`Error writing line ${lineIndex + 1}: ${writeErr.message}`);
          sendingError = writeErr;
          isSending = false;
          return;
        }
        
        lineIndex++;
        
        // Wait before sending the next line
        // For GRBL-based controllers, waiting 50-100ms is usually sufficient
        setTimeout(sendNextLine, 100);
      });
    }
    
    // Start the sending process
    if (!isSending) {
      isSending = true;
      sendNextLine();
    }
  }

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});