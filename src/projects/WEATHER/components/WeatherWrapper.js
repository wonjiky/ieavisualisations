import React, { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  ControlWrapper,
  ControlContainer,
  Legend,
  Icon,
  Modal,
  Controls,
} from "@iea/react-components";
import {
  getCountryNameByISO,
  isAnomaly,
  getMonthString,
  uppercase,
  useIntervalLogic,
  colorArray,
  gridColorArray,
  getTerritoryMinMax,
  getGridMinMax,
} from "./util";
import axios from "axios";
import CountryInfo from "./CountryInfo";
import variables from "../assets/variables.json";
import gridMinMaxRange from "../assets/gridminmax.json";
import Logos from "./Logos";
import Weather from "./Weather";
import classes from "./css/Weather.module.css";

export default function () {
  let minYear = 2000,
    maxYear = 2020;
  let months = 12,
    minMonth = 1,
    maxMonth = 10;
  let minDay = 1;

  let initialVariable = variables.territory.sort((a, b) =>
    a.group.localeCompare(b.group)
  )[0];
  const numToStr = (num) => `${num < 10 ? "0" : ""}${num}`;
  const [data, setData] = useState({ data: null });
  const [index, setIndex] = useState(true);
  const [firstCountry, setFirstCountry] = useState(null);
  const [secondCountry, setSecondCountry] = useState(null);
  const [date, setDate] = useState({ day: 1, month: maxMonth, year: maxYear });
  const [mapType, setMapType] = useState("territory");
  const [variable, setVariable] = useState({
    id: initialVariable.id,
    option: initialVariable.option,
  });
  const [viewInterval, setViewInterval] = useState("day");
  const [valueType, setValueType] = useState("Value");
  const [active, setActive] = useState({ open: false, target: null });
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [gridTime, setGridTime] = useState({
    month: date.month,
    year: date.year,
  });
  const { day, month, year } = date;

  // Retrieve attributes for each variable
  let { decimal, id, unit, color, group } = variables[mapType].find(
    (d) => d.id === variable.id
  );
  let valueTypes = {
    Value: "monthly",
    Anomalies: "anomaly",
    "Value Climatologies": "climatology",
  };
  let currValueType = valueTypes[valueType];

  // Set image URL for grid view
  let gridTimeByValueType =
    currValueType === "climatology"
      ? numToStr(gridTime.month)
      : `${gridTime.year}/${numToStr(gridTime.month)}`;
  let currGridVariable = `IEA_${variable.id}`;
  let currGridLayer = `https://ieamaps.blob.core.windows.net/weather/grid/${currValueType}/${gridTimeByValueType}/${currGridVariable}${currValueType}.png`;

  // Set choropleth data query
  const getQuery = (query) =>
    Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&");
  let joinedDate = `${year}${numToStr(month)}${numToStr(day)}`;
  let query = useIntervalLogic(
    [
      { year, variable: variable.id },
      { year, month, variable: variable.id, valueType },
      { date: joinedDate, variable: variable.id },
    ],
    viewInterval
  );
  let mapQueryString = getQuery(query);

  // Produce query for country data
  let maxDay = new Date(year, month, 0).getDate();
  let startDate = useIntervalLogic(
    [
      `${minYear}${numToStr(minMonth)}${numToStr(minDay)}`,
      `${year}${numToStr(minMonth)}${numToStr(minDay)}`,
      `${year}${numToStr(month)}${numToStr(minDay)}`,
    ],
    viewInterval
  );
  let endDate = useIntervalLogic(
    [
      `${maxYear}${numToStr(maxMonth)}${maxDay}`,
      `${year}${numToStr(maxMonth)}${maxDay}`,
      `${year}${numToStr(month)}${maxDay}`,
    ],
    viewInterval
  );
  let timeByValueType =
    currValueType === "monthly" ? { startDate, endDate } : { year, month };
  let countryQuery = useIntervalLogic(
    [
      { startDate, endDate, variable: variable.id, valueType },
      { ...timeByValueType, variable: variable.id, valueType },
      { startDate, endDate, variable: variable.id, valueType },
    ],
    viewInterval
  );
  let countrQueryString = getQuery(countryQuery);

  // Produce download link and query
  let downloadQuery = useIntervalLogic(
    [
      { variable: variable.id, daily: true, year },
      { variable: variable.id, year, valueType },
      { variable: variable.id, daily: true, year, month },
    ],
    viewInterval
  );
  let download = `https://api.iea.org/weather/csv/?${getQuery(downloadQuery)}`;
  let downloadButtonLabel = useIntervalLogic(
    [
      `Daily ${variable.option} values (csv) for ${year}`,
      `Monthly ${variable.option} ${
        currValueType === "climatology"
          ? "climatologies"
          : valueType.toLowerCase()
      } (csv) for ${year}`,
      `Daily ${variable.option} values (csv) for ${getMonthString(
        month
      )} ${year}`,
    ],
    viewInterval
  );

  // Change download button popup hover text on grid view
  if (mapType === "grid") {
    downloadQuery =
      currValueType === "climatology"
        ? `Climatologies/${numToStr(gridTime.month)}/`
        : `${gridTime.year}/${numToStr(gridTime.month)}/`;
    download = `http://weatherforenergydata.iea.org/${downloadQuery}IEA_${
      variable.id
    }${currValueType}
		${currValueType === "climatology" ? "" : "_" + gridTime.year}_${numToStr(
      gridTime.month
    )}.nc`;
    downloadButtonLabel = `${
      variable.id
    } ${currValueType} (NetCDF) for ${getMonthString(gridTime.month)} ${
      gridTime.year
    }`;
  }

  // Get legend minmax label
  const legendLabel =
    mapType === "territory"
      ? getTerritoryMinMax(data.minMax, currValueType, group)
      : getGridMinMax(
          gridMinMaxRange[currValueType][currGridVariable],
          currValueType,
          mapType,
          gridTime.year - minYear,
          group,
          id
        );

  const hide = React.useCallback((e) => {
    setActive({ open: false, target: null });
    document.removeEventListener("click", hide);
  }, []);

  useEffect(() => {
    if (!active.open && !openInfo) return;
    document.addEventListener("click", hide);
  }, [active.open, openInfo, hide]);

  // Assign selected countries to variable
  function getSelectedCountries(value, index) {
    if (!getCountryNameByISO(value)) return;
    let currArr = [...selectedCountries];
    let idx = index ? "firstCountry" : "secondCountry";
    let pos = currArr.findIndex((d) => d.id === idx);
    let countries = {
      firstCountry: {
        id: "firstCountry",
        color: "#727272",
        setData: (e) => setFirstCountry(e),
      },
      secondCountry: {
        id: "secondCountry",
        color: "#b8b8b8",
        setData: (e) => setSecondCountry(e),
      },
    };
    if (currArr.length === 2) {
      currArr.splice(pos, 1);
      currArr.push({ ...countries[idx], ISO: value });
    } else currArr.push({ ...countries[idx], ISO: value });
    setSelectedCountries(currArr);
  }

  // Fetch selected country's data
  const fetchCountryData = useCallback(() => {
    for (let country in selectedCountries) {
      let selected = selectedCountries[country];
      axios
        .get(
          `https://api.iea.org/weather/country/${selected.ISO}/?${countrQueryString}`
        )
        .then((response) => {
          selected.setData({
            ISO: selected.ISO,
            color: selected.color,
            data: response.data.map((d) => [
              d[0],
              parseFloat(d[1].toFixed(decimal)),
            ]),
            viewInterval:
              viewInterval === "day"
                ? 86400000
                : viewInterval === "month"
                ? 2592000000
                : 31104000000,
          });
        });
    }
  }, [selectedCountries, countrQueryString, viewInterval, decimal]);
  useEffect(fetchCountryData, [selectedCountries, countrQueryString]);

  // Push selected countries data to an array to series
  let countryData = [];
  [firstCountry, secondCountry].forEach((d) => (d ? countryData.push(d) : ""));

  // Fetch choropleth data
  useEffect(() => {
    if (mapType === "grid") return;

    let fetchData = [
      axios.get(`https://api.iea.org/weather/?${mapQueryString}`),
      axios.get(`https://api.iea.org/weather/extremes/?${mapQueryString}`),
    ];

    axios.all(fetchData).then(
      axios.spread((...responses) => {
        let tempData = responses[0].data;
        let minMax = responses[1].data[0];

        let filteredData = tempData.filter((d) =>
          getCountryNameByISO(d.country)
        );
        let currVariable = mapQueryString
          .split("&")
          .map((d) => d.split("="))
          .find((d) => d[0] === "variable")[1];
        let tempVariable = variables.territory;
        let isTemp = tempVariable.find(
          (d) => d.id === currVariable && d.group === "Temperature"
        );
        let hasPop =
          currVariable.substring(
            currVariable.length - 5,
            currVariable.length
          ) === "bypop";
        let tempResult =
          isTemp && hasPop
            ? filteredData.filter((d) => d.value !== 0)
            : filteredData;

        let color = tempVariable.find((d) => d.id === currVariable);
        let result = tempResult.map((d) => ({
          ...d,
          name: getCountryNameByISO(d.country),
          value: parseFloat(d.value.toFixed(decimal)),
        }));

        let maxvalue = group === "Precipitation" ? minMax.max / 3 : minMax.max;
        let minvalue = group === "Precipitation" ? minMax.min / 3 : minMax.min;

        setData({
          data: result,
          color: color.color,
          minMax: [minvalue, maxvalue],
        });
      })
    );
  }, [mapType, mapQueryString, decimal, group]);
  const controls = {
    topleft: [
      {
        type: "button",
        options: ["Territory", "Grid"],
        selected: uppercase(mapType),
        flow: "row",
        click: (value) => {
          if (value.toLowerCase() === mapType) return;
          let map = mapType === "territory" ? "grid" : "territory";
          map === "territory"
            ? setDate({
                day: minDay,
                month: gridTime.month,
                year: gridTime.year,
              })
            : setGridTime({ month: month, year: year });

          setMapType(value.toLowerCase());
          setVariable({
            id: variables[map][0].id,
            option: variables[map][0].option,
          });
          setFirstCountry(null);
          setValueType("Value");
          setSecondCountry(null);
          setIndex(true);
          setViewInterval(map === "territory" ? "day" : "month");
          setSelectedCountries([]);
        },
      },
      {
        type: "dropdown",
        label: "Variables",
        group: true,
        options: variables[mapType].sort((a, b) =>
          a.group.localeCompare(b.group)
        ),
        selected: uppercase(variable.option),
        active: active,
        open: (e) => setActive({ open: true, target: e.target.value }),
        click: (e) => setVariable({ id: e.id, option: e.option }),
      },
      {
        type: "slider",
        selected: uppercase(viewInterval),
        label:
          mapType === "territory"
            ? useIntervalLogic(
                [
                  year,
                  `${getMonthString(month)}, ${year}`,
                  `${day} ${getMonthString(month)}, ${year}`,
                ],
                viewInterval
              )
            : currValueType === "climatology"
            ? getMonthString(gridTime.month)
            : `${getMonthString(gridTime.month)}, ${gridTime.year}`,
        value:
          mapType === "territory"
            ? useIntervalLogic([year, month, day], viewInterval)
            : viewInterval === "month"
            ? gridTime.month
            : gridTime.year,
        min:
          mapType === "territory"
            ? useIntervalLogic([minYear, minMonth, minDay], viewInterval)
            : viewInterval === "month"
            ? minMonth
            : minYear,
        max:
          mapType === "territory"
            ? useIntervalLogic(
                [maxYear, year === maxYear ? maxMonth : months, maxDay],
                viewInterval
              )
            : currValueType === "climatology"
            ? months
            : viewInterval === "month"
            ? gridTime.year === maxYear
              ? maxMonth
              : months
            : gridTime.month <= maxMonth
            ? maxYear
            : maxYear - 1,
        step: 1,
        change: (e) =>
          mapType === "territory"
            ? setDate(
                viewInterval !== "day"
                  ? {
                      ...date,
                      [viewInterval]: Number(e.target.value),
                      day: minDay,
                    }
                  : { ...date, [viewInterval]: Number(e.target.value) }
              )
            : setGridTime(
                viewInterval === "month"
                  ? { ...gridTime, month: Number(e.target.value) }
                  : { ...gridTime, year: Number(e.target.value) }
              ),
      },
      {
        type: "button",
        options:
          mapType === "territory"
            ? ["Year", "Month", "Day"]
            : ["Year", "Month"],
        selected: uppercase(viewInterval),
        flow: "row",
        disabled:
          mapType === "grid" && currValueType === "climatology"
            ? ["Year"]
            : undefined,
        click: (value) => {
          mapType === "territory"
            ? setValueType("Value")
            : setValueType(valueType);
          setViewInterval(value.toLowerCase());
        },
      },
      {
        type: "radio",
        options: [
          { label: "Value", value: "Value" },
          { label: "Anomaly", value: "Anomalies" },
          { label: "Climatology", value: "Value Climatologies" },
        ],
        flow: "column",
        disabled:
          mapType === "territory"
            ? viewInterval === "month"
              ? false
              : true
            : false,
        selected: valueType,
        change: (e) => {
          if (e === "Value Climatologies") {
            setValueType(e);
            setViewInterval("month");
          } else setValueType(e);
          if (
            valueType === "Value Climatologies" &&
            gridTime.year === maxYear &&
            gridTime.month > maxMonth
          ) {
            setGridTime({ ...gridTime, month: maxMonth });
          }
        },
      },
      {
        type: "description",
        options: [
          "* Anomaly and climatology values are only available in monthly view",
        ],
      },
    ],
  };

  const legends = [
    {
      type: "continuous",
      unitLabel: unit,
      labels: legendLabel,
      colors: isAnomaly(
        valueType,
        mapType === "grid" ? gridColorArray[variable.id] : colorArray[color],
        "#424242"
      ),
    },
  ];

  const legendCustomStyle =
    mapType === "grid" && selectedCountries.length === 0
      ? [classes.LegendWrapper, classes.GridView].join(" ")
      : mapType !== "grid" && selectedCountries.length === 0
      ? [classes.LegendWrapper, classes.Bottom].join(" ")
      : classes.LegendWrapper;

  const popUps = [
    {
      type: "floatingButtons",
      click: () => setOpenInfo(!openInfo),
      mapType: mapType,
      download: download,
      downloadButtonLabel: downloadButtonLabel,
    },
  ];

  const disclaimer = { title: "Weather for energy tracker" };

  return (
    <MapContainer
      fluid={true}
      selector={"Weather_Map"}
      loaded={data.data}
      theme="dark"
      disclaimer={disclaimer}
    >
      <Weather
        data={data.data}
        territoryMinMax={data.minMax}
        mapType={mapType}
        selectedCountries={selectedCountries}
        valueType={valueType}
        gridURL={currGridLayer}
        unit={unit}
        decimal={decimal}
        colType={data.color}
        click={(e) => {
          if ([...selectedCountries].map((d) => d.ISO).includes(e)) return;
          setIndex(!index);
          getSelectedCountries(e, index);
        }}
      />
      <ControlWrapper
        help={{
          visible: true,
          click: (_) => setOpenInfo(!openInfo),
          title: "Glossary of map terms",
        }}
        download={{ link: download, label: downloadButtonLabel }}
      >
        <ControlContainer
          transparent
          position="bottomRight"
          customClass={legendCustomStyle}
        >
          {legends.map((legend, idx) => (
            <Legend key={idx} {...legend} />
          ))}
        </ControlContainer>
        <ControlContainer position="topLeft" style={{ width: "280px" }}>
          {controls.topleft.map((control, idx) => (
            <Controls key={idx} {...control} />
          ))}
          {popUps.map((popup, idx) => (
            <Popup key={idx} {...popup} />
          ))}
        </ControlContainer>
        <ControlContainer
          transparent
          position="topRight"
          customClass={classes.LogoCustomStyle}
        >
          <Logos />
        </ControlContainer>
      </ControlWrapper>
      <Modal size="full" open={openInfo} click={(_) => setOpenInfo(!openInfo)}>
        <Table
          title="Value types"
          body={variables.valueTypes}
          head={["Type", "Description"]}
        />
        <Table
          title="Variables"
          body={variables.table}
          head={["Name", "Description", "Aggregation in territories", "Unit"]}
        />
      </Modal>
      <CountryInfo
        data={countryData}
        countries={selectedCountries}
        mapType={mapType}
        unit={unit}
        decimal={decimal}
        click={(id) => {
          let currArray = [...selectedCountries];
          let pos = currArray.findIndex((d) => d.id === id);
          currArray.splice(pos, 1);
          id === "firstCountry"
            ? setFirstCountry(null)
            : setSecondCountry(null);
          id === "firstCountry" ? setIndex(true) : setIndex(false);
          setSelectedCountries(currArray);
        }}
      />
    </MapContainer>
  );
}

const Popup = ({ click, download, downloadButtonLabel, mapType }) => {
  return (
    <div className={classes.ButtonWrapper}>
      <Icon
        fill
        button
        type="help"
        float={true}
        styles={classes.Help}
        click={click}
        title="Glossary of map terms"
      />
      {mapType === "territory" && (
        <div className={classes.DownloadContainer}>
          <a href={download} className={classes.DownloadButton}>
            <Icon
              strokeWidth={1}
              stroke
              type="download"
              viewBox="-13 -11 50 50"
              float={true}
              styles={classes.Download}
            />
          </a>
          <div className={classes.DownloadWrapper}>{downloadButtonLabel}</div>
        </div>
      )}
    </div>
  );
};

const Table = ({ title, body, head }) => (
  <div className={classes.Table}>
    <h5>{title}</h5>
    <div
      className={
        title === "Variables"
          ? classes.TableWrapper
          : [classes.TableWrapper, classes.CustomTable].join(" ")
      }
    >
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
