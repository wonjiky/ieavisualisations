import React from 'react';
import global from './css/Global.module.css'
import classes from './css/Button.module.css'

export default ({ label, options, selected, click }) => (
	<div className={[global.IndicatorContainer, classes.Button].join(' ')}>
		{/* <label className={global.IndicatorLabel}>
			{label}
		</label> */}
		{options.map(option => (
			<div key={option} className={classes.ButtonOption}>
				<button key={option}>
					{option}
				</button>
			</div>  
		))}
	</div>
)