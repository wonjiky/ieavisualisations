import React from 'react'
import { useGridMapTest } from '../../components/customHooks';


function WeatherByGrid_test() {
  const mapConfig = {
    center: [155, 24],
  } 
  const { map, popUp, mapContainerRef } = useGridMapTest({ mapConfig });
  
  React.useEffect(() => {
    if(!map) return;
  })
  return <div ref={mapContainerRef} className='map'/>
}

export default WeatherByGrid_test;
