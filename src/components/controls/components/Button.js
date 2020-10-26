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
					? options.map((option, idx) => <Button key={`${type}-${idx}`} {...props} option={option}/>)
					: options.map((option, idx) => <Button key={`Toggle-${idx}`} {...props} {...option} />)}
			</div>
		</div>
	)
}

const Button = props => {

	const {option, dark, type, selected, click } = props;
	const selectedType = type === 'buttonGroup' ? selected === option : selected;
	let optionStyle = selectedType && dark
		? [classes.ToggleOption, classes.active, classes.dark].join(' ') 
		: selectedType && !dark
		? [classes.ToggleOption, classes.active].join(' ') 
		: !selectedType && dark
		? [classes.ToggleOption, classes.dark].join(' ')
		: classes.ToggleOption;
	
	return (
		<button onClick={ _=> click(option)} className={optionStyle}> 
			{option}
		</button>
	)
}