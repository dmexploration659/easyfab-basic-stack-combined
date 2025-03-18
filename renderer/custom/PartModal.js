import { useState } from 'react';

export default function PartModal({ content, onClose, onAddPart }) {
  const [paramValues, setParamValues] = useState({});
  
  const handleInputChange = (key, value, unit) => {
    setParamValues(prev => ({
      ...prev,
      [key]: { val: value, unit }
    }));
  };
  
  const handleAddPart = () => {
    const partData = {
      title: content.title,
      ...paramValues
    };
    onAddPart(partData);
  };
  
  return (
    <div className="modal_content">
      <h2>{content.title}</h2>
      <div className="fields_wrapper">
        {Object.entries(content.params).map(([key, param]) => (
          <div key={key} className="param_field" data-label={key}>
            <input 
              className="param_val" 
              id={key} 
              type={param.in_type}
              onChange={(e) => handleInputChange(
                key, 
                e.target.value, 
                document.querySelector(`#${key}_unit`).value
              )}
            />
            <select 
              id={`${key}_unit`}
              className="param_unit"
              onChange={(e) => handleInputChange(
                key, 
                document.querySelector(`#${key}`).value, 
                e.target.value
              )}
            >
              {param.units.map((unit, index) => (
                <option key={index}>{unit}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="btn_wrapper">
        <button onClick={handleAddPart}>Set</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
