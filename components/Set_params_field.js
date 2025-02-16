import React from 'react';

const Param_field = ({param}) => {

    return (
        <div className="param_field" data-label = {param.name} >
            <input className='param_val' type={param.in_type} id={param.name} />
            <select className='param_unit'>
                {
                    param.units.map(unit => (
                        <option key={unit}>{unit}</option>
                    ))
                }
            </select>
        </div>
    );
};

export default Param_field;