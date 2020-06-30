import React from 'react';
import MapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ScreenGridLayer} from '@deck.gl/aggregation-layers';
import {isWebGL2} from '@luma.gl/core';



function WeatherByGrid({ data, viewState,  handleViewState, colorRange }) {
  
  const _renderLayer = new ScreenGridLayer({
      id: 'grid',
      data: data,
      opacity: 0.8,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      colorRange,
      cellSizePixels: 20,
      gpuAggregation: true,
      aggregation: 'SUM'
    });
  
  function _onInitialized(gl) {
    if (!isWebGL2(gl)) {
      if (this.props.disableGPUAggregation) {
        this.props.disableGPUAggregation();
      }
    }
  }
  return (
    <DeckGL
      layers={_renderLayer} 
      initialViewState={viewState} 
      controller={true}
      onWebGLInitialized={() => _onInitialized()}
    >
      <MapGL 
        width='100vw' 
        height='100vh' 
        viewState={viewState} 
        onViewStateChange={handleViewState}
				mapStyle="mapbox://styles/iea/ckas69pof1o2c1ioys10kqej6"
			/>
		</DeckGL>
      
  )
}

export default WeatherByGrid;
