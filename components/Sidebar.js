import React from "react";
import Part_card from "./Part_card";
import parts_library from "./parts_library.json";

const Sidebar = ({onCardClick}) => {
  return (<div className="side_bar" data-title="Parts Library">
    <div className="sidebar_head">Preview</div>
     <div className="sidebar_card_wrapper">
     {parts_library.map((card) => (
                    <Part_card
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        thumbnail={card.thumbnail}
                        thisCardClicked={() => onCardClick(card)}
                    />
                ))}
     </div>
  </div>);
};

export default Sidebar;
