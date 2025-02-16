import React from "react";

const Part_card = ({ id, title, thumbnail,thisCardClicked }) => {
    

    return (
        <div className="sidebar_card" onClick={thisCardClicked}>
            <img src={thumbnail} alt={title} className="sidebar_card_thumbnail" />
            <h4 className="sidebar_card_title">{title}</h4>
        </div>
    );
};

export default Part_card;
