import React, { useState } from 'react'
import Bubble from './Bubble'
import INCOME from './assets/income.json'
import NB from './assets/NB.json'
import NBHH from './assets/Nbperhh.json'
import CDD from './assets/CDD.json'
import COUNTRIES from './assets/countries.json'
import { Control } from '../../../components/controls'
import classes from './css/Bubble.module.css'


const BubbleWrapper = () => {

  const [year, setYear] = useState(1990);

  let colors = ["#04188e", "#546072", "#9ca159", "#e4bd35", "#d17f2e", "#b93326"];
  let range = [0, 500, 1000, 1500, 2000, 2500];
  let MAX_YEAR = 2070, MIN_YEAR = 1990;
  let yearIndex = year - MIN_YEAR;
  let countries = [...COUNTRIES],
    xPos = [...INCOME], 
    yPos = [...NBHH],
    radius = [...NB],
    color = [...CDD];
  let maxValue = Math.max(...xPos.flat());
  let slider =  [{ 
    type: 'slider',
    selected: year,
    label: year,
    value: year,
    min: MIN_YEAR,
    max: MAX_YEAR,
    step: 1,
    change: e => setYear(Number(e.target.value))
  }];

  let tempData = countries.reduce(mergeData, []).filter(filterData);
  let data = [];
  
  for (let i in colors) {
    data.push({
      data: [],
      color: colors[i],
      name: Number(i) < 5 ? `${range[Number(i)]} - ${range[Number(i) + 1]}` : `> ${range[Number(i)]}`
    })
  }
  
  for (let i in tempData) {
    getColor(tempData[i])    
  }

  function getValue(data) {
    let result = [];
    let tempData = [...data];
    for (let i in tempData) result.push(data[i][yearIndex])
    return result;
  }

  function mergeData(acc, curr, idx) {
    acc.push({
      x: getValue(xPos)[idx],
      y: getValue(yPos)[idx],
      z: getValue(radius)[idx],
      color: getValue(color)[idx],
      country: curr
    })
    return acc;
  }

  function getColor(value) {
    for (let idx in range) {
      let i = Number(idx);
      if (i === 5) {
        if (value.color > range[i]) 
        data[i].data.push({
          ...value,
          color: colors[i]
        })
      } else {
        if (value.color > range[i] && value.color < range[i+1]) {
          data[i].data.push({
            ...value,
            color: colors[i]
          })
        }
      }
    }
  }
  
  function filterData(d) {
    let hasRadius = d.z !== 0;
    let isNotNull = d.x !== null && d.y !== null && d.z !== null && d.color !== null;
    if ( hasRadius && isNotNull ) return d;
  }

  return (
    <div className='containerTest'>
      <Bubble data={data} maxValue={maxValue} />
      <div className={classes.Slider}>
        {slider.map((control, idx) => <Control key={idx} {...control} /> )}
      </div>
    </div>
  )
}

export default BubbleWrapper
