import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getMonthString, withIntervalLogic, getCountryNameByISO, usePrevious } from './util'
import classes from './css/CountryInfo.module.css'

export default props => {
  const { selectedCountry, interval, date } = props;
  const newData = props.data !== usePrevious(props.data);
  const newCountry = selectedCountry !== usePrevious(selectedCountry);
  // const newVariable = variable.id !== usePrevious(variable.id);

  /**
   * 데이터가 이전이랑 같을때
   * 나라가 이전이랑 다를때
   * 베리어블이 이전이랑 다를때
   * 
   * 
   * 데이터가 다르고 나라가 다를때
   * 데이터가 다르고 베리어블이 다를때
   */
  
  return (
    <div className={classes.Wrapper}>
      {!props.data 
        ? <span> {selectedCountry ? 'Loading...' : 'Select a country by clicking on the map'} </span>
        : <>
            <div className={classes.CountryWrapper}>
              {getCountryNameByISO(selectedCountry)}
              {withIntervalLogic([' a from 2000 - 2020', ` in ${date.year}`, ` in ${getMonthString(date.month)}`], interval)}
              {!newData && newCountry ? ' loading...' :  ''}
            </div>
            <Chart {...props} /> 
          </>}
    </div>
  )
}

const Chart = ({
  data, 
  date, 
  interval, 
  unit
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
      category: withIntervalLogic([
        data.map(d => d[0]),data.map(d => d[0]),data.map(d => d[0])
        ], interval),
      tickInterval: 1,
      lineWidth: 0
    },
    tooltip: {
      formatter: function () {
          let { month, year } = date;
          let time = withIntervalLogic([year, getMonthString(month), `${getMonthString(month)} ${this.x}`] , interval)
          return `
            <strong>${time}</strong><br/>
            ${this.y.toFixed(2)}${unit}
          `
      }
    },
    series: [
      {
        data: data,
        color: '#fff'
      }
    ]
  };
  
  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  )
}