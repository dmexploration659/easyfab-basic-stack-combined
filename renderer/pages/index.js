import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import dd from "../../front-end/centering_guidelines.js";
import { useStore } from '../utils/zustand_setup';

export default function FabricCanvasUI() {
  const [portOptions, setPortOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sizeOptions, setSizeOptions] = useState([]);
  const { test } = useStore();

  // Functions
  const sendGcode = () => {
    // Implementation for sendGcode
    console.log('Sending GCode');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log('test from Zustand setup : ', test);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Fabric Canvas UI</title>
      </Head>

      {/* External Scripts - loaded with Next.js Script component */}
      {/* <Script src="../../front-end/fabric.min.js" strategy="beforeInteractive" />
      <Script src="../../front-end/centering_guidelines.js" strategy="beforeInteractive" />
      <Script src="../../front-end/aligning_guidelines.js" strategy="beforeInteractive" /> */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/two.js/0.8.0/two.min.js" 
        strategy="beforeInteractive" 
      />
      <Script src="/index.js" strategy="afterInteractive" type="module" />

      <div className="main_cont">
        {/* Sidebar Section */}
        <div className="side_bar" data-title="Parts Library">
          <div className="sidebar_head">
            <div className="port_select_wrapper">   
              <select id="port_select">
                <option value="none">select port</option>
                {portOptions.map((port, index) => (
                  <option key={index} value={port.value}>{port.label}</option>
                ))}
              </select>
            </div>
            <textarea id="json_string" placeholder="enter gcode" rows="3"></textarea>
            <button id="send_gcode" onClick={sendGcode} disabled>Send</button>
            <pre id="debug_response_pre" data-title="cnc response"></pre>
          </div>
          <div className="sidebar_card_wrapper"></div>
          <div className="preset_stock_wrapper"></div>
        </div>

        {/* Workspace Section */}
        <div className="work_space" data-title="Build space">
          {/* <div className="command_btns"> */}
          <div className="bg-blue-500 flex justify-center items-center">
            {/* this needs to be removed */}
            <div className=''>
            <button id="start_btn">Start</button>
            <button id="stop_btn">Stop</button>
            <button id="pause_btn">Pause</button>
            <button id="estop_btn" style={{ backgroundColor: 'red' }}>E-stop</button>
            </div>
          </div>

          <div className="canvas_container bg-green-500">
            <div className="dimansion_bar" id="dimansion_bar">
              <p id="width_dim">Width:</p>
              <p id="height_dim">Height:</p>
              <p id="rotation_dim">Rotation:</p>
              <div className="zoom_btns">
                <button id="zoomIn">+</button>
                <button id="zoomOut">-</button>
              </div>
            </div>
            
            <div className="draw_tools_btns">
              <button id="draw_rect">▭</button>
              <button id="draw_circle">⬤</button>
              <button id="draw_triangle">△</button>
              <button id="draw_polygon">⬠</button>
              <button id="draw_line">─</button>
              <button id="draw_arrow">→</button>
              <button id="draw_ellipse">⬥</button>
            </div>

            <div className="utils_btns">
              <button id="build_btn">Build</button>
              <button id="send_svg">Send SVG</button>
              <button id="export_btn">Export</button>
              <button id="send_json">Send JSON</button>
            </div>
            
            <div className="control_btns">
              <div className="input-row">
                <label htmlFor="step-input">Steps</label>
                <input type="number" id="step-input" defaultValue="1" min="0.01" step="0.1" />
              </div>
              <div className="button-row">
                <button className="jog-button" data-gcode_val="Y1">↑</button>
              </div>
              <div className="button-row">
                <button className="jog-button" data-gcode_val="X-1">←</button>
                <button className="jog-button" data-gcode_val="A-1">&#10226;</button>
                <button className="jog-button" data-gcode_val="X1">→</button>
              </div>
              <div className="button-row">
                <button className="jog-button" data-gcode_val="Y-1">↓</button>
              </div>
              <div className="button-row">
                <button className="home-button" data-gcode_val="G28">&#127968;</button>
              </div>
            </div>
            
            <div className="canvas_wrapper" id="fabricCanvas"></div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="foot_bar" data-title="Workbench">
          <div className="Workbench_parts_wrapper"></div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal_overlay" id="modal_overlay">
          <div className="modal_content">
            <div className="size_select_wrapper">
              <label htmlFor="size_select">Choose size:</label>
              <select id="size_select">
                {sizeOptions.map((size, index) => (
                  <option key={index} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
            <div className="length_input_wrapper">
              <label htmlFor="length_input">Length</label>
              <input type="number" id="length_input" placeholder="Length" />
            </div>
            <div className="btn_wrapper">
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}