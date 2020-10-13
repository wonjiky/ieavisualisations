import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Icon } from '../../../components/icons'
import { getCountryNameByISO } from './util'
import classes from './css/CountryInfo.module.css'

export default ({ data, countries, mapType, unit, click }) => {

  let series = data.map(d => ({
    id: d[0][0], 
    name: getCountryNameByISO(d[0][0]),
    data: d[0][1], 
    color: d[1],
    marker: { symbol: 'circle' }
  }));

  return (
    <div className={mapType === 'country' ? classes.Wrapper : classes.hide}>
      {data.length === 0
        ? <span> {countries.length > 0 ? 'Loading...' : 'Select up to 2 countries by clicking on the map'} </span>
        : <>
            <div className={classes.CountryWrapper}>
              <div className={classes.CountryLegendWrapper}>
                {data.map((d, idx) => (
                  <div key={idx} className={classes.CountryLegendItem} onClick={_ => click(d[0][0])}>
                    {getCountryNameByISO(d[0][0])}
                    <div className={classes.Legend} style={{background: d[1]}}/>
                    <Icon type='close' dark={true} stroke='#fff' styles={classes.Close} viewBox={'-4 -4 26 26'} />
                  </div>
                ))}
              </div>
            </div>
            <Chart series={series} data={data} unit={unit} /> 
          </>}
    </div>
  );
}

const Chart = ({ series, unit }) => {
  
  const containerProps = {
    style: {
      height:'170px',
      width: '100%',
      backgroundColor: 'transparent'
    }
  };

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
      type: 'datetime',
      lineWidth: 0
    },
    tooltip: {
      valueDecimals: 2,
      valueSuffix: unit,
      borderWidth: 0,
      shared: true,
      xDateFormat: '%Y-%m-%d',
    },
    series: series,
  };

  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  );
}