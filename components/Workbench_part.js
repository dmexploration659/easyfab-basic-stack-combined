import React, {useState} from "react";
import * as fabric from 'fabric';

const Wk_part = ({ part_data,title}) => {

    // function drawPartShape(){
    //     // const canvas = document.getElementById('build_canva');
    //     // const ctx = canvas.getContext("2d");
    //     // const x = Math.random() * (canvas.width - 100);
    //     // const y = Math.random() * (canvas.height - 60);
    //     // ctx.fillStyle = "grey";
    //     // ctx.fillRect(x, y, 20, 300); 
    // }

    const unit_to_pixels = {
      mm: 3.78,
      cm: 37.8,
      m: 3780,
    };

    // const unit_to_meters = {
    //   mm: 0.001,
    //   cm: 0.01,
    //   m: 1,
    // };



    function convertToScaledPixels(length, unit, canvas) {
      const scaleX = canvas.width / (2 * unit_to_pixels.m); 
      const scaleY = canvas.height / (7 * unit_to_pixels.m)
      const lengthInPixels = length * unit_to_pixels[unit];
      console.log(lengthInPixels);
      console.log(lengthInPixels * scaleX)
      return {
        width: lengthInPixels * scaleX, 
        height: lengthInPixels * scaleY, 
      };
    }

    const [n_part, setPartCount] = useState(1)

    const drawPartShape = () => {
        setPartCount(prevCount => prevCount+1)
        const canvasEl = document.getElementById('fabricCanvas');
        const canvas = canvasEl && canvasEl.fabric;

        const part_h = parseFloat(part_data.length.val);
        const part_w = parseFloat(part_data.width.val);
        const partH_unit = part_data.length.unit;
        const partW_unit = part_data.width.unit;
        const h_InPixels = convertToScaledPixels(part_h, partH_unit, canvas).height;
        const w_InPixels = convertToScaledPixels(part_w, partW_unit, canvas).width;
        
        if (canvas) {
          const partRect = new fabric.Rect({
            fill: "#555555",
            width: w_InPixels,
            height: h_InPixels,
            selectable: true,
            originX: "center",
            originY: "center", 
        });

        const label_font = Math.min(20, partRect.height / 12);
        const label_text = `${n_part}/  ${part_data.name} ${part_data.length.val}${part_data.length.unit}`
        const partLabel = new fabric.FabricText(label_text, {
          fontSize: label_font,
          fill: "white",
          textAlign: "center",
          originX: "center",
          originY: "center",
          angle: -90,
        });
        
        const partGroup = new fabric.Group([partRect, partLabel], {
          left: Math.random() * 700,
          top: Math.random() * 500,
          selectable: true,
          data: part_data
        });


          canvas.add(partGroup);
        } else {
          console.error('Canvas not found or Fabric.js instance is missing!');
        }
      };



    return (
        <div className="footer_card" onClick={drawPartShape}>
            <h4>{title}</h4>
            {
                Object.keys(part_data).filter(key => key!=="name")
                .map(key =>(
                    <p><strong>{key}:</strong>{part_data[key].val}</p>
                ))
            }

        </div>
    );
};

export default Wk_part;