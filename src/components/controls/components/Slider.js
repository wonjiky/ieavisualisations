import React from 'react'
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { Handle, Track } from './SliderComponent';
import classes from './css/Slider.module.css';
import global from './css/Global.module.css';

const TimeSlider = ({ width, height, range, currTime, change, time, label }) => {

	const sliderStyle = {  
		position: 'relative',
		width: width,
		height: height,
		paddingTop: 10
	}


	console.log(
		width, height, range, currTime, change, time, label
	);
	
	return (
		<div className={[global.ControlContainer, classes.Slider].join(' ')}>
			{label 
			? <label className={[global.ControlLabel, classes.SliderLabel].join(' ')}>{label}<span>{currTime}</span></label>
			: null
			}
			<Slider
				domain={range}
				values={[time]}
				step={1}
				mode={1}
				rootStyle={sliderStyle}
				onChange={value => console.log('hello') || change(value)}
				// onUpdate={value => console.log('hello') || change(value)}
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
		</div>
	);
}

export default TimeSlider;
