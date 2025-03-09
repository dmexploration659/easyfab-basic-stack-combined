import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Workspace from "../components/Workspace";
import Footer from "../components/Footer";
import Modal from "../components/Main_modal";
import AddShapeButton from "../components/Add_shape"
// import "./App.css"; 

const App = () => {
  const [show_modal, setShowModal] = useState(false);
  const [selected_part, setSelectedPart] = useState(null);
  const[wk_parts, setWkParts] = useState([]);
  
  const addPart = (new_part) =>{
    setWkParts((current_parts) => [...current_parts,new_part]);
  };

  const openModal = (part) => {
    console.log("card clicked!!")
      setSelectedPart(part);
      setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false); 
    setSelectedPart(null); 
  };

  return (
    <div className="main_cont">
      <Sidebar onCardClick={openModal} />
      <Workspace />
      <Footer
         wk_parts={wk_parts}        
        />
      {show_modal &&(
         <Modal 
         part={selected_part}
         closeModal={closeModal}
         addClick={addPart}
       /> 
      )}     
    </div>
    
  );
};

export default App;