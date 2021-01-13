import React from 'react';
// import { useTheme } from '../../../context'
import { useTheme } from '@iea/react-components'
import classes from './css/Button.module.css'

export default ({ 
	options, 
	label, 
	flow, 
	selected, 
	click, 
	disabled 
}) => {

	const ButtonStyle = flow === 'row' 
		? [classes.Buttons, classes.row].join(' ')
		: [classes.Buttons, classes.column].join(' ');

	return (
		<div className={classes.ButtonWrapper}>
			{label ?? <label className={classes.ButtonLabel}> {label} </label>}
			<div className={ButtonStyle}> 
				{options.map((option, idx) => 
					<Button 
						key={`${option}-${idx}`} 
						option={option} 
						selected={selected}
						click={click}
						disabled={disabled} 
					/>)}
			</div>
		</div>
	)
}

const Button = ({ option, selected, click, disabled }) => {
	
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const labels = option.label || option, values = option.value || option;
	const selectedOption = selected === values;
	const hasDisabled = disabled && disabled.filter(d => d === values)[0];
	const isDisabled = hasDisabled === values ? true : false;

	const optionStyle = selectedOption && isDark
		? [classes.active, classes.dark].join(' ') 
		: selectedOption && !isDark 
		? classes.active
		: !selectedOption && isDark 
		? classes.dark
		: null;

	const buttonStyle = !isDisabled 
		? optionStyle : [optionStyle, classes.disabled].join(' ');
	const label = findSubpowerFromText(String(labels), 'CO2', '2');
	return (
		<button className={buttonStyle} onClick={ _ => click(option)} disabled={isDisabled}> 
			{label}
		</button>
	);
}

const findSubpowerFromText = (text, key, sub) => {
	if(text === undefined) return text;
	let tempLowestIndex = Number.MAX_SAFE_INTEGER;
	let tempLowestWord;
	let found = false;
	let tempIndex = text.search(sub);
	let hasKey = text.search(key);
	if (tempIndex < tempLowestIndex && tempIndex !== -1 && hasKey === 0) {
		tempLowestIndex = tempIndex;
		tempLowestWord = sub;
		found = true;
	}

	if (found) {
		let t = [
			text.substring(0, tempLowestIndex),
			text.substring(
				tempLowestIndex,
				tempLowestIndex + tempLowestWord.length
			),
			text.substring(tempLowestIndex + tempLowestWord.length)
		];
		return <>{t[0]}<sub>{t[1]}</sub>{t[2]}</> 
	} else {
		return text;
	}
};