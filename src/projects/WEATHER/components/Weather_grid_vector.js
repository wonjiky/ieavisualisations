import React from 'react'
import { useMap } from '../../../components/customHooks';

function WeatherByGrid_Vector() {

  const config = {
    map: 'oecd',
    style: "mapbox://styles/iea/ckdh6yknk0x0g1imq28egpctx",
    center: [0.729,15.359],
		minZoom: 1.3,
    maxZoom: 3,
    maxBounds: [
      [-180, -70],
      [180, 84],
    ],
  }


  const layers=  [
    {
      url: "mapbox://iea.cq9ld9rb", sourceLayer: "hdd_5_1-3cbp61"
    },
    {
      url: "mapbox://iea.598u8h3j", sourceLayer: "hdd_5_2-9oom4t"
    },
    {
      url: "mapbox://iea.9jr49vhf", sourceLayer: "hdd_5_3-dgyhg6"
    },
    {
      url: "mapbox://iea.2hb1cigo", sourceLayer: "hdd_5_4-5ug53j"
    },
    {
      url: "mapbox://iea.a6my9de2", sourceLayer: "hdd_5_5-cjeb0p"
    }
  ]

  const { map, mapContainerRef, popUp } = useMap(config);
  
  React.useEffect(() => {
    if (!map) return;
    map.setLayoutProperty('shapes-0', 'visibility', 'none');
    let borders = ['solid', 'dotted']
		for ( let i in borders){
			let idx = parseInt(i) + 1;
			map
				.setPaintProperty( `${borders[i]}-${idx}`, "line-color", '#404040')
				.setPaintProperty( `${borders[i]}-${idx}`, "line-width", [
					'interpolate',
					['exponential', 0.5],
					['zoom'],
					config.minZoom, 0.3,
					config.maxZoom, 0.4
				]);
    }
  }, [map])
  
  React.useEffect(() => {
    if (!map) return;
    for ( let i in layers ) {
      map.addSource(`hdd-grid-${i}`, { type: "vector", url: layers[i].url });
    }

    for ( let i in layers) {
      map.addLayer({
        'id': `hdd-${i}`,
        'source': `hdd-grid-${i}`,
        'type': 'circle',
        'source-layer': layers[i].sourceLayer,
        'paint': {
          'circle-radius': [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            config.minZoom, 1.8,
            config.maxZoom, 2.6
          ],
          'circle-opacity': .8,
          'circle-color': [
            "step",
            ["get", "val"],
            "hsla(0, 0%, 8%, 0.5)",
            0,
            "#d53e4f",
            100,
            "#f46d43",
            300,
            "#fdae61",
            600,
            "#fee08b",
            1000,
            "#ffffbf",
            1400,
            "#e6f598",
            1600,
            "#abdda4",
            1800,
            "#66c2a5",
            2300,
            "#3288bd"
          ]
        }
      }, 'shapes-0')
    }
  }, [map])



  React.useEffect(() => {
    if(!map) return;
    for ( let i in layers ) {
      map
        .on('mousemove', `hdd-${i}`, function(e) {
          map.getCanvas().style.cursor = 'pointer';
          let mousePos = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - mousePos[0]) > 180) {
              mousePos[0] += e.lngLat.lng > mousePos[0] ? 360 : -360;
          }
          let val = parseFloat(e.features[0].properties.val.toFixed(2))
          popUp
            .setLngLat(mousePos)
            .setHTML(val)
            .addTo(map);
        })
        .on('mouseleave', `hdd-${i}`, function() {
          map.getCanvas().style.cursor = '';
          popUp.remove();
        })
    }
  })

  
  return <div className='container'><div ref={mapContainerRef} className='map'/></div>
}

export default WeatherByGrid_Vector
