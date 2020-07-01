import React from 'react'
import classes from './css/Control.module.css'

function Control({ timeRange, ...props }) {
  return (
      <div className={classes.ControlWrapper}>
				<div className={classes.Slider}>
					{/* <h1>{viewUnit === 'day' ? `${monthOfDayView}-${time}-2020` : time}</h1>
					<Slider 
						width={'100%'}
						height={10}
						margin={10}
						time={50}
						range={[0, timeRange.length - 1]}
						toggleChange={value => props.setTimesetTime(timeRange[value])}
						// toggleChange={value => setTime(timeRange[value])}
					/> */}
				</div>
				{/* <ul className={classes.SliderType}>
					{viewUnits.map(viewType =>
						<li 
							key={viewType}
							className={ viewUnit === viewType ? [classes.Options, classes.selected].join(' ') : classes.Options } 
							onClick={ _ =>
								 (time.substring(0,3) === 'Apr' && type === 'solar radiation') || (timeRange.length > 10 && type === 'solar radiation')
								 ? props.changeViewUnit(viewType) 
								 : alert('Data by day does not exist. Please select (April, Solar Radiation)') }> 
							{viewType}
							</li>
						)}
				</ul>
				<ul className={classes.Indicator}>
					{indicators.map((indicator, i) => 
						<li
							key={i}
							className={type === indicator ? [classes.Options, classes.selected].join(' ') : classes.Options }
							onClick={ _ =>
								timeRange.length > 10 && type === 'solar radiation'
								? alert('Please select by month') 
								: props.changeIndicator(indicator) } 
						> 
							{indicator}
						</li>
					)}
				</ul> */}
      </div>
  )
}

export default Control
