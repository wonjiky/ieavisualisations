import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Icon } from "@iea/react-components";
import { getCountryNameByISO } from "./util";
import classes from "./css/CountryInfo.module.css";

Highcharts.setOptions({ lang: { thousandsSep: "" } });
export default function CountryInfo({
  data,
  countries,
  decimal,
  mapType,
  unit,
  click,
}) {
  let series = data.map((d) => ({
    id: d.ISO,
    name: getCountryNameByISO(d.ISO),
    data: d.data,
    color: d.color,
    marker: { symbol: "circle" },
    interval: d.interval,
  }));

  return (
    <div
      className={
        mapType === "territory"
          ? classes.Wrapper
          : [classes.Wrapper, classes.hide].join(" ")
      }
    >
      {countries.length === 0 ? (
        <span>Select up to 2 territories by clicking on the map</span>
      ) : (
        <>
          <div className={classes.CountryWrapper}>
            <div className={classes.CountryLegendWrapper}>
              {countries
                .sort((a, b) => a.id.localeCompare(b.id))
                .map(
                  (d, idx) =>
                    d.ISO && (
                      <div
                        key={idx}
                        className={classes.CountryLegendItem}
                        onClick={(_) => click(d.id)}
                      >
                        {getCountryNameByISO(d.ISO)}
                        <div
                          className={classes.Legend}
                          style={{ background: d.color }}
                        />
                        <Icon
                          type="close"
                          dark={true}
                          stroke="#000"
                          fill="#000"
                          styles={classes.Close}
                          viewBox={"-4 -4 26 26"}
                        />
                      </div>
                    )
                )}
            </div>
          </div>
          {data.length !== 0 && (
            <Chart series={series} unit={unit} decimal={decimal} />
          )}
        </>
      )}
    </div>
  );
}

const Chart = ({ series, unit, decimal }) => {
  const containerProps = {
    style: {
      height: "170px",
      width: "100%",
      backgroundColor: "transparent",
    },
  };

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      visible: false,
    },
    xAxis: {
      offset: 0,
      minorTickLength: 0,
      tickLength: 0,
      lineWidth: 0,
      type: "datetime",
      tickInterval: series[0].interval,
    },
    tooltip: {
      valueDecimals: decimal,
      valueSuffix: ` ${unit}`,
      borderWidth: 0,
      shared: true,
      xDateFormat: "%d-%m-%Y",
    },
    series: series,
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={containerProps}
    />
  );
};
