import React from "react";
import mapboxgl from "mapbox-gl";
import { oecd, mapBox, lineDashArray, centroids } from "./util/util";
import "mapbox-gl/dist/mapbox-gl.css";

export default (config) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

  const [map, setMap] = React.useState(null);
  const [popUp, setPopUp] = React.useState(null);
  const mapContainerRef = React.useRef(null);

  const mapType =
    config.map === "oecd"
      ? fetchOecdMap
      : config.map === "custom"
      ? fetchCustomMap
      : createDefaultMap;

  const tooltip = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  const mapConfig = {
    container: mapContainerRef.current,
    style: config.style,
    center: config.center ? config.center : [0, 0],
    zoom: config.zoom ? config.zoom : 0,
    minZoom: config.minZoom ? config.minZoom : 0,
    maxZoom: config.maxZoom ? config.maxZoom : 22,
    maxBounds: config.maxBounds ? config.maxBounds : null,
  };

  React.useEffect(mapType, []);

  function addCentroids(map) {
    if (!config.centroids) return;
    const { layers, sources } = centroids;
    map
      .addSource("centroids", { type: "vector", url: sources.url })
      .addLayer({
        id: layers.id,
        source: layers.source,
        "source-layer": layers.sourceLayer,
        type: "circle",
      })
      .addLayer({
        id: "label-layer",
        source: layers.source,
        "source-layer": layers.sourceLayer,
        type: "symbol",
      });
  }

  function fetchOecdMap() {
    const map = new mapboxgl.Map({
      ...mapConfig,
      container: mapContainerRef.current,
    });

    map.on("load", () => {
      setPopUp(tooltip);
      setMap(map);
      map.addControl(new mapboxgl.NavigationControl());

      for (let i in oecd.sources) {
        let source = oecd.sources[i];
        map.addSource(source.id, { type: "vector", url: source.url });
      }

      for (let i in oecd.layers) {
        let layer = oecd.layers[i];
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
      addCentroids(map);
    });
  }

  function createDefaultMap() {
    const map = new mapboxgl.Map({
      ...mapConfig,
      container: mapContainerRef.current,
    });

    map.on("load", () => {
      setPopUp(tooltip);
      setMap(map);
      map.addControl(new mapboxgl.NavigationControl());

      for (let i in mapBox.sources) {
        let source = mapBox.sources[i];
        map.addSource(`${source.id}-borders`, {
          type: "vector",
          url: source.url,
        });
      }

      for (let i in mapBox.layers) {
        let { paint } = config;
        let layer = mapBox.layers[i];
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
      // addCentroids(map);
    });
  }

  function fetchCustomMap() {
    const map = new mapboxgl.Map({
      ...mapConfig,
      container: mapContainerRef.current,
    });
    map.on("load", () => {
      setPopUp(tooltip);
      setMap(map);
      map.addControl(new mapboxgl.NavigationControl());
    });
  }

  return { map, mapContainerRef, popUp };
};
