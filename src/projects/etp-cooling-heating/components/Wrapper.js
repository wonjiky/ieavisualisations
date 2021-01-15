import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Papa from "papaparse";
import CDD from "./CDD";
import variables from "../assets/variables.json";
import {
  MapContainer,
  ControlWrapper,
  ControlContainer,
  Icon,
  Modal,
  Legend,
  Controls,
  SimpleBarChart,
} from "@iea/react-components";

import {
  legend,
  heatpumpDataMap,
  serviceDataMap,
  getCountryNameByISO,
} from "../assets/util";

import classes from "./css/ETP.module.css";

function CDDWrapper({ baseURL }) {
  const {
    mapTypes,
    years,
    maps,
    serviceNeeds,
    scenarios,
    regions,
    serviceNeedsImages,
    table,
  } = variables;
  const [active, setActive] = useState({ open: false, target: null });
  const [mapType, setMapType] = useState(Object.keys(mapTypes)[0]);
  const [year, setYear] = useState(years[0]);
  const [indicators, setIndicators] = useState(null);
  const [heatpumpData, setHeatpumpData] = useState([]);
  const [country, setCountry] = useState(null);
  const [scenario, setScenario] = useState(scenarios.steps);
  const [region, setRegion] = useState("World");
  const [map, setMap] = useState(Object.keys(maps)[0]);
  const [openModal, setOpenModal] = useState(false);

  const DEFAULT_SERVICE_NEED = { cooling: 0, heating: 0, both: 1 };
  const [serviceNeed, setServiceNeed] = React.useState(
    serviceNeeds[map][DEFAULT_SERVICE_NEED[map]]
  );

  const isService = mapType === "service";
  const byMapType = {
    service: {
      filter: serviceDataFilter,
      map: serviceDataMap,
    },
    heatpump: {
      filter: heatpumpDataFilter,
      map: heatpumpDataMap,
    },
  };

  const tempOverlay = serviceNeedsImages[map].filter(
    (d) => d.option === serviceNeed
  )[0].value;

  const mainType =
    map === "cooling" ? "CDD" : map === "heating" ? "HDD" : "both";
  const mainUrl = `${mainType}_${year}${year === 2019 ? "" : "_" + scenario}`;
  const currMain = `${baseURL}etp/CDD/png/main/${mainUrl}`;

  const coolingOrTemp = tempOverlay.substring(0, 3) === "Hot";
  const overlayUrl =
    map === "cooling"
      ? `${map}/${coolingOrTemp ? "Temperature" : "CDD10"}_${year}_${
          year === 2019 ? "" : (scenario === "SDS" ? 26 : 45) + "_"
        }Masked_${tempOverlay}`
      : map === "heating"
      ? `${map}/HDD18_${year}_${
          year === 2019 ? "" : (scenario === "SDS" ? 26 : 45) + "_"
        }Masked_${tempOverlay}`
      : `${map}/both_${year}_${
          year === 2019 ? "" : scenario + "_"
        }${tempOverlay}`;
  const currOverlay = `${baseURL}etp/CDD/png/${overlayUrl}`;

  const tempIndicators = indicators ? [...indicators] : [];
  const currIndicator = tempIndicators
    .filter(byMapType[mapType].filter)
    .map(byMapType[mapType].map);
  const currHeatpumpData = heatpumpData.map(mapHeatpumpData);

  const controls = [
    {
      type: "button",
      options: Object.keys(mapTypes).map((item) => ({
        label: mapTypes[item],
        value: item,
      })),
      selected: mapType,
      flow: "row",
      click: (e) => setMapType(e.value),
    },
    {
      type: "button",
      options: years,
      selected: year,
      flow: "row",
      click: (value) => setYear(value),
    },
    {
      type: "button",
      options: Object.values(scenarios),
      selected: scenario,
      flow: "row",
      click: (value) => setScenario(value),
    },
    {
      type: isService && "radio",
      options: Object.keys(maps).map((item) => ({
        label: maps[item],
        value: item,
      })),
      flow: "column",
      selected: map,
      change: (value) => {
        setMap(value);
        setServiceNeed(serviceNeeds[value][DEFAULT_SERVICE_NEED[value]]);
      },
    },
    {
      type: isService && "dropdown",
      label: "Type of service needs",
      options: serviceNeeds[map],
      selected: serviceNeed,
      active: active,
      open: (e) => setActive({ open: true, target: e.target.value }),
      click: (value) => setServiceNeed(value),
    },
    {
      type: isService && "divider",
      marginBottom: "15px",
    },
  ];

  let regionDropdown = [
    {
      type: isService && "dropdown",
      label: "Regions",
      options: regions,
      top: true,
      click: (value) => setRegion(value),
      style: "horizontal",
      open: (e) => open(e),
      hide: (e) => hide(e),
      active: active,
      selected: region,
    },
  ];

  let legends = [
    {
      type: "continuous",
      header:
        mapType === "service"
          ? map === "cooling"
            ? "CDD18 (°C days)"
            : map === "heating"
            ? "HDD18 (°C days)"
            : "Average yearly T (°C)"
          : "CO2 savings - Heat pumps VS gas (%)",
      subInHeader: false,
      labels:
        mapType === "service" ? legend[mapType][map].minmax : [-100, 0, 100],
      colors:
        mapType === "service"
          ? legend[mapType][map].color
          : legend.heatpump.color,
      round: false,
    },
  ];

  const open = (e) => setActive({ open: true, target: e.target.value });

  const hide = useCallback(() => {
    setActive({ open: false, target: null });
    document.removeEventListener("click", hide);
  }, []);

  useEffect(() => {
    if (!active.open) return;
    document.addEventListener("click", hide);
  }, [active.open, hide]);

  useEffect(() => {
    let url = mapType === "service" ? variables.maps[map] : "Heat pump index";
    axios.get(`${baseURL}etp/CDD/${url}.csv`).then((response) => {
      const tempData = Papa.parse(response.data, { header: true }).data;
      let result = [...tempData];
      if (url === "Heat pump index") {
        result = result
          .filter((d) => getCountryNameByISO(d.ISO))
          .map((d) => ({ ...d, title: getCountryNameByISO(d.ISO).region }));
      }
      setIndicators(result);
    });
  }, [baseURL, map, mapType]);

  function fetchHeatpumpData() {
    axios.get(`${baseURL}etp/CDD/Heat pump index map.csv`).then((response) => {
      const tempData = Papa.parse(response.data, { header: true }).data;
      const filteredData = tempData.filter((d) => getCountryNameByISO(d.Code));
      setHeatpumpData(filteredData);
    });
  }

  useEffect(fetchHeatpumpData, [baseURL]);

  function serviceDataFilter(d) {
    let is2019 = d.region === region && d.scenario === "0";
    let isNot2019 =
      d.region === region && d.scenario === scenario && Number(d.year) === year;
    return year === 2019 ? is2019 : isNot2019;
  }

  function heatpumpDataFilter(d) {
    let is2019 = d.ISO === country && d.scenario === "0";
    let isNot2019 =
      d.ISO === country && d.scenario === scenario && Number(d.year) === year;
    return year === 2019 ? is2019 : isNot2019;
  }

  function mapHeatpumpData(d) {
    let result = { ISO: d.Code };
    year === 2019
      ? (result.value = Number(d[2019]) * -1)
      : (result.value = Number(d[`${year}-${scenario}`]) * -1);
    return result;
  }
  const barTitle = "Share of population (%)";
  const popup = [
    {
      type: "floatingButtons",
      click: (_) => setOpenModal(!openModal),
    },
  ];

  return (
    <MapContainer
      fluid
      disclaimer
      selector="CDD"
      loaded={currIndicator}
      theme="dark"
    >
      <CDD
        years={year}
        mapType={mapType}
        region={region}
        currOverlay={currOverlay}
        currMain={currMain}
        colors={legend.heatpump.color}
        minMax={legend.heatpump.minmax}
        mapData={currHeatpumpData}
        click={(e) => setCountry(e)}
      />
      <ControlWrapper
        help={{
          visible: true,
          click: (_) => setOpenModal(!openModal),
          title: "Glossary of map terms",
        }}
      >
        <ControlContainer position="bottomRight" transparent>
          {legends.map((legend, idx) => (
            <Legend key={idx} {...legend} />
          ))}
        </ControlContainer>
        <ControlContainer position="topLeft">
          {controls.map((control, idx) => (
            <Controls key={idx} {...control} />
          ))}
          {regionDropdown.map((drop, idx) => (
            <Controls key={idx} {...drop} />
          ))}
          {isService ? (
            <>
              <SimpleBarChart unit={barTitle} data={currIndicator} />
            </>
          ) : !country ? (
            <>
              <p>
                Select a territory to see CO<sub>2</sub> savings by switching
                from gas to heat pumps
              </p>
            </>
          ) : (
            <>
              <SimpleBarChart
                unit={barTitle}
                title={currIndicator[0] && currIndicator[0].title}
                data={currIndicator}
              />
            </>
          )}
          {popup.map((item, idx) => (
            <Popup key={idx} {...item} />
          ))}
        </ControlContainer>
      </ControlWrapper>
      <Modal
        size="full"
        open={openModal}
        click={(_) => setOpenModal(!openModal)}
      >
        <Content table={table} />
      </Modal>
    </MapContainer>
  );
}

