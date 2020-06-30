import React from 'react';
import useMap from './useMap';


const Test = () => {
  const mapConfig = { center: [0,0] }
  const { map, popUp, mapContainerRef } = useMap({ mapConfig });


  React.useEffect(() => {
    if(!map) return;
    let geojson = {
      'type': 'FeatureCollection',
      'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[0, 0]]
          }
      }]
    };
    let speedFactor = 10; // number of frames per longitude degree
    let startTime = 0;
    let progress = 0; // progress = timestamp - startTime
    let resetTime = false; // indicator of whether time reset is needed for the animation
    
    map.addSource('line', {
      'type': 'geojson',
      'data': geojson
    });
    map.addLayer({
      'id': 'line-animation',
      'type': 'line',
      'source': 'line',
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#ed6498',
        'line-width': 5,
        'line-opacity': 0.8
      }
    });

    startTime = performance.now();
    animateLine();
    
    function animateLine(timestamp) {
      if (resetTime) {

        // resume previous progress
        startTime = performance.now() - progress;
        resetTime = false;

      } else {

        progress = timestamp - startTime;
        console.log(Math.round(progress), Math.round(timestamp), Math.round(startTime) )
      }
       
      // restart if it finishes a loop
      if (progress > speedFactor * 360) {

        startTime = timestamp;
        geojson.features[0].geometry.coordinates = [];

      } else {

        var x = progress / speedFactor;
        // draw a sine wave with some math.
        var y = Math.sin((x * Math.PI) / 90) * 40;
        // append new coordinates to the lineString
        geojson.features[0].geometry.coordinates.push([x, y]);
        // then update the map
        map.getSource('line').setData(geojson);

      }

      // Request the next frame of the animation.
      requestAnimationFrame(animateLine);
    }

  })


  return (
    <div ref={mapContainerRef} style={{width:'100%', height:'100vh', position:'absolute'}}/>
  )
}

export default Test;
