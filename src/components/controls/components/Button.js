import React from 'react';
import classes from './css/Button.module.css'
import global from './css/Global.module.css'

export default props => {

	const { type, options, label, flow } = props;
	let optionStyle = type === 'buttonGroup' && flow === 'row' 
		? [classes.RadioToggleOptions, classes.row].join(' ')
		: type === 'buttonGroup' && flow === 'column'
		? [classes.RadioToggleOptions, classes.column].join(' ') 
		: type === 'button' && flow === 'column'
		? [classes.CheckToggleOptions, classes.column].join(' ') 
		: [classes.CheckToggleOptions, classes.row].join(' ');
	
	return (
		<div className={classes.Toggle}>
			{label ?? <label className={global.ToggleLabel}> {label} </label>}
			<div className={optionStyle}> 
				{type === 'buttonGroup'
					? options.map((option, idx) => <Button key={`${type}-${idx}`} {...props} option={option} disabled={props.disabled} />)
					: options.map((option, idx) => <Button key={`Toggle-${idx}`} {...props} {...option} disabled={props.disabled} />)}
			</div>
		</div>
	)
}

const Button = props => {

	const {option, dark, type, selected, click, disabled } = props;
	const selectedType = type === 'buttonGroup' ? selected === option : selected;

	let isDisable = disabled && disabled.filter(d => d === option)[0];
	let disable = isDisable === option ? true : false;

	let optionStyle = selectedType && dark
		? [classes.ToggleOption, classes.active, classes.dark].join(' ') 
		: selectedType && !dark
		? [classes.ToggleOption, classes.active].join(' ') 
		: !selectedType && dark
		? [classes.ToggleOption, classes.dark].join(' ')
		: classes.ToggleOption;

	return (
		<button onClick={ _=> click(option)} className={!disable ? optionStyle : [optionStyle, classes.disabled].join(' ') } disabled={disable}> 
			{option}
		</button>
	)
}