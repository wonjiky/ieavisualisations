import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Icon } from '../../../components/icons'
import { getCountryNameByISO } from './util'
import classes from './css/CountryInfo.module.css'

export default ({ data, countries, mapType, unit, click }) => {
  
  let series = data.map(d => ({
    id: d.ISO, 
    name: getCountryNameByISO(d.ISO),
    data: d.data, 
    color: d.color,
    marker: { symbol: 'circle' },
    interval: d.interval
  }));

  return (
    <div className={mapType === 'country' ? classes.Wrapper : classes.hide}>
      {!countries.firstCountry.ISO && !countries.secondCountry.ISO
        ? <span>Select up to 2 countries by clicking on the map</span>
        : <>
            <div className={classes.CountryWrapper}>
              <div className={classes.CountryLegendWrapper}>
                {Object.values(countries).map((d,idx) => (
                  d.ISO && 
                    <div key={idx} className={classes.CountryLegendItem} onClick={_ => click(d.ISO)}>
                      {getCountryNameByISO(d.ISO)}
                      {data.find(c => c.ISO === d.ISO)
                        ? <div className={classes.Legend} style={{background: d.color}}/> 
                        : ' loading...'}
                      <Icon 
                        type='close' 
                        dark={true} 
                        stroke='#fff' 
                        styles={classes.Close} 
                        viewBox={'-4 -4 26 26'} 
                      />
                    </div>
                ))}
              </div>
            </div>
            {data.length !== 0 && <Chart series={series} unit={unit}/> }
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
      lineWidth: 0,
      type: 'datetime',
      tickInterval: series[0].interval
    },
    tooltip: {
      valueDecimals: 2,
      valueSuffix: unit,
      borderWidth: 0,
      shared: true,
      xDateFormat: '%Y-%m-%d',
    },
    series: series
  };

  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  );
}