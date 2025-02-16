import React from "react";
import * as fabric from 'fabric';
const Draw_tools = () => {

    
    const draw_tools_btns = [
        {id: "draw_rect", label: "▭", func: drawRectangle},
        {id: "draw_circle", label: "⬤", func: drawCircle},
        {id: "draw_triangle", label: "△"},
        {id: "draw_polygon", label: "⬠"},
        {id: "draw_line", label: "─"},
        {id: "draw_arrow", label: "→"},
        {id: "draw_ellipse", label: "⬥"},
        


    ];


    //=================== geometry shape functions============================//


 


    function drawRectangle (){  
        const canvasEl = document.getElementById('fabricCanvas');
        const canvas = canvasEl && canvasEl.fabric;
        if (canvas) {
          const partRect1 = new fabric.Rect({
            fill: null,
            stroke: "red",
            strokeWidth: 1,
            strokeUniform: true,
            width: 50,
            height: 50,
            selectable: true,
            originX: "center",
            originY: "center", 
            top: canvas.getHeight() / 2,
            left: canvas.getWidth() / 2
        });


          canvas.add(partRect1);
        } else {
          console.error('Canvas not found or Fabric.js instance is missing!');
        }
      }

      function drawCircle (){
        const canvasEl = document.getElementById('fabricCanvas');
        const canvas = canvasEl && canvasEl.fabric;
        if (canvas) {
            const circle = new fabric.Circle({
                fill: null,
                stroke: "red",
                strokeWidth: 1,
                strokeUniform: true,
                radius: 25,
                selectable: true,
                originX: "center",
                originY: "center",
                top: canvas.getHeight() / 2,
                left: canvas.getWidth() / 2
            })
            canvas.add(circle);
        } else {
            console.error('Canvas not found or Fabric.js instance is missing!');
        }
      }

    





    //=================== geometry shape functions============================//




    return (
        <div className="draw_tools_btns">
            {
                draw_tools_btns.map((btn) => (
                    <button key={btn.id} id={btn.id} onClick={btn.func || (() => console.log(`No handler for ${btn.id}`))}>{btn.label}</button>
                ))
            }
        </div>


    );
};

export default Draw_tools;