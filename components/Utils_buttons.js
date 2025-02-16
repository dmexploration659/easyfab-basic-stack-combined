import React from "react";
import WebSocketClient from '../web_sock_client.js';
const wsClient = new WebSocketClient('ws://localhost:8080', 'part_planner');
wsClient.connect();

const Utils_buttons = () => {

  const STOCK_CONFIGURATIONS = {
    "Flat bar": 6000,
    "Square tube": 6000,
    "Round tube": 6000   
  };
  const mm_base={
    mm: 1,
    cm: 10,
    dm: 100,
    m: 1000
  }
  
  wsClient.onMessage((data) => {
    if (data.type === 'register-response') {
        if (data.success) {
            console.log(data.message);
        }
    } else if (data.type === 'private-message') {
        console.log(`Private message from ${data.from}: ${data.message}`);
    } else if (data.type === 'user-joined') {
        console.log(`User "${data.name}" has joined the chat.`);
    } else if (data.type === 'user-left') {
        console.log(`User "${data.name}" has left the chat.`);
    }
});


function postToWebSocket(targetClientName, message) {
  wsClient.sendPrivateMessage(targetClientName, message);
  console.log(`posting to ${targetClientName}`);
}

       
    function collectObjects() {
        const canvasEl = document.getElementById('fabricCanvas');
        const canvas = canvasEl && canvasEl.fabric;
            if (!canvas) {
              console.error('Canvas not found!');
              return;
            }
            // Get all objects from the canvas
            const allObjects = canvas.getObjects();
            // Filter to only get groups (part shapes)
            const partGroups = allObjects.filter(obj => obj.type === 'group');
            // Map through each group to extract properties
            const shapesData = partGroups.map(group => {
              // Get the rectangle and text objects from the group
              const rect = group._objects.find(obj => obj.type === 'rect');
              const text = group._objects.find(obj => obj.type === 'text');
              return {
                // Position and dimension properties
                position: {
                  left: group.left,
                  top: group.top
                },
                dimensions: {
                  width: rect.width,
                  height: rect.height
                },
                // The custom data we associated with the group
                partData: group.data,
                // Text properties
                label: text.text,
                fontSize: text.fontSize,
                // Group properties
                angle: group.angle,
                id: group.id
              };
            });
        
            // Log the collected data
            //console.log('All Shapes Data:', shapesData);
            buildMaterialsPlan(shapesData)
            return shapesData;
        
    }

    function generateSVG() {
      console.log('generating svg string');
      const canvasEl = document.getElementById('fabricCanvas');
      const canvas = canvasEl && canvasEl.fabric;
          
      const svgString = canvas.toSVG({suppressPreamble: true});


      console.log('svg string',svgString);
      postToWebSocket('ws_test', {title: 'svg', content: svgString});
          

    }
      

    function buildMaterialsPlan(shapesData) {
        const sidebar_head = document.querySelector('.sidebar_head');
        sidebar_head.innerHTML = '<h4>Required Stock:</h4>';
        if (!sidebar_head) {
            console.error('Could not find sidebar_head element');
            return;
        }
        const partsData = shapesData.map(obj => obj.partData);
        
        const stock_plan = getStockPlan(partsData);
       
        //postToWebSocket('ws_test', {title: 'stock_plan', content: JSON.stringify(stock_plan,null,2)});
        //postToWebSocket('ws_test', {title: 'shapes_data', content: JSON.stringify(shapesData,null,2)});
        postToWebSocket('py-executive-client', {title: 'shapes_data-test-pito', content: JSON.stringify(shapesData,null,2)});

        Object.keys(stock_plan).forEach(part => {
            const p = document.createElement('p');
            p.innerHTML = `${part}: <strong>${stock_plan[part].requiredStocks}</strong>`;
            sidebar_head.appendChild(p);
        });
    }


    //+++++++++++++++++++++++++++ claude +++++++++++++++++++++++++++++++++++++++//

  

    function getStockPlan(parts) {
        const groupedParts = parts.reduce((groups, part) => {
            if (!groups[part.name]) {
                groups[part.name] = [];
            }
            groups[part.name].push(part.length.val*mm_base[part.length.unit]);
            return groups;
        }, {});
    
        //Calculate required stocks for each category
        const stockResults = {};
        for (const [category, lengths] of Object.entries(groupedParts)) {
            const stockLength = STOCK_CONFIGURATIONS[category];
            // Sort lengths in descending order
            lengths.sort((a, b) => b - a);
            
            let currentStock = 0;
            let remainingLength = 0;
            let totalWaste = 0;
            // Process each required length
            for (const length of lengths) {
                if (length > stockLength) {
                    throw new Error(
                        `Cut length ${length}mm for ${category} exceeds stock length ${stockLength}mm`
                    );
                }
                // If we need a new stock piece
                if (length > remainingLength) {
                    currentStock++;
                    remainingLength = stockLength;
                }
                
                // Subtract the cut length
                remainingLength -= length;
            }
            
            // Calculate total waste
            totalWaste = (currentStock * stockLength) - 
                        lengths.reduce((sum, length) => sum + length, 0);
            
            // Store results for this category
            stockResults[category] = {
                requiredStocks: currentStock,
                totalLength: lengths.reduce((sum, length) => sum + length, 0),
                wasteLength: totalWaste,
                numberOfCuts: lengths.length,
                averageWastePerStock: totalWaste / currentStock
            };
        }
        
        return stockResults;
    }


    //++++++++++++++++++++++++ || claude || +++++++++++++++++++++++++++++++++++++++//







  const buttons = [
    { id: "build_btn", label: "Build", func: collectObjects },
    {id: "send_svg", label: "Send SVG", func: generateSVG },
    { id: "export_btn", label: "Export"},
    {id: "send_json", label: "Send JSON"},
  ];

  return (
    <div className="utils_btns">
      {buttons.map((button) => (
        <button key={button.id} id={button.id} style={button.style} onClick={button.func || (() => console.log(`No handler for ${button.id}`))}>
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default Utils_buttons;
