import { checkPropTypes } from 'prop-types';
import React, { Component } from 'react';

const Input = ({name, label,  error, ...rest }) => {
    return ( 
    <React.Fragment>
        <div className="mb-3 "> 
        <label htmlFor={name} className=' col-form-label'>{ label } </label> <br />
        <input 
            // value={value}
            // onChange={onChange} 
            // type={type} // et on ajoute au lieu de ces trois the spread operator
            {...rest} //the spread operator of the other props
            name={name}
            id={name}
            className="col-sm-12 form-contol" 
        />
    </div>
    {error && <div className="alert alert-danger">{error} </div>}
    </React.Fragment>
    
     );
}
 
export default Input;