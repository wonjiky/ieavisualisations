import React from 'react'
import { useGridMap } from '../../components/customHooks';


function WeatherByGrid_Vector() {
  const mapConfig = {
    center: [0.729,15.359],
    minZoom: 2.2,
    maxZoom: 4
  } 

  // const layers = [
  //   {
  //     url: "mapbox://iea.cq9ld9rb", sourceLayer: "hdd_5_1-3cbp61"
  //   },
  //   {
  //     url: "mapbox://iea.598u8h3j", sourceLayer: "hdd_5_2-9oom4t"
  //   },
  //   {
  //     url: "mapbox://iea.9jr49vhf", sourceLayer: "hdd_5_3-dgyhg6"
  //   },
  //   {
  //     url: "mapbox://iea.2hb1cigo", sourceLayer: "hdd_5_4-5ug53j"
  //   },
  //   {
  //     url: "mapbox://iea.a6my9de2", sourceLayer: "hdd_5_5-cjeb0p"
  //   }
  // ]

  const layers = [
    {
      url: "mapbox://iea.d6izs89k", sourceLayer: "cdd_2017_1-2ypx3e"
    },
    {
      url: "mapbox://iea.2b75s7nz", sourceLayer: "cdd_2017_2-ddjf7o"
    },
    {
      url: "mapbox://iea.cd4625ge", sourceLayer: "cdd_2017_3-075670"
    },
    {
      url: "mapbox://iea.1mzizpco", sourceLayer: "cdd_2017_4-8xhibu"
    },
    {
      url: "mapbox://iea.0i0hflce", sourceLayer: "cdd_2017_5-bxvei3"
    },
    {
      url: "mapbox://iea.dmyeomtk", sourceLayer: "cdd_2017_6-4m6ide"
    },
    {
      url: "mapbox://iea.b1wwzme6", sourceLayer: "cdd_2017_7-5bbykg"
    },
    {
      url: "mapbox://iea.690j8c8g", sourceLayer: "cdd_2017_8-84oyrv"
    },
    {
      url: "mapbox://iea.9pm1n9dg", sourceLayer: "cdd_2017_9-9ignnc"
    },
    {
      url: "mapbox://iea.6756nlv0", sourceLayer: "cdd_2017_10-a88atc"
    },
    {
      url: "mapbox://iea.67qvjii8", sourceLayer: "cdd_2017_11-6p6fcp"
    },
    {
      url: "mapbox://iea.1v4w4oy0", sourceLayer: "cdd_2017_12-6y4lqc"
    },
    {
      url: "mapbox://iea.4fbtbr0x", sourceLayer: "cdd_2017_13-941iff"
    },
    {
      url: "mapbox://iea.3d6z0a2h", sourceLayer: "cdd_2017_14-0067ab"
    },
    {
      url: "mapbox://iea.doj2ihua", sourceLayer: "cdd_2017_15-cga2lw"
    },
    {
      url: "mapbox://iea.0irssdng", sourceLayer: "cdd_2017_16-0zrsmz"
    },
    {
      url: "mapbox://iea.doejy02e", sourceLayer: "cdd_2017_17-4qsbca"
    },
    {
      url: "mapbox://iea.5k9koozn", sourceLayer: "cdd_2017_18-1log0w"
    },
    {
      url: "mapbox://iea.8v1qbefn", sourceLayer: "cdd_2017_19-2wcbj7"
    },
    {
      url: "mapbox://iea.c73neihk", sourceLayer: "cdd_2017_20-a2m9ne"
    }
  ];

  const { map, popUp, mapContainerRef } = useGridMap({ mapConfig, layers });
  
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
  return <div ref={mapContainerRef} className='map'/>
}

export default WeatherByGrid_Vector
