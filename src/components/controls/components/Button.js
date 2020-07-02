import React from 'react';
import classes from './css/Button.module.css';

export default ({ list, selected, click }) => (
	<div className={classes.ButtonWrapper}>
		{list.map((item, i) => (
			<button 
				key={item + i}
				onClick={() => click(item)}
				className={selected === item ? classes.Selected : ''}
			>
				{item}
			</button>
		))}
	</div>
)