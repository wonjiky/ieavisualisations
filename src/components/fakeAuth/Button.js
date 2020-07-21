import React from 'react';

export default props => (
	<button
		disabled={props.disabled}
		onClick={props.clicked}> 
		{props.children} 
	</button>
); 