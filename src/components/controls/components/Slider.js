import React from 'react'
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { Handle, Track } from './SliderComponent';
import classes from './css/Slider.module.css';

const TimeSlider = ({ width, height, margin, range, toggleChange, time }) => {
    
	const sliderStyle = {  
		position: 'relative',
		width: width,
		height: height,
		marginBottom: margin
	}
	return (
		<Slider
			domain={range}
			values={[time]}
			step={1}
			mode={1}
			rootStyle={sliderStyle}
			onChange={value => toggleChange(value)}
		>
			<Rail>
			{({ getRailProps }) => ( 
					<div className={classes.RailStyle} {...getRailProps()} /> 
				)}
			</Rail>
			<Handles>
				{({ handles, getHandleProps }) => (
						<div>
							{handles.map(handle => (
									<Handle
										key={handle.id}
										handle={handle}
										getHandleProps={getHandleProps}
									/>
							))}
						</div>
				)}
			</Handles>
			<Tracks right={false}>
				{({ tracks, getTrackProps }) => (
					<div>
						{tracks.map(({ id, source, target }) => (
							<Track
								key={id}
								source={source}
								target={target}
								getTrackProps={getTrackProps}
							/>
						))}
					</div>
				)}
			</Tracks>
		</Slider>   
	);
}

export default TimeSlider;
