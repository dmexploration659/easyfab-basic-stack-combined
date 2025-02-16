import React, {useState} from "react";
import Wk_part from "./Workbench_part";

const Footer = ({wk_parts}) => {
  

  return (
    <div className="foot_bar" data-title="Workbench">
      <div className="Workbench_parts_wrapper">
      {
        wk_parts.map( (item,index) => (
         <Wk_part
          key={index}
          part_data={item}
          title={item.name}
         />
        ))}
        </div>
    </div>
)};

export default Footer;


// {
//   Object.entries(item).map(([key, value]) => (
//     <p key={key}><strong>{key}:</strong> {value}</p>
//   ))}