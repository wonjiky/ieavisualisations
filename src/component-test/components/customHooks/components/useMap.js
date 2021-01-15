import React from "react";
import mapboxgl from "mapbox-gl";
import { oecd, mapBox, lineDashArray, centroids } from "./util/util";
import { addCentroids } from "./util/mapUtil";
import "mapbox-gl/dist/mapbox-gl.css";

const useMap = (config) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

  const [map, setMap] = React.useState(null);
  const [popUp, setPopUp] = React.useState(null);
  const mapContainerRef = React.useRef(null);
  const mapConfig = {
    style: config.style,
    center: config.center ? config.center : [0, 0],
    zoom: config.zoom ? config.zoom : 0,
    minZoom: config.minZoom ? config.minZoom : 0,
    maxZoom: config.maxZoom ? config.maxZoom : 22,
    maxBounds: config.maxBounds ? config.maxBounds : null,
  };

  const tooltip = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  React.useEffect(() => {
    const map = new mapboxgl.Map({
      ...mapConfig,
      container: mapContainerRef.current,
    });

    map.on("load", () => {
      setPopUp(tooltip);
      setMap(map);
      map.addControl(new mapboxgl.NavigationControl());

      if (config.map === "oecd") {
        addOecdBaseMap(map, oecd);
      } else if (config.map === "mapbox") {
        addDefaultBaseMap(map, mapBox);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addSources(map, sources, type) {
    for (let i in sources) {
      let source = sources[i];
      let id = type === "mapbox" ? `${source.id}-borders` : source.id;
      map.addSource(id, { type: "vector", url: source.url });
    }
  }

  function addOecdBaseMap(map, sources) {
    addSources(map, sources.sources);
    for (let i in sources.layers) {
      let layer = sources.layers[i];
      let shapes = layer.id === "shapes";
      let meta = !shapes ? { filter: layer.filter } : "";
      map.addLayer({
        id: `${layer.id}-layer`,
        source: layer.source,
        "source-layer": layer.sourceLayer,
        layout: layer.layout,
        type: shapes ? "fill" : "line",
        paint: layer.paint,
        ...meta,
      });
    }
    addCentroids(map, config, centroids);
  }

  function addDefaultBaseMap(map, sources) {
    addSources(map, sources.sources, "mapbox");
    for (let i in sources.layers) {
      let { paint } = config;
      let layer = sources.layers[i];
      let solid = layer.id === "solid";
      let dashed = !solid ? { "line-dasharray": lineDashArray } : "";
      let lineStyle = paint
        ? {
            "line-width": paint.lineWidth,
            "line-color": solid ? paint.lineColor : paint.dottedLineColor,
          }
        : { "line-width": 1, "line-color": solid ? "black" : "white" };

      map.addLayer({
        id: `dotted-${i}`,
        source: layer.source,
        "source-layer": layer.sourceLayer,
        type: "line",
        paint: {
          ...dashed,
          ...lineStyle,
        },
        filter: layer.filter,
        layout: layer.layout,
      });
    }
  }
  return { map, mapContainerRef, popUp };
};

export default useMap;
