import React from 'react';
import classes from './css/CheckToggle.module.css'
import global from './css/Global.module.css'

export default ({ options }) => (
	<div>{options.map((option, idx) => <Toggle key={`Toggle-${idx}`} {...option}/>)}</div>
)

const Toggle = ({ label, title, style, selected, customStyle, click, dark }) => {
	return (
		<div className={[global.IndicatorContainer, classes.CheckToggle, classes[style]].join(' ')} style={customStyle}>
			{label ?? 
				<label className={global.ButtonLabel}>
					{label}
				</label>
			}
			<div className={[classes.CheckToggleOptions, classes[style]].join(' ')}>
					<button onClick={ _=> click(title)}
						className={selected && dark 
								? [classes.CheckToggleOption, classes.Selected, classes.dark].join(' ') 
								: selected && !dark
								? [classes.CheckToggleOption, classes.Selected].join(' ')
								: !selected && dark
								? [classes.CheckToggleOption, classes.dark].join(' ')
								: classes.CheckToggleOption }>
						{title}
					</button>
			</div>
		</div>
		
	)
}