import React from 'react';
import global from './css/Global.module.css'
import classes from './css/Button.module.css'

export default ({ label, options, style, selected, customStyle, click }) => (

	<div className={[global.IndicatorContainer, classes.Button].join(' ')} style={customStyle}>
		{label ?? 
			<label className={global.ButtonLabel}>
				{label}
			</label>
		}
		<div className={[classes.ButtonOptions, classes[style]].join(' ')}>
			{options.map(option => (
				<button key={option} onClick={_ => click(option)}
					className={
							selected === option 
							? [classes.ButtonOption, classes.Selected].join(' ') 
							: classes.ButtonOption }>
					{option}
				</button>
			))}
		</div>
	</div>
)