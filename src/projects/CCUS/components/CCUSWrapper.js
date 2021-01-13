import React from "react";
import axios from "axios";
import Papa from "papaparse";
import CCUSContainer from "./CCUSContainer";
import { MapContainer } from "../../../components/container";
import { ControlWrapper, ControlContainer } from "../../../components/controls";
import { Legends } from "../../../components/legends";
import classes from "./css/Index.module.css";

export default ({ baseURL, match }) => {
  let currRegion =
    match.path.substring(10) === "us"
      ? match.path.substring(10).toUpperCase()
      : match.path.substring(10).charAt(0).toUpperCase() +
        match.path.substring(10).slice(1);

  const bounds = {
    US: [
      [-180, 10],
      [-45, 74],
    ],
    China: [
      [60, 9],
      [155, 55],
    ],
    Europe: [
      [-33, 26],
      [64, 66],
    ],
  };
  const colors = ["#B187EF", "#6f6f6f", "#3E7AD3", "#1DBE62", "#FF684D"];

  const [data, setData] = React.useState(null);
  const [legendToggle, setLegendToggle] = React.useState({
    "Oil and gas reservoirs": true,
    "Saline aquifers": true,
    hubs: false,
    pipelines: true,
    sources: [],
    projects: [],
  });

  React.useEffect(() => {
    const URL = [
      axios.get(`${baseURL}etp/ccus/${currRegion}_Saline.json`),
      axios.get(`${baseURL}etp/ccus/${currRegion}_emissions.csv`),
    ];

    const types = [
      "Iron and steel",
      "Cement",
      "Fuel refining",
      "Chemicals",
      "Power",
    ];
    const regionParam = {
      US: {
        "Oil and gas reservoirs": [
          {
            url: "mapbox://iea.63h5unlk",
            sourceLayer: "US_Reservoir_1458-45y6ui",
          },
          {
            url: "mapbox://iea.733wblb1",
            sourceLayer: "US_Reservoir_23-b0hrl2",
          },
          {
            url: "mapbox://iea.092dk9uv",
            sourceLayer: "US_Reservoir_67-1u3cbn",
          },
          {
            url: "mapbox://iea.47kfi170",
            sourceLayer: "US_Reservoir_9101112-1x96uc",
          },
        ],
        types: types,
      },
      Europe: {
        "Oil and gas reservoirs": [
          {
            url: "mapbox://iea.d4w60p1l",
            sourceLayer: "Europe_reservoir-5lg77n",
          },
        ],
        types: types,
      },
      China: {
        "Oil and gas reservoirs": [
          {
            url: "mapbox://iea.0nkpwvw6",
            sourceLayer: "China_Reservoir-4sfg1q",
          },
        ],
        types: types,
      },
    };

    axios.all(URL).then((responses) => {
      let temporaryData = Papa.parse(responses[1].data, { header: true }).data;
      let tempData = setTempData(temporaryData);
      let data = {
        heatmap: {
          type: "FeatureCollection",
          features: populateData(tempData),
        },
        "Oil and gas reservoirs":
          regionParam[currRegion]["Oil and gas reservoirs"],
        "Saline aquifers": responses[0].data,
        types: regionParam[currRegion].types,
        minMax: [
          Math.min(...tempData.map((d) => parseFloat(d.value))),
          Math.max(...tempData.map((d) => parseFloat(d.value))) *
            regionParam[currRegion].scale,
        ],
      };

      function setTempData(data) {
        let newData = [];
        for (let i in data) {
          if (isNaN(parseFloat(data[i].value))) {
          } else {
            newData.push(data[i]);
          }
        }
        return newData;
      }

      function populateData(data) {
        let result = [];
        for (let i in data) {
          result.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                parseFloat(data[i].LONGITUDE),
                parseFloat(data[i].LATITUDE),
              ],
            },
            properties: {
              value: parseFloat(data[i].value) || 0,
              type: data[i].SECTOR,
            },
          });
        }
        return result;
      }

      setLegendToggle({
        "Oil and gas reservoirs": true,
        "Saline aquifers": true,
        pipelines: true,
        projects: ["Under development", "Operating"],
        hubs: true,
        sources: regionParam[currRegion].types,
      });
      setData(data);
    });
  }, [baseURL, currRegion]);

  function getArrayValue(arr) {
    let activeStorage = [];
    for (let el in arr) {
      if (legendToggle[arr[el]]) {
        activeStorage.push(arr[el]);
      }
    }
    return activeStorage;
  }

  let legends = [
    {
      type: "continuous",
      header: "CO2 emissions (Mt/year)",
      labels: [0, 225],
      colors: [
        "#e3a850",
        "#da8142",
        "#d36337",
        "#ce5030",
        "#c21e1e",
        "#a02115",
        "#8a230f",
        "#78240a",
        "#522700",
      ],
    },
    {
      type: "category",
      header: "Potential CO2 storage",
      labels: ["Oil and gas reservoirs", "Saline aquifers"],
      colors: ["#5b6162", { type: "stripe", colors: ["#4f7d82", "#fff"] }],
      selected: getArrayValue(["Oil and gas reservoirs", "Saline aquifers"]),
      round: false,
      click: (val) => {
        setLegendToggle((prev) => ({ ...prev, [val]: !legendToggle[val] }));
      },
    },
    {
      type: "category",
      header: "CO2 sources",
      labels: [
        "Iron and steel",
        "Cement",
        "Fuel refining",
        "Chemicals",
        "Power",
      ],
      colors: colors,
      selected: legendToggle.sources,
      round: true,
      click: (val) => {
        setLegendToggle(
          !legendToggle.sources.includes(val)
            ? (prev) => ({ ...prev, sources: [...prev.sources, val] })
            : (prev) => ({
                ...prev,
                sources: legendToggle.sources.filter((d) => d !== val),
              })
        );
      },
    },
  ];

  if (currRegion === "Europe") {
    legends = [
      ...legends,
      {
        type: "category",
        header: "CO2 storage hubs",
        labels: ["Hubs"],
        colors: [{ type: "dot" }],
        symbolColor: ["#000"],
        selected: legendToggle.hubs ? ["Hubs"] : [],
        round: true,
        click: (_) =>
          setLegendToggle((prev) => ({ ...prev, hubs: !legendToggle.hubs })),
      },
    ];
  } else if (currRegion === "US") {
    legends = [
      ...legends,
      {
        type: "category",
        header: "CO2 pipelines",
        labels: ["Pipelines"],
        colors: [{ type: "line" }],
        selected: legendToggle.pipelines ? ["Pipelines"] : [],
        click: (_) => {
          setLegendToggle((prev) => ({
            ...prev,
            pipelines: !legendToggle.pipelines,
          }));
        },
      },
    ];
  }

  return (
    <MapContainer selector={match.path.substring(1)} loaded={data} fluid={true} theme="light">
      <CCUSContainer
        data={data}
        toggle={legendToggle}
        regions={{ region: currRegion, bounds: bounds[currRegion] }}
      />
      <ControlWrapper bg={true}>
        <ControlContainer position="bottomLeft">
          {legends.map((legend, idx) => (
            <Legends key={idx} {...legend} />
          ))}
          <div className={classes.Introduction}>
            <p>
              * Click on legend to switch on/off layers
              <br />* Zoom in to view CO<sub>2</sub> storage and plants
              <br />
              {currRegion === "US"
                ? "* Includes 50 US States and Puerto Rico"
                : null}
            </p>
          </div>
        </ControlContainer>
      </ControlWrapper>
    </MapContainer>
  );
};
