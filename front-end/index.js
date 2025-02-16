import WebSocketClient from '../web_sock_client.js';
import { FabricCanvasManager } from './fab_canvas.js';
//import { TwoApp } from './two_canvas.js';


let is_device_connected = false;
let is_serial_data_valid = false;
let cnc_canvas;
let parts_library = [];
const workbench_parts = new Map();

const wsClient = new WebSocketClient('ws://localhost:8080', 'front-end-client');
wsClient.connect();

const part_card = (content) => {
    return `
    <div class="sidebar_card" id="${content.title}" onclick='openModal(${JSON.stringify(JSON.stringify(content))})'>
        <p>${content.title}</p>
        <img src="${content.thumbnail}">
    </div>
    `
}

const part_modal = (content) =>{
    console.log("object passed to modal");
    console.log(content);
    const fields = Object.entries(content.params).map(([key, param]) => {
        return `<div class="param_field" data-label="${key}">
                <input class="param_val" id="${key}" type="${param.in_type}">
                <select class="param_unit">${param.units.map(unit => `<option>${unit}</option>`).join('')}</select>
                </div>`
    }).join('');

    return `
        <div class="modal_content">
            <h2>${content.title}</h2>
            <div class="fields_wrapper">${fields}</div>
            <div class="btn_wrapper">
                <button onclick="addPart('${content.title}')">Set</button>
                <button onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `
}


document.addEventListener("DOMContentLoaded", async function () {
    console.log('parts_library#######');
    await populate_parts_cards();
    const select_port = document.getElementById("port_select");
    wsClient.onMessage((data) => {
        console.log('Received WebSocket message---front-end:', data);
        if (data?.type === 'private-message' && data?.title === 'available_ports') {
            data.message.ports.forEach(port => {
                const option = document.createElement("option");
                option.value = port.device;
                port.description.includes("USB")
                    ? option.textContent = `${port.device} (${port.description})`
                    : option.textContent = `${port.device}`;


                select_port.appendChild(option);
            });
        }
        if (data?.type === 'private-message' && data?.title === 'serial_response') {
            is_device_connected = data.message.connected;
            if (is_device_connected) {
                console.log("device connected +++++++++", data.message.text);
                document.getElementById("send_gcode").disabled = false;
                select_port.parentElement.classList.add("connected");
                
            } else {
                console.log("device connected xxxxx", data.message.text);
                document.getElementById("send_gcode").disabled = true;
            }
        }
    });

    const containerDiv = document.getElementById("fabricCanvas");
    const dim_bar = document.getElementById("dimansios_bar");
    //const paperCanvas = document.getElementById("paperCanvas");
    // const twoApp = new TwoApp('paperCanvas');

    // // Add event listeners to buttons
    // document.getElementById('draw_circle').addEventListener('click', () => {
    //     twoApp.drawCircle(100); // Draw a circle with 50mm diameter
    // });

    // document.getElementById('draw_rect').addEventListener('click', () => {
    //     twoApp.drawRectangle(100, 100); // Draw a rectangle with 50mm width and height
    // });

    if (containerDiv) {
        cnc_canvas = new FabricCanvasManager(containerDiv, dim_bar);
        // Attach event listeners to existing buttons
        document.getElementById("draw_rect").addEventListener("click", () => cnc_canvas.drawRectangle());
        document.getElementById("draw_circle").addEventListener("click", () => cnc_canvas.drawCircle());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Delete') {
              cnc_canvas.deleteSelected();
            }});
    }
    select_port.addEventListener("focus", () => {
        select_port.innerHTML = "";
        wsClient.sendPrivateMessage("py-executive-client", {title: "ports_request", content: "ports_request"});
    });

    select_port.addEventListener("change", () => {
        wsClient.sendPrivateMessage("py-executive-client", {title: "connect_port", content: {port: select_port.value}});
    });
    document.getElementById("build_btn").addEventListener("click", () => {
        const objects = cnc_canvas.collectObjects();
        console.log(objects);
    });

    document.getElementById("start_btn").addEventListener("click", () => {
        const objects = cnc_canvas.collectObjects();
        console.log('submited json obj',objects[0].gcode_data);
        try {
            wsClient.sendPrivateMessage("py-executive-client", { title: "send_to_cnc", content: objects[0].gcode_data});
        } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid JSON format. Please enter a valid JSON object.");
        }
        
    });

});

