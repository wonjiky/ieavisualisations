import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getMonthString, withIntervalLogic, getCountryNameByISO, usePrevious } from './util'
import classes from './css/CountryInfo.module.css'

export default props => {
  const { countries, interval, date } = props;
  // const newData = props.data[0] !== usePrevious(props.data[0]);
  // const newCountry = countries[0] !== usePrevious(countries[0]);
  // const newVariable = variable.id !== usePrevious(variable.id);
  let color = ['#fff', 'yellow']
  let series = props.data.map((d,idx) => ({id: d[0], data: d[1], color: color[idx]}));
  
  return (
    <div className={classes.Wrapper}>
      {props.data.length === 0
        ? <span> {countries.length > 0 ? 'Loading...' : 'Select up to 2 countries by clicking on the map'} </span>
        : <>
            <div className={classes.CountryWrapper}>
              {/* {!newData && newCountry ? ' loading...' :  ''} */}
              <span>{withIntervalLogic(['From 2000 - 2020', `${date.year}`, `${getMonthString(date.month)}`], interval)}</span>
              <div className={classes.CountryLegendWrapper}>
                {props.data.map((d, idx) => (
                  <div key={idx} className={classes.CountryLegendItem}>
                    {getCountryNameByISO(d[0])}
                    <div className={classes.Legend} style={{background: color[idx]}}/>
                  </div>
                ))}
              </div>
            </div>
            <Chart series={series} {...props} /> 
          </>}
    </div>
  )
}

const Chart = ({
  data, 
  date, 
  interval, 
  unit,
  series
}) => {
  
  const containerProps = {
    style: {
      height:'170px',
      width: '100%',
      backgroundColor: 'transparent'
    }
  }

  const options = {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
    },
    title: {
      text: null
    },
    legend:{
      enabled: false
    },
    credits: {
      enabled: false
    },
    yAxis: {
      visible: false,
    },
    xAxis: {
      offset: 0,
      minorTickLength: 0,
      tickLength: 0,
      // category: withIntervalLogic([
      //   data.map(d => d[0]),data.map(d => d[0]),data.map(d => d[0])
      //   ], interval),
      tickInterval: 1,
      lineWidth: 0
    },
    tooltip: {
      formatter: function () {
          let { month, year } = date;
          let time = withIntervalLogic([year, getMonthString(month), `${getMonthString(month)} ${this.x}`] , interval)
          return `
            <strong>${time}</strong><br/>
            <strong>${getCountryNameByISO(this.series.userOptions.id)}</strong><br/>
            ${this.y.toFixed(2)}${unit}
          `
      }
    },
    series: series
  };

  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  )
}