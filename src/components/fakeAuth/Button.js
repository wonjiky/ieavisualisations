import React from 'react';
import classes from './css/Button.module.css';

export default props => (
	<button
		disabled={props.disabled}
		className={[classes.Button, classes[props.btnType]].join(' ')}
		onClick={props.clicked}> {props.children} </button>
); 