import React, { useEffect } from 'react'
import { useMap } from '../../../components/customHooks'

const Map = ({ data, click }) => {

  const config = { 
		map: 'custom',
		style: "mapbox://styles/iea/ck9mv6pv834351ipiu0p02w80",
  }

  const { map, mapContainerRef } = useMap(config);

  useEffect(setDefaultMap, [map])
  useEffect (() => {
		if ( !map ) return;
		map
			.on('click', `projects-layer`, click)
		return () => {
			map
				.off('click', `projects-layer`, click);
		}
  })
  
  function setDefaultMap() {
    if (!map) return;
    map
      .addSource('projects', data)
      .addLayer({
        'id': 'projects-layer',
        'type': 'circle',
        'source': 'projects',
        'paint': {
          'circle-stroke-color': '#000', 
          'circle-stroke-width': 1, 
          'circle-radius': 7,
          'circle-color': [
            'match',
            ['get', 'sectorType'],
            'Industry/Fuel transformation',
            '#3e7ad3',
            '#00ada1'
          ],
        }
      });
  }

 return <div ref={mapContainerRef} className='map' />
}

export default Map
