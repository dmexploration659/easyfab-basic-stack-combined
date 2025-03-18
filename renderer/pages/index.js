import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useStore } from '../utils/zustand_setup';
import DisplayModel from '../custom/DisplayModel';
import CommandButtons from '../custom/command-buttons';

// Import custom hooks
import useWebSocket from '../hooks/useWebSocket';
import useCanvasManager from '../hooks/useCanvasManager';
import usePartsLibrary from '../hooks/usePartsLibrary';

// Import components
import PartCard from '../custom/PartCard';
import PartModal from '../custom/PartModal';
import StockCard from '../custom/StockCard';
import WorkbenchPart from '../custom/WorkbenchPart';

export default function FabricCanvasUI() {
  // Basic state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState(null); // 'part' or 'stock'
  const [sizeOptions, setSizeOptions] = useState([]);
  const { test } = useStore();
  
  // Refs
  const fabricCanvasRef = useRef(null);
  const dimBarRef = useRef(null);
  
  // Custom hooks
  const { 
    isConnected, 
    messages, 
    sendMessage, 
    wsClient 
  } = useWebSocket('ws://localhost:8080', 'front-end-client');
  
  const canvasManager = useCanvasManager(fabricCanvasRef, dimBarRef);
  
  const {
    partsLibrary,
    presetStock,
    workbenchParts,
    addWorkbenchPart,
    generateUid
  } = usePartsLibrary();
  
  // Event handlers
  const handleDeleteKey = (e) => {
    if (e.key === 'Delete') {
      canvasManager.deleteSelected();
    }
  };
  
  const sendGcode = () => {
    const gcodeText = document.getElementById("json_string").value;
    try {
      sendMessage("py-executive-client", { 
        title: "send_to_cnc_dev", 
        content: gcodeText
      });
    } catch (error) {
      console.error("Error sending GCode:", error);
      alert("Error sending GCode. Please try again.");
    }
  };
  
  const handleBuildClick = () => {
    const objects = canvasManager.collectObjects();
    console.log(objects);
  };
  
  const handleSendSvgClick = () => {
    const svgData = canvasManager.getSvg();
    sendMessage("py-executive-client", { 
      title: "svg_data", 
      content: svgData
    });
  };
  
  const handleStartClick = () => {
    const objects = canvasManager.collectObjects();
    if (objects.length > 0) {
      sendMessage("py-executive-client", { 
        title: "send_to_cnc", 
        content: objects[0].gcode_data
      });
    }
  };
  
  const handleJogButtonClick = (gcodeVal, step) => {
    const stepValue = parseFloat(step);
    let gcode;
    
    if (gcodeVal !== 'G28') {
      gcode = `G21 G91 ${gcodeVal} ${stepValue}`;
    } else {
      gcode = gcodeVal;
    }
    
    sendMessage("py-executive-client", { 
      title: "send_to_cnc_dev", 
      content: gcode
    });
  };
  
  const openPartModal = (content) => {
    setModalContent(content);
    setModalType('part');
    setIsModalOpen(true);
  };
  
  const openStockModal = (stockItem) => {
    const sizeOptions = stockItem.sizes.map(sizeObj => {
      const sizeName = Object.keys(sizeObj)[0];
      return { value: sizeName, label: sizeName };
    });
    setSizeOptions(sizeOptions);
    setModalType('stock');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };
  
  const addPart = (partData) => {
    const partId = generateUid();
    addWorkbenchPart(partId, partData);
    closeModal();
  };
  
  const selectWorkbenchPart = (partData) => {
    canvasManager.drawPartShape(partData);
  };
  
  // Effects
  useEffect(() => {
    document.addEventListener('keydown', handleDeleteKey);
    return () => {
      document.removeEventListener('keydown', handleDeleteKey);
    };
  }, []);
  
  useEffect(() => {
    const serialResponseHandler = (data) => {
      if (data?.type === 'private-message' && data?.title === 'incoming_serial_data') {
        const serialRespBox = document.getElementById("debug_response_pre");
        if (serialRespBox) {
          const serialRespItem = document.createElement("p");
          serialRespItem.textContent = data.message.serial_data;
          serialRespBox.insertBefore(serialRespItem, serialRespBox.firstChild);
        }
      }
    };
    
    messages.forEach(serialResponseHandler);
  }, [messages]);
  
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Fabric Canvas UI</title>
      </Head>

      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/two.js/0.8.0/two.min.js" 
        strategy="beforeInteractive" 
      />
      
      <div className="main_cont">
        {/* Sidebar Section */}
        <div className="side_bar" data-title="Parts Library">
          <div className="sidebar_head">
            <div className="port_select_wrapper">   
              <select 
                id="port_select"
                className={isConnected ? "connected" : ""}
                onFocus={() => {
                  if (wsClient) {
                    wsClient.sendPrivateMessage(
                      "py-executive-client", 
                      {title: "ports_request", content: "ports_request"}
                    );
                  }
                }}
                onChange={(e) => {
                  if (wsClient) {
                    wsClient.sendPrivateMessage(
                      "py-executive-client", 
                      {title: "connect_port", content: {port: e.target.value}}
                    );
                  }
                }}
              >
                <option value="none">select port</option>
                {messages
                  .filter(msg => msg?.type === 'private-message' && msg?.title === 'available_ports')
                  .flatMap(msg => msg.message.ports)
                  .map((port, index) => (
                    <option key={index} value={port.device}>
                      {port.description.includes("USB") 
                        ? `${port.device} (${port.description})` 
                        : port.device}
                    </option>
                  ))
                }
              </select>
            </div>
            <textarea id="json_string" placeholder="enter gcode" rows="3"></textarea>
            <button 
              id="send_gcode" 
              onClick={sendGcode} 
              disabled={!isConnected}
            >
              Send
            </button>
            <pre id="debug_response_pre" data-title="cnc response"></pre>
          </div>
          
          <div className="sidebar_card_wrapper">
            {partsLibrary.map((part, index) => (
              <PartCard 
                key={index} 
                content={part} 
                onOpenModal={openPartModal} 
              />
            ))}
          </div>
          
          <div className="preset_stock_wrapper">
            {presetStock.map((item, index) => (
              <StockCard 
                key={index} 
                item={item} 
                onOpenSizeModal={openStockModal} 
              />
            ))}
          </div>
        </div>

        {/* Workspace Section */}
        <div className="work_space" data-title="Build space">
          <CommandButtons />
          
          <div className="canvas_container bg-green-500">
            <div 
              className="dimansion_bar" 
              id="dimansion_bar"
              ref={dimBarRef}
            >
              <p id="width_dim">Width:</p>
              <p id="height_dim">Height:</p>
              <p id="rotation_dim">Rotation:</p>
              <div className="zoom_btns">
                <button id="zoomIn" onClick={canvasManager.zoomIn}>+</button>
                <button id="zoomOut" onClick={canvasManager.zoomOut}>-</button>
              </div>
            </div>
            
            <div className="draw_tools_btns">
              <button id="draw_rect" onClick={canvasManager.drawRectangle}>▭</button>
              <button id="draw_circle" onClick={canvasManager.drawCircle}>⬤</button>
              <button id="draw_triangle">△</button>
              <button id="draw_polygon">⬠</button>
              <button id="draw_line">─</button>
              <button id="draw_arrow">→</button>
              <button id="draw_ellipse">⬥</button>
            </div>
            
            <div className="utils_btns">
              <button id="build_btn" onClick={handleBuildClick}>Build</button>
              <button id="send_svg" onClick={handleSendSvgClick}>Send SVG</button>
              <button id="export_btn">Export</button>
              <button id="send_json">Send JSON</button>
            </div>
            
            <Controls />
            
            <div 
              className="canvas_wrapper" 
              id="fabricCanvas"
              ref={fabricCanvasRef}
            ></div>
          </div>
        </div>

        <div className="foot_bar" data-title="Workbench">
          <div className="Workbench_parts_wrapper">
            {Array.from(workbenchParts).map(([partId, partData]) => (
              <WorkbenchPart 
                key={partId}
                partId={partId}
                partData={partData}
                onSelect={selectWorkbenchPart}
              />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && modalType === 'part' && (
        <div className="modal_overlay show" id="modal_overlay">
          <PartModal 
            content={modalContent}
            onClose={closeModal}
            onAddPart={addPart}
          />
        </div>
      )}
      
      {isModalOpen && modalType === 'stock' && (
        <DisplayModel 
          sizeOptions={sizeOptions} 
          closeModal={closeModal} 
        />
      )}
    </>
  );
}