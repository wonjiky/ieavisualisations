import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const CURRENT_PROJECT = "etpCoolingHeating";
const BUILD_TARGETS = [
  {
    project: "componentTest",
    path: "./component-test",
  },
  {
    project: "ccusRegionMapsUS",
    path: "./projects/ccus-region-maps/us",
  },
  {
    project: "ccusRegionMapsChina",
    path: "./projects/ccus-region-maps/china",
  },
  {
    project: "ccusRegionMapsEurope",
    path: "./projects/ccus-region-maps/europe",
  },
  {
    project: "ccusComboMap",
    path: "./projects/ccus-combo-map",
  },
  {
    project: "covidImpactElectricity",
    path: "./projects/covid-impact-electricty",
  },
  {
    project: "etpCoolingHeating",
    path: "./projects/etp-cooling-heating",
  },
  {
    project: "etpOwnershipBubble",
    path: "./projects/etp-ownership-bubble",
  },
  {
    project: "weatherForEnergy",
    path: "./projects/weather-for-energy",
  },
];

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD
    : process.env.REACT_APP_DEV;

const { path } = BUILD_TARGETS.find(
  ({ project }) => CURRENT_PROJECT === project
);

import(`${path}`).then(({ default: BuildTarget }) => {
  return ReactDOM.render(
    <React.StrictMode>
      <BuildTarget baseURL={BASE_URL} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
