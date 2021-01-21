import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
// import ComboMap from "./projects/ccus-combo-map";
// import WeatherForEnergy from "./projects/weather-for-energy";
// import HeatingCoolingDemands from './projects/heating-cooling-demands'
import { GtfVector, GtfAnimatedFlow } from "./projects/gas-trade-flow";
// import RegionsMap from './projects/ccus-region-maps'
// import Test from './component-test'
import classes from "./App.module.css";

export default function App() {

  const test = [{ id: "test", url: "/test", component: GtfAnimatedFlow }];
  const projecturl = "https://ieademoviz.azurewebsites.net/projects/";
  const prod = process.env.NODE_ENV === "production";
  const baseurl = prod ? process.env.REACT_APP_PROD : process.env.REACT_APP_DEV;

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={(_) => (
            <div className={classes.Wrapper}>
              <div>
                <header>IEA Demo Visualisations</header>
                <div>
                  <ul>
                    {!prod &&
                      test.map((project) => (
                        <li key={project.id}>
                          <Link to={project.url} style={{ color: "#04f" }}>
                            {project.id}
                          </Link>
                        </li>
                      ))}
                    {PROJECTS.map((project, idx) => (
                      <Item key={idx} {...project} baseurl={projecturl} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        />
        {test.map(({ id, url, component: C }) => (
          <Route
            exact
            key={id}
            path={url}
            render={(props) => <C {...props} baseURL={baseurl} />}
          />
        ))}
      </Switch>
    </Router>
  );
}

function Item({ project, status, url, baseurl }) {
  let styledClass =
    status === "pending"
      ? classes.pending
      : "done"
      ? classes.done
      : classes.progress;

  return (
    <li>
      <a className={styledClass} href={`${baseurl}${url}`}>
        {project}
      </a>
    </li>
  );
}

const PROJECTS = [
  {
    status: "done",
    project: "CCUS Combo Map",
    url: "ccus-combo-map",
  },
  {
    status: "done",
    project: "ETP Heating and Cooling Demands",
    url: "heating-cooling-demands",
  },
  {
    status: "done",
    project: "Weather for energy tracker",
    url: "weather-for-energy",
  },
  {
    status: "done",
    project: "CCUS Region Map - US",
    url: "ccus-regions-maps/us",
  },
  {
    status: "done",
    project: "CCUS Region Map - Europe",
    url: "ccus-regions-maps/europe",
  },
  {
    status: "done",
    project: "CCUS Region Map - China",
    url: "ccus-regions-maps/china",
  },
  {
    status: "pending",
    project: "GTF - Flow",
    url: "gas-trade-flow/animated",
  },
  {
    status: "pending",
    project: "GTF - Vector",
    url: "gas-trade-flow/vector",
  },
];
