import React from 'react';
import global from './css/Global.module.css'
import classes from './css/RadioToggle.module.css'

export default ({ label, options, style, selected, customStyle, click, dark }) => (
	<div className={[global.IndicatorContainer, classes.RadioToggle].join(' ')} style={customStyle}>
		{label ?? 
			<label className={global.RadioToggleLabel}>
				{label}
			</label>
		}
		<div className={[classes.RadioToggleOptions, classes[style]].join(' ')}>
			{options.map(option => (
				<button key={option} onClick={_ => click(option)}
					className={
							selected === option && dark 
							? [classes.RadioToggleOption, classes.Selected, classes.dark].join(' ') 
							: selected === option && !dark
							? [classes.RadioToggleOption, classes.Selected].join(' ')
							: selected !== option && dark
							? [classes.RadioToggleOption, classes.dark].join(' ')
							: classes.RadioToggleOption }>
					{option}
				</button>
			))}
		</div>
	</div>
)