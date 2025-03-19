import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2 className="modal_title">Select Your Preferences</h2>
        <div className="size_select_wrapper">
          <label htmlFor="size_select">Choose size:</label>
          <select id="size_select">
            <option value="">Select...</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="length_input_wrapper">
          <label htmlFor="length_input">Length</label>
          <input type="number" id="length_input" placeholder="Enter length" />
        </div>
        <div className="btn_wrapper">
          <button className="btn_cancel" onClick={onClose}>Cancel</button>
          <button className="btn_confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
