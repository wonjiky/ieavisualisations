import React from 'react'
import { DeckGL } from '@deck.gl/react';
import FlowMapLayer from '@flowmap.gl/core';

export default ({ children, ...props }) => {
  
  const [time, setTime] = React.useState(0);
  
  // React.useEffect(() => {
  //   // if(!props.animate) return;
  //   timer();
  // }, [])

  // const animationFrame = -1;

  // function timer() {
  //   const loopLength = 1800; // unit corresponds to the timestamp in source data
  //   const animationSpeed = 60; // unit time per second
  //   const timestamp = Date.now() / 1000;
  //   const loopTime = loopLength / animationSpeed;

  //   // setTime(((timestamp % loopTime) / loopTime) * loopLength);
  //   setTime((timestamp%30)* 30);
  //   // setTime(timestamp);
  //   // console.log(timestamp % loopTime, (timestamp % loopTime) / loopTime,((timestamp % loopTime) / loopTime) * 10, time)
  //   window.requestAnimationFrame(timer);
  // };

  React.useEffect(() => {
    setInterval(function() {
      setTime(time + .2)
    }, 1000/600);
  }, [])
  
  // console.log(count / 10);

  const INITIAL_VIEW_STATE = {
    longitude: -30,
    latitude: 0,
    zoom: 2.3,
  };
  
  function getFlowMapLayer() {
    const { flows, animate, locations } = props;
    return new FlowMapLayer({
      id: 'flow-map-test',
      locations: locations,
      flows: flows,
      animate: animate,
      animationCurrentTime: time,
      getFlowMagnitude: (flow) => flow.count,
      getFlowOriginId: (flow) => flow.origin,
      getFlowDestId: (flow) => flow.dest,
      getLocationId: (loc) => loc.id,
      getFlowColor: flow => flow.color,
      getLocationCentroid: (location) => [location.lon, location.lat],
    });
  }

  // const { initialViewState } = props;
  const flowMapLayer = getFlowMapLayer();
  console.log(props.viewState);
  // if ( !children.ref.current ) return <div></div>
  return (
    <DeckGL
      // layers={[flowMapLayer]}
      viewState={props.viewState}
      controller={true}
    >
      {children}
      {/* <StaticMap
        width={'100%'}
        height={'100vh'}
        latitude={30}
        longitude={30}
        zoom={2}
        mapStyle={"mapbox://styles/iea/ck9jt8mxx028m1ip9gih9yod6"}
        preventStyleDiffing={true}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      /> */}
    </DeckGL>
  )
}



// import React, { Component } from 'react'
// import { DeckGL } from '@deck.gl/react';
// import FlowMapLayer from '@flowmap.gl/core';

// export default class Flowmap extends Component {
  
//   state = {
//     time: 5,
//   }

//   componentDidMount() {
//     const { animate } = this.props;
//     if (animate) {
//       this.animate();
//     }
//   }

//   animationFrame = -1;

//   animate = () => {
//     const loopLength = 1800; // unit corresponds to the timestamp in source data
//     const animationSpeed = 30; // unit time per second
//     const timestamp = Date.now() / 1000;
//     const loopTime = loopLength / animationSpeed;

//     this.setState({time: ((timestamp % loopTime) / loopTime) * loopLength });
//     window.requestAnimationFrame(this.animate);
//   };

//   getFlowMapLayer() {
//     const {
//       ID,
//       animate,
//       locations,
//       flows,
//     } = this.props;

//     return new FlowMapLayer({
//       id: ID,
//       locations: locations,
//       flows: flows,
//       animate: animate,
//       colors:{
//         darkMode:true,
//         flows: 'yellow',
//         locationCircles: 'red',
//         outlineColor: '#000'
//       },
//       animationCurrentTime: this.state.time,
//       getFlowMagnitude: (flow) => flow.count,
//       getFlowOriginId: (flow) => flow.origin,
//       getFlowDestId: (flow) => flow.dest,
//       // getLocationId: (loc) => loc.id,
//       // getFlowColor: flow => console.log(flow)|| flow.color,
//       getLocationCentroid: (location) => [location.lon, location.lat],
//     });
//   }

//   render() {
//     const {
//       initialViewState
//     } = this.props;
    
//     const flowMapLayer = this.getFlowMapLayer();
//     return (
//       <DeckGL
//         layers={[flowMapLayer]}
//         viewState={initialViewState}
//         controller={true}
//       >
//         {this.props.children}
//       </DeckGL>
//     )
//   }
// }
