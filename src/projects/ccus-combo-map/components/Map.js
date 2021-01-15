import React, { useEffect } from "react";
import { Map } from "@iea/react-components";
import { useMap } from "../../../component-test/components/customHooks";

const MapContainer = ({ data, project, click }) => {
  const config = {
    map: "custom",
    style: "mapbox://styles/iea/ck9mv6pv834351ipiu0p02w80",
    center: [0, 30],
    minZoom: 1.3,
  };

  const { map, mapContainerRef, popUp } = useMap(config);
  useEffect(() => {
    const hasProject = Object.keys(project).length > 0;
    if (hasProject || !map) return;
    map.flyTo({ center: [0, 30], zoom: 1.3 });
  }, [map, project]);

  useEffect(() => {
    if (!map) return;
    map.addSource("projects", data).addLayer({
      id: "projects-layer",
      type: "circle",
      source: "projects",
      paint: {
        "circle-stroke-color": "#000",
        "circle-stroke-width": 1,
        "circle-radius": 7,
        "circle-color": [
          "match",
          ["get", "sectorType"],
          "Industry/Fuel transformation",
          "#3e7ad3",
          "#00ada1",
        ],
      },
    });

    return () => {
      map.removeLayer("projects-layer").removeSource("projects");
    };
  }, [map, data]);

  useEffect(() => {
    let hasProject = Object.keys(project).length > 0;
    const normalize = (val, max, min) => (val - min) / (max - min);
    if (!map || !hasProject) return;
    let size = Math.round(100 + normalize(project.radius, 9, 0.5) * 100);
    let borderPointsBuffer = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      // called once before every frame where the icon will be used
      render() {
        let duration = 1000;
        let t = (performance.now() % duration) / duration;
        let outerRadius = size / 2 - (size / 2) * t;
        let ctx = this.context;
        // draw outer circle
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle =
          project.sectorType === "Power"
            ? "rgba(0,173,161," + (0 + t * 0.5) + ")"
            : "rgba(62,122,211," + (0 + t * 0.5) + ")";
        ctx.fill();

        // update this image's data with data from the canvas
        this.data = ctx.getImageData(0, 0, this.width, this.height).data;
        map.triggerRepaint();
        return true;
      },
    };
    let borderpoints = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [project.lon, project.lat],
            },
          },
        ],
      },
    };
    map // Add images for border points buffer
      .addSource("border-points", borderpoints)
      .addImage("borderPointsBuffer", borderPointsBuffer, { pixelRatio: 2 });
    map
      .addLayer({
        id: "border-point",
        type: "circle",
        source: "border-points",
        paint: {
          "circle-radius": 4,
          "circle-color":
            project.sectorType === "Power" ? "#00ada1" : "#3e7ad3",
        },
      })
      .addLayer({
        id: "border-point-buffers",
        type: "symbol",
        source: "border-points",
        layout: {
          "icon-image": "borderPointsBuffer",
          "icon-size": 2,
          "icon-allow-overlap": true,
        },
      });

    return () => {
      map.removeLayer("border-point-buffers");
      map.removeLayer("border-point");
      map.removeImage("borderPointsBuffer");
      map.removeSource("border-points");
    };
  }, [map, project]);

  useEffect(() => {
    if (!map) return;
    map
      .on("click", `projects-layer`, mouseClick)
      .on("mouseenter", `projects-layer`, mouseOver)
      .on("mouseleave", `projects-layer`, mouseLeave);
    return () => {
      map
        .off("click", `projects-layer`, mouseClick)
        .off("mouseenter", `projects-layer`, mouseOver)
        .off("mouseleave", `projects-layer`, mouseLeave);
    };
  });

  function mouseClick(e) {
    let selected = e.features[0].properties;
    click(e);
    map.flyTo({
      center: [selected.lon - 0.6, selected.lat],
      zoom: 8,
    });
  }

  function mouseOver(e) {
    let selected = e.features[0].properties;
    let mousePos = [selected.lon, selected.lat];
    let value = getPopupInfo(selected);
    map.getCanvas().style.cursor = "pointer";
    popUp.setLngLat(mousePos).setHTML(value).addTo(map);
  }

  function mouseLeave() {
    map.getCanvas().style.cursor = "";
    popUp.remove();
  }

  function getPopupInfo(value) {
    return `<b>${value.facility}</b><br/>${value.country}`;
  }

  // return <div ref={mapContainerRef} className='map' />
  return <Map mapRef={mapContainerRef} />;
};

export default MapContainer;