window.sendGcode = function() {
    const gcode = document.getElementById("json_string").value;
    try {
        const json_obj = JSON.parse(gcode) ;
        wsClient.sendPrivateMessage("py-executive-client", { title: "send_to_cnc", content: json_obj});
    } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON format. Please enter a valid JSON object.");
    }
};

async function populate_parts_cards(){
    parts_library = await (await fetch('./parts_library.json')).json();
    console.log("populating parts cards");
    const parts_cards_container = document.querySelector(".sidebar_card_wrapper");
    parts_cards_container.innerHTML = "";
    parts_library.forEach(part => {
        console.log(part);
        const card_item = part_card(part);
        parts_cards_container.innerHTML += card_item;
        
    });
}

window.openModal = function(card_content) {
    const content = JSON.parse(card_content);
    console.log("opening modal");
    console.log(content);
    const modal_content = part_modal(content);
    document.getElementById("modal_overlay").innerHTML = modal_content;
    document.getElementById("modal_overlay").classList.add("show");
}

window.closeModal = function(){
    document.getElementById("modal_overlay").innerHTML = "";
    document.getElementById("modal_overlay").classList.remove("show");
}

window.addPart = function(part_title){
    const card_content = document.querySelectorAll('.modal_content .param_field');
    const part_data = {'title': part_title}
    let footer_card_content = Array.from(card_content).map(param => {
        part_data[param.dataset.label] = {
            val: param.querySelector('.param_val').value,
            unit: param.querySelector('.param_unit').value
        };
        
        return `<p>${param.dataset.label}:${param.querySelector('.param_val').value}
                ${param.querySelector('.param_unit').value}</p>` }).join('');
    
    const footer_card = document.createElement("div");
    footer_card.classList.add("footer_card");
    footer_card.setAttribute('data-id', part_title);
    footer_card.id = uidGen();
    workbench_parts.set(footer_card.id, part_data);
    footer_card.innerHTML = footer_card_content;
    document.querySelector('.Workbench_parts_wrapper').appendChild(footer_card);
    footer_card.addEventListener('click', () => {
        console.log(workbench_parts.get(footer_card.id));
        cnc_canvas.drawPartShape(workbench_parts.get(footer_card.id));
    });
    closeModal();
}


window.uidGen = function() {
    return `shape_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
  }
















  //====================================*****=====================================//


      // Initialize Fabric.js canvas inside the existing wrapper
    // const canvasEl = document.createElement("canvas");
    // document.getElementById("fabricCanvas").appendChild(canvasEl);
    // const canvas = new fabric.Canvas(canvasEl);


 // Shape drawing functions
    // function drawRectangle() {
    //     const rect = new fabric.Rect({
    //         fill: "transparent",
    //         stroke: "red",
    //         strokeWidth: 1,
    //         width: 50,
    //         height: 50,
    //         selectable: true,
    //         originX: "center",
    //         originY: "center",
    //         top: canvas.height / 2,
    //         left: canvas.width / 2,
    //     });
    //     canvas.add(rect);
    // }

    // function drawCircle() {
    //     const circle = new fabric.Circle({
    //         fill: "transparent",
    //         stroke: "red",
    //         strokeWidth: 1,
    //         radius: 25,
    //         selectable: true,
    //         originX: "center",
    //         originY: "center",
    //         top: canvas.height / 2,
    //         left: canvas.width / 2,
    //     });
    //     canvas.add(circle);
    // }

    // Get the container dimensions
    // const container = canvasEl.parentElement;
    // const containerWidth = container.clientWidth;
    // const containerHeight = container.clientHeight;

    // // Set canvas dimensions to match container
    // canvasEl.width = containerWidth;
    // canvasEl.height = containerHeight;

    // // If using fabric.js, you'll need to also set the fabric canvas size
    // if (canvas) {
    //     canvas.setWidth(containerWidth);
    //     canvas.setHeight(containerHeight);
    // }