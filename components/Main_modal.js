import React from 'react';
import ReactDOM from "react-dom";
import Param_field from './Set_params_field';

const Modal = ({ part, closeModal, addClick }) => {
    if (!part) return null;

    const createPart = () => {
        const part_data= {};
        const values_elems = document.querySelectorAll('.modal_content .param_field');
        values_elems.forEach( elem =>{
            const val = elem.querySelector('.param_val').value;
            const parameter = elem.querySelector('.param_val').id;
            const unit = elem.querySelector('.param_unit').value;
            part_data[parameter] = {"val":val, "unit":unit}
        });
        part_data["name"] = part.title;
        if (part.def_2d_width) part_data["def_2d_width"] = part.def_2d_width;
        addClick(part_data);
        closeModal();
    }
    const params = part.params
    return  ReactDOM.createPortal(
        <div className="modal_overlay" onClick={closeModal}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <h2>{part.title}</h2>
                <div className='fields_wrapper'>
                    {Object.keys(params).map((key) => (
                        <Param_field param = {params[key]} />
                    ))
                    }
                </div>
                

                <div className='btn_wrapper'>
                    <button onClick={createPart}>Set</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
               
                
            </div>
        </div>,
        document.body
    );
};

export default Modal;
