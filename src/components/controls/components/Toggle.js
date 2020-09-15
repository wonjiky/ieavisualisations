import React from 'react';
import classes from './css/Toggle.module.css'
import global from './css/Global.module.css'

export default ({ label, style, selected, options, customStyle, click }) => (
	<div className={[global.IndicatorContainer, classes.Toggle].join(' ')} style={customStyle}>
		{label ?? 
			<label className={global.ButtonLabel}>
				{label}
			</label>
		}
		<div className={[classes.ToggleOptions, classes[style]].join(' ')}>
				<button onClick={_ => click(options)}
					className={selected  
							? [classes.ToggleOption, classes.Selected].join(' ') 
							: classes.ToggleOption }>
					{options}
				</button>
		</div>
	</div>
)