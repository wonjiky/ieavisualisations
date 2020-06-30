import React, { useState } from 'react';
// import { PathLayer } from '@deck.gl/layers';
// import { TripsLayer } from '@deck.gl/geo-layers';
// import { MapboxLayer } from '@deck.gl/mapbox';
import FlowMapLayer from '@flowmap.gl/core';
import { Flowmap } from '../../components/flowmap';
// import FlowMap, {getViewStateForLocations} from '@flowmap.gl/react';
// import useAnimationFrame from './useAnimationFrame';
// import DeckGL from '@deck.gl/react';
// import {StaticMap} from 'react-map-gl';
// import axios from 'axios';

const Demo = () => {

    // useEffect(() => {
  //   const id = setInterval(() => {
  //     setCount(c => c + 1); // This effect depends on the `count` state
  //   }, 1000);

  //   return () => { 
  //     clearInterval(id);
  //   }
  // }, []); // 🔴 Bug: `count` is not specified as a dependency
  // console.log(count);

  // const [count, setCount] = React.useState(0);
  // const ref = React.useRef(count);

  // const [count, updateState] = useAsyncRef(0);

  // function updateState(newState) {
  //   ref.current = newState;
  //   setCount(newState);
  // }

  // function handleAlertClick() {
  //   setTimeout(() => {
  //     alert('Clicked ' + count.current + ' times')
  //   }, 3000)
  // }

  // const [ state, setState ] = useState(0);
  // const ref = React.useRef();

  // const animate = time => {
  //   setState(time);
    
  //   ref.current = requestAnimationFrame(animate);
  // }

  // useEffect(() => {
  //   ref.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(ref.current);
  // }, [])


  const [count, setCount] = useState(0);
  const requestTime = React.useRef();
  const prevTime = React.useRef();

  
  // function animate(time) {

  //   if( prevTime.current !== undefined ) {
      
      
  //     // const loopLength = 1800; // unit corresponds to the timestamp in source data
  //     // const animationSpeed = 20; // unit time per second
  //     // const timestamp = Date.now() / 1000;
  //     // const loopTime = loopLength / animationSpeed;

  //     // const delta = timestamp - prevTime.current;
  //     console.log(prevTime.current, requestTime.current)
  //     // setCount(c => ((timestamp % loopTime) / loopTime) * loopLength);
  //   }
  //   prevTime.current = time;
  //   requestTime.current = requestAnimationFrame(animate);
  // }

  // useEffect(() => {
  //   requestTime.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(animate);
  // }, [])
  // useEffect(() => {
  //   setInterval(function() {
  //     setCount(c => c + 1)
  //   }, 1000/60);
  // }, [])
  
  // console.log(count/100);


  const flowMap = new FlowMapLayer ({
    id: 'my-flowmap-layer',
    locations:
    // either array of location areas or a GeoJSON feature collection
    [{ id: 1, name: 'New York', lat: 40.713543, lon: -74.011219 }, 
     { id: 2, name: 'London', lat: 51.507425, lon: -0.127738 }, 
     { id: 3, name: 'Rio de Janeiro', lat: -22.906241, lon: -43.180244 }],
  flows: 
    [{ origin: 1, dest: 2, count: 42 },
     { origin: 2, dest: 1, count: 51 },
     { origin: 3, dest: 1, count: 50 },
     { origin: 2, dest: 3, count: 40 },
     { origin: 1, dest: 3, count: 10 },
     { origin: 3, dest: 2, count: 42 }],
    animate: true,
    animationCurrentTime: count/100,
    getFlowMagnitude: (flow) => flow.count || 0,
    getFlowOriginId: (flow) => flow.origin,
    getFlowDestId: (flow) => flow.dest,
    getLocationId: (loc) => loc.id,
    getLocationCentroid: (location) => [location.lon, location.lat],
  });

  const flows =  [
    { origin: 1, dest: 2, count: 50, color: 'red' },
    { origin: 2, dest: 1, count: 15, color: 'red' },
    { origin: 3, dest: 1, count: 50, color: 'red'},
    { origin: 3, dest: 1, count: 50, color: 'green'},
    { origin: 1, dest: 3, count: 10, color: 'yellow' },
    { origin: 2, dest: 3, count: 30, color: 'red',},
    { origin: 3, dest: 2, count: 42, color: 'yellow' }
  ];

  const locations = [
    { id: 1, name: 'New York', lat: 40.713543, lon: -74.011219 }, 
    { id: 2, name: 'London', lat: 51.507425, lon: -0.127738 }, 
    { id: 3, name: 'Rio de Janeiro', lat: -22.906241, lon: -43.180244 } 
  ];

  const INITIAL_VIEW_STATE = {
    longitude: -30,
    latitude: 0,
    zoom: 2.3,
  };

  return (
    <Flowmap
      ID='flow-map-test'
      flows={flows}
      locations={locations}
      initialViewState={INITIAL_VIEW_STATE}
      animate={true}
    />
    // <DeckGL
    //   layers={[flowMap]}
    //   initialViewState={INITIAL_VIEW_STATE}
    //   controller={true}
    // >
    // {/* <Flowmap
    //   ID='flow-map-test'
    //   flows={flows}
    //   locations={locations}
    //   initialViewState={INITIAL_VIEW_STATE}
    //   animate={false}
    // > */}
    //   <StaticMap
    //     width={'100%'}
    //     height={'100vh'}
    //     latitude={30}
    //     longitude={30}
    //     zoom={2}
    //     mapStyle={"mapbox://styles/iea/ck9jt8mxx028m1ip9gih9yod6"}
    //     preventStyleDiffing={true}
    //     mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
    //   />
    // {/* </Flowmap> */}
    // </DeckGL>
  )
}

export default Demo;

function useAsyncRef(value) {
  const ref = React.useRef(value);
  const [, forceRender] = useState(false);
  
  function updateState(newState) {
    ref.current = newState;
    forceRender(c => !c);
  }

  return [ref, updateState];
}



    // <DeckGL
    //   layers={[flowMap]}
    //   initialViewState={INITIAL_VIEW_STATE}
    //   controller={true}
    // >

    // <Flowmap
    //   ID='flow-map-test'
    //   flows={flows}
    //   locations={locations}
    //   initialViewState={INITIAL_VIEW_STATE}
    //   animate={false}
    // >
      // {/* <StaticMap
      //   width={'100%'}
      //   height={'100vh'}
      //   latitude={30}
      //   longitude={30}
      //   zoom={2}
      //   mapStyle={"mapbox://styles/iea/ck9jt8mxx028m1ip9gih9yod6"}
      //   preventStyleDiffing={true}
      //   mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      // /> */}
    // </Flowmap>
    
    // </DeckGL>
    // <div>
    //   <p>Time: {count.current}</p>
    //   <button
    //     onClick={() => {
    //       setCount(count.current + 1);
    //     }}
    //   > 
    //   Cick me
    //   </button>
    //   {/* <Alert count={count.current} /> */}
    //   <button onClick={handleAlertClick}>Show alert</button>
    // </div>
    



function useAsyncReference(value) {
  const ref = React.useRef(value);
  const [, forceRender] = useState(false);

  function updateState(newState) {
    ref.current = newState;
    forceRender(s => !s);
  }

  return [ref, updateState];
}

const Alert = ({ count }) => {
  const asyncCount = useAsyncReference(count, true);

  function handleAlertClick() {
    setTimeout(() => {
      alert("You clicked on: " + asyncCount.current);
    }, 3000);
  }

  return <button onClick={handleAlertClick}>Show alert</button>
}