export default CDDWrapper;

const Popup = ({ click }) => (
  <Icon
    fill
    button
    type="help"
    float={true}
    styles={classes.Help}
    click={click}
    title="Glossary of map terms"
  />
);

const Content = ({ table }) => {
  let nav = [
    "Glossary",
    "Heating needs",
    "Cooling needs",
    "Heating and cooling needs",
    "Heat pumps emissions",
  ];

  const [selectedNav, setSelectedNav] = useState("Glossary");
  const ref = React.createRef();
  const ref1 = React.createRef();
  const ref2 = React.createRef();
  const ref3 = React.createRef();
  const ref4 = React.createRef();

  const scrollSmoothHandler = (e) => {
    let refs = [ref, ref1, ref2, ref3, ref4];
    for (let r in refs) {
      if (refs[r].current.id === e) {
        refs[r].current.scrollIntoView({ behavior: "smooth" });
      }
    }
    setSelectedNav(e);
  };

  return (
    <div className={classes.PopupWrapper}>
      <div className={classes.PopupNavWrapper}>
        <div className={classes.PopupNav}>
          <ul>
            {nav.map((d) => (
              <li
                key={d}
                onClick={(_) => scrollSmoothHandler(d)}
                className={selectedNav === d ? classes.selected : ""}
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={classes.ContentSection}>
        <div className={classes.Content}>
          <h3 id={nav[0]} ref={ref}>
            Information
          </h3>
          <div className={classes.ContentInfo}>
            <p>
              <b>Heating and cooling needs</b>
              <br />
              These maps are showing indicators related to local heating and
              cooling needs, including both the share of population with heating
              and cooling needs as well as the intensity of those needs,
              depending on temperature and humidity levels. Such indicators can
              be used to assess the relevance of low-carbon heating and cooling
              solutions at the local level, especially for heat pumps or
              district energy.
              <br />
              The maps can be visualized for 2019, 2040 and 2070, for the
              Sustainable Development Scenario and the Stated Policies Scenario,
              at both the global and aggregated regional level.
            </p>
            <br />
            <p>
              <b>
                CO<sub>2</sub> savings from heat pumps
              </b>
              <br />
              This map is showing indicators related to potential for reducing
              carbon emissions from switching from a condensing gas boiler (the
              lowest carbon-intensive fossil-fuel heating option) to a market
              median air-source heat pump for space heating.
              <br />
              The maps can be visualized for 2019, 2040 and 2070, for the
              Sustainable Development Scenario and the Stated Policies Scenario,
              at the country level.
            </p>
          </div>
          <h3 id={nav[0]} ref={ref}>
            Glossary
          </h3>
          <div className={classes.ContentInfo}>
            <p>
              <b>HDD:</b> Heating Degree Days{" "}
            </p>
            <p>
              <b>CDD:</b> Cooling degree days{" "}
            </p>
            <p>
              <b>SDS:</b> Sustainable Development Scenario{" "}
            </p>
            <p>
              <b>STEPS:</b> Stated Policies Scenario{" "}
            </p>
            <br />
            <p>
              The <b>historical variables</b> used in this map can be explored
              and downloaded from the{" "}
              <a href="https://www.iea.org/articles/weather-for-energy-tracker">
                <b>Weather for energy tracker</b>
              </a>
              .
              <br /> <br />
              <b>Future temperature</b> values are derived from NCAR GIS
              Program. 2012. Climate Change Scenarios, version 2.0. Community
              Climate System Model, June 2004 version 3.0.
              http://www.cesm.ucar.edu/models/ccsm3.0/ was used to derive data
              products. For this analysis, outcomes from RCPs 2.6 and 4.5
              (anomalies, multi-year mean of monthly data of future climate
              simulations) have been associated to the SDS and STEPS scenario
              respectively.
            </p>
            <br />
            <p>
              <b>Population</b> projections data are derived from Jones, B.,
              O’Neill, B.C., 2016. Spatially explicit global population
              scenarios consistent with the Shared Socioeconomic Pathways.
              Environmental Research Letters 11, 84003.
              DOI:10.1088/1748-9326/11/8/084003. Gao, J., 2017. Downscaling
              Global Spatial Population Projections from 1/8-degree to 1-km Grid
              Cells. NCAR Technical Note NCAR/TN-537+STR, DOI: 10.5065/D60Z721H.
            </p>
            <br />
            <p>
              Sustainable Development Scenario: This is the scenario which lies
              at the heart of Energy Technology Perspective 2020 and World
              Energy Outlook 2020. It describes the broad evolution of the
              energy sector that would be required to reach the United Nations
              Sustainable Development Goals (SDGs) most closely related to
              energy. It is consistent with reaching global net-zero CO
              <sub>2</sub> emissions from the energy sector in 2070s and it is
              designed to assess what is needed to meet these SDS goals,
              including the Paris Agreement, in a realistic and cost-effective
              way.
            </p>
            <br />
            <p>
              Stated Policies Scenario: This scenario serves as a benchmark for
              the projections of the Sustainable Development Scenario. It
              assesses the evolution of the global energy system on the
              assumption that government policies and commitments that have
              already been adopted or announced with respect to energy and the
              environment are implemented, including commitments made in the
              nationally determined contributions under the Paris Agreement.
            </p>
            <br />
            <p>
              <b>Heating Degree Days</b>(HDD) <br />
              Shown in this map are calculated using daily average temperatures,
              base temperature 18°C, HDD (18°C).
              <br />
            </p>
            <br />
            <p>
              <b>Cooling Degree Days</b> (CDD) <br />
              Shown in this map are calculated using daily average temperatures,
              base temperature 18°C, CDD (18°C).
              <br />
            </p>
            <br />
            <p>
              CDD used to evaluate cooling needs are calculated using daily
              average temperatures, base temperature 10°C, CDD (10°C).
            </p>
            <br />
            <p>
              <b>Heating and cooling needs</b>
              <br />
              The indicators related to heating and cooling needs derive from
              variables displayed on a grid map at the resolution 0.25 degree by
              latitude and longitude. The thresholds values used to define the
              indicators are described below.
              <br />
            </p>
            <br />
          </div>
          <h3 id={nav[1]} ref={ref1}>
            Heating needs
          </h3>
          <Table
            title="Service needs"
            body={table.heating.service}
            head={["Type", "Description"]}
          />
          <Table
            title="Indicators"
            header={true}
            body={table.heating.indicators}
            head={["Type", "Description"]}
          />
          <h3 id={nav[2]} ref={ref2}>
            Cooling needs
          </h3>
          <Table
            title="Service needs"
            body={table.cooling.service}
            head={["Type", "Description"]}
          />
          <Table
            title="Indicators"
            header={true}
            body={table.cooling.indicators}
            head={["Type", "Description"]}
          />
          <h3 id={nav[3]} ref={ref3}>
            Heating and cooling needs
          </h3>
          <Table
            title="Indicators"
            body={table.both.indicators}
            head={["Type", "Description"]}
          />
          <h3 id={nav[4]} ref={ref4}>
            CO<sub>2</sub> savings from heat pumps
          </h3>
          <div className={classes.ContentInfo}>
            <p>
              The heat pump emissions indicator assesses the emissions reduction
              potential from switching from a condensing gas boiler (the lowest
              carbon-intensive fossil-fuel heating option) to a market median
              air-source heat pump for space heating. The carbon footprint of
              heating equipment is averaged across the entire duration of their
              projected operations, and in particular accounts for changes in
              the carbon intensity of electricity in each scenario, in the case
              of heat pumps. For the assessment of average annual emissions of
              heat pumps purchased in 2019, calculations are based on the
              electricity mix of the Stated Policies Scenario.
            </p>
            <br />
            <p>
              If the indicator is negative, running a heat pump is typically
              less carbon-intensive than running a condensing gas boiler (e.g.
              30% lower if the indicator is equal to -30%). -100% means that
              heat pumps are zero-carbon, i.e. operating in an area where the
              electricity is entirely decarbonized. If the indicator is
              positive, running a heat pump is typically more carbon-intensive
              than running a condensing gas boiler. If the index is equal to 0,
              there is no emissions reduction from switching to heat pumps since
              the carbon footprint of a market median heat pump is equal to one
              of a condensing gas boiler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
const Table = ({ title, header, body, head }) => (
  <div className={classes.Table}>
    {header && <h5>{title}</h5>}
    <div className={classes.TableHeader}>
      <table>
        <thead>
          <tr>
            {head.map((item, idx) => (
              <th key={idx}> {item} </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((d, idx) => (
                <td key={idx}>{d}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
