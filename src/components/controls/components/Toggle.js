import React from 'react';
import classes from './css/Toggle.module.css'
import global from './css/Global.module.css'

export default props => {

	const { type, options, label, flow } = props;

	return (
		<div className={classes.Toggle}>
			{label ?? <label className={global.ToggleLabel}> {label} </label>}
			<div 
				className={
					type === 'radio' && flow === 'row' 
					? [classes.RadioToggleOptions, classes.row].join(' ')
					: type === 'radio' && flow === 'column'
					? [classes.RadioToggleOptions, classes.column].join(' ') 
					: type === 'check' && flow === 'column'
					? [classes.CheckToggleOptions, classes.column].join(' ') 
					: [classes.CheckToggleOptions, classes.row].join(' ') 
			}> 
				{type === 'radio'
					? options.map((option, idx) => <Button key={`${type}-${idx}`} {...props} option={option}/>)
					: options.map((option, idx) => <Button key={`Toggle-${idx}`} {...props} {...option} />)}
			</div>
		</div>
	)
}

const Button = props => {

	const {option, dark, type, selected, click } = props;
	const selectedType = type === 'radio' ? selected === option : selected;

	return (
		<button 
			onClick={ _=> click(option)}
			className={selectedType && dark
				? [classes.ToggleOption, classes.active, classes.dark].join(' ') 
				: selectedType && !dark
				? [classes.ToggleOption, classes.active].join(' ') 
				: !selectedType && dark
				? [classes.ToggleOption, classes.dark].join(' ')
				: classes.ToggleOption }
		>
			{option}
		</button>
	)
}