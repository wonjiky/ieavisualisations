import React from 'react';
import Papa from 'papaparse';
import Map from './Map_grid_webgl';
import axios from 'axios';

function WeatherByGrid(props) {
  const [data, setData] = React.useState(null);
  const [loaded, setLoading] = React.useState(false);
  const [viewState, setViewState] = React.useState({
    latitude: 30,
    longitude: 0,
    zoom: 1.7,
    minZoom: 1.8
  });
  const colorRange = [
    [255, 255, 178, 25],
    [254, 217, 118, 85],
    [254, 178, 76, 127],
    [253, 141, 60, 170],
    [240, 59, 32, 212],
    [189, 0, 38, 255]
  ];

  React.useEffect(() => {
    axios
      .get(`${props.baseURL}weather/grid/hdd.csv`)
      .then(response => {
        const fetchResult = Papa.parse(response.data, { header: false }).data;

        let result = [], matrix = [ ...fetchResult ], lon = matrix[0];
        for ( let col = 1; col < lon.length; col++ ) {
          for ( let row = 1; row < matrix.length-1; row ++ ) {
            result.push([
              parseFloat(lon[col]),
              parseFloat(matrix[row][0]),
              parseFloat(matrix[row][col])
            ])
          }
        }
        setData(result);
        setLoading(true);
      })
  },[])

  if ( loaded )  {
    return (
      <Map 
        data={data}
        viewState= {viewState}
        colorRange={colorRange}
        handleViewState={({ viewState }) => setViewState(viewState)}
        />
    )
  }else {
    return <div> Loadinig... </div>
  }
}

export default WeatherByGrid;
