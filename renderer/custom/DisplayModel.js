import React from 'react'

const DisplayModel = (
  { sizeOptions, closeModal }
) => {
  return (
    <div className="modal_overlay" id="modal_overlay">
      <div className="modal_content">
        <div className="size_select_wrapper">
          <label htmlFor="size_select">Choose size:</label>
          <select id="size_select">
            {sizeOptions.map((size, index) => (
              <option key={index} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>
        <div className="length_input_wrapper">
          <label htmlFor="length_input">Length</label>
          <input type="number" id="length_input" placeholder="Length" />
        </div>
        <div className="btn_wrapper">
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DisplayModel