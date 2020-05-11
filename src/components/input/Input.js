import React from 'react';
import classes from './css/Input.module.css'

export default props => {
    const inputClasses=  [classes.InputElement];
    
    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    let inputElement = null;
    switch(props.elementType) {
        case('input'):
            inputElement = <input 
                className={inputClasses.join(' ')} 
                onChange={props.changed}
                {...props.elementConfig} 
                value={props.value} />;
            break;
        default:
            inputElement = <input 
                className={inputClasses.join(' ')} 
                onChange={props.changed}
                {...props.elementConfig} 
                value={props.value} />;
    }
    
    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );
};
