import React from 'react';
import MapGL from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import FlowMapLayer, {PickingType} from '@flowmap.gl/core';

export default function Map({ width, height, viewState, colors, onViewStateChange, data }) {
	
	const [time, setTime] = React.useState(0);
	const [highlight, setHighlight] = React.useState(undefined);
	const [selectedCountry, setSelectedCountry] = React.useState({x: undefined, y: undefined, object: undefined, type: undefined});

	const animationFrames = React.useRef(0);
	const HighlightType = {
		LOCATION_AREA: 'location-area',
		LOCATION: 'location',
		FLOW: 'flow',
	}
	const getLocationId = loc  => loc.properties.name;

	const  animate = React.useCallback(() =>{
    const loopLength = 1800; 
    const animationSpeed = 20;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;
    setTime(((timestamp % loopTime) / loopTime) * loopLength);
		animationFrames.current = window.requestAnimationFrame(animate);
	}, []) 

	

	React.useEffect(() => {
		animate();
		return () => {
			if(animationFrames.current) window.cancelAnimationFrame(animationFrames.current);
		}
  }, [animate])
	

	const layers=[
		new FlowMapLayer ({
			id: 'my-flowmap-layer',
			locations: data.locations,
			flows: data.flows,
			colors: colors,
			pickable: true,
			animate: true,
			animationCurrentTime: time,
			getFlowMagnitude: flow => flow.total || 0,
			getFlowOriginId: flow => flow.entry,
			getFlowDestId: flow => flow.exit,
			getLocationId: loc =>  loc.properties.name,
			getLocationCentroid: loc => [loc.properties.centroid[0], loc.properties.centroid[1]],
			// showLocationAreas: false,
			// maxLocationCircleSize:3,
			highlightedFlow: highlight && highlight.type === HighlightType.FLOW ? highlight.flow : undefined,
			highlightedLocationId: highlight && highlight.type === HighlightType.LOCATION ? highlight.locationId : undefined,
      highlightedLocationAreaId: highlight && highlight.type === HighlightType.LOCATION_AREA ? highlight.locationId : undefined,
			onHover: e => handleFlowMapHover(e),
			// getFlowColor: e => console.log(e)
		})
	];

	function handleFlowMapHover(info){
		const {object, type, x , y} = info;
		let test = null;
		switch(type) {
			case PickingType.FLOW: {
				if ( !object ) {
					selectHighLight(undefined);
					_onHover(undefined, undefined, undefined, undefined);
				} else {
					_onHover(x, y, object, type);
					selectHighLight({ type: PickingType.FLOW, flow: object });
				}
				break;
			}
			case PickingType.LOCATION_AREA:
      case PickingType.LOCATION: {
        if (!object) {
					selectHighLight(undefined);
					_onHover(undefined, undefined, undefined, undefined);
        } else {
					_onHover(x, y, object, type);
          selectHighLight(
            {
              type: type === PickingType.LOCATION_AREA ? PickingType.LOCATION_AREA : PickingType.LOCATION,
              locationId: (getLocationId || FlowMapLayer.defaultProps.getLocationId.value)(object),
            }
          );
        }
        break;
      }
			default: 
				test = null;
		}
	}

	const selectHighLight = selected => setHighlight(selected);

	function _onHover( x, y, object, type) {
		setSelectedCountry({x: x, y: y, object: object, type: type})
	}

	const  _renderTooltip = _ => {
		let { x, y, object, type } = selectedCountry;
		if( object ) {
			if (type === PickingType.LOCATION_AREA || type === PickingType.LOCATION ) {
				return (
					<div style={{position: 'absolute', background: 'white', padding: '20px', zIndex: 1000, pointerEvents: 'none', left: x, top: y}}>
						{object.properties.name}
					</div>
				);
			} else {
				return (
					<div style={{position: 'absolute', background: 'white', padding: '20px', zIndex: 1000, pointerEvents: 'none', left: x, top: y}}>
						<p>exit: {object.exit}</p>
						<p>entry: {object.entry}</p>
						<p>value: {object.total}</p>
					</div>
				);
			}
		} else {
			return;
		}
	}

	return (
		<DeckGL initialViewState={viewState} layers={layers} controller={true}>
			<MapGL width={width} height={height} 
				viewState={viewState} onViewStateChange={onViewStateChange}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
				mapStyle="mapbox://styles/iea/ckas69pof1o2c1ioys10kqej6"
			/>
			{_renderTooltip}
		</DeckGL>
	);
}

