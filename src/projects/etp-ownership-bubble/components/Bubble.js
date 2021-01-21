import React from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";

window.Highcharts = Highcharts;

const BubbleChart = ({ data, maxValue }) => {
  
  return (
    <div>
      <div>
        <LineChart series={data} />
      </div>
    </div>
  );
};

export default BubbleChart;

const LineChart = ({ series }) => {
  const containerProps = {
    style: {
      width: "97%",
      margin: "auto",
    },
  };

  const options = {
    chart: {
      type: "bubble",
    },
    title: {
      text:
        "Average number of air-conditioners per household by country relative to income per capita and heat index cooling-degree-days, 1990-2070",
    },
    yAxis: {
      tickLength: 0,
      min: 0,
      max: 4,
      title: {
        text: "Units per household",
      },
    },
    xAxis: {
      tickLength: 0,
      tickInterval: 10000,
      max: 110000,
      title: {
        text: "USD per capita",
      },
    },
    tooltip: {
      formatter: function () {
        return `
          <b>${this.point.country}</b>
          `;
      },
    },
    legend: {
      title: {
        text: "Stock of air-conditioners & CDD 18°C, using the heat index",
      },
      bubbleLegend: {
        enabled: true,
        borderColor: "#000",
        color: "#fff",
        connectorColor: "#000",
        borderWidth: 0.5,
        minSize: 5,
        maxSize: 45,
        ranges: [
          {
            value: 1,
          },
          {
            value: 135,
          },
        ],
      },
    },
    credits: {
      enabled: false,
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
