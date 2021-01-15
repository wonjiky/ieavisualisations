import React from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";

window.Highcharts = Highcharts;
HC_more(Highcharts);

const Electricity = () => {
  const lineSeries = [
    {
      name: "2020",
      type: "line",
      data: [
        53200,
        58198,
        59218,
        59877,
        56253,
        57754,
        56635,
        55866,
        56765,
        56192,
        53052,
        49271,
        48197,
        46569,
        42235,
        44104,
        43841,
        41349,
        44111,
        44972,
        43055,
        43452,
        44592,
        44544,
        45309,
        46753,
        47192,
        46748,
        46692,
        47318,
        47677,
        47028,
        45905,
        46541,
        47262,
        47600,
        48472,
        48382,
        47793,
        48469,
        48761,
        50058,
        49796,
        50297,
      ],
      zIndex: 1,
    },
    {
      name: "2015-19",
      type: "arearange",
      data: [
        [56150, 60165],
        [57503, 60970],
        [57946, 61444],
        [58035, 61634],
        [58053, 61699],
        [58174, 61501],
        [58807, 61918],
        [58370, 62181],
        [57755, 61586],
        [57121, 60787],
        [56549, 60305],
        [55533, 59263],
        [54302, 58224],
        [53236, 57040],
        [51977, 55070],
        [50787, 54038],
        [49553, 52719],
        [48486, 51395],
        [47886, 50545],
        [47294, 49835],
        [46572, 49129],
        [46497, 48746],
        [46415, 48446],
        [46506, 48816],
        [46778, 49054],
        [47188, 49267],
        [47667, 49621],
        [48190, 49873],
        [48526, 50285],
        [48626, 50472],
        [48521, 50226],
        [48007, 49509],
        [47657, 49256],
        [47569, 49178],
        [47547, 49148],
        [47480, 49063],
        [47577, 49026],
        [47977, 49283],
        [48578, 49871],
        [48911, 50254],
        [49086, 50430],
        [49429, 50765],
        [49581, 51133],
        [50106, 51937],
        [50867, 52864],
        [51861, 53985],
        [52919, 55286],
        [53915, 56762],
        [54804, 58080],
        [55441, 59206],
        [54976, 58638],
      ],
      zIndex: 0,
      marker: {
        enabled: false,
        symbol: "circle",
        fillColor: "#d0d0d0",
      },
      lineWidth: 0,
      color: Highcharts.getOptions().colors[0],
      fillColor: "rgba(0,0,0,0.1)",
      lineColor: "#d0d0d0",
    },
  ];

  const percentArea = [
    {
      name: "Nuclear",
      data: [
        28.9,
        26.7,
        25.9,
        25.7,
        26.5,
        26.1,
        25.7,
        25.4,
        25.3,
        25.7,
        25.5,
        26.2,
        26,
        27.2,
        28.3,
        26.9,
        26.9,
        26.8,
        24.9,
        24.1,
        24.4,
        24.7,
        24.1,
        23.2,
        21.9,
        20.5,
        21.7,
        22.6,
        24,
        23.2,
        22.4,
        23.1,
        23.6,
        23,
        22.2,
        22.4,
        22.5,
        22.8,
        23.5,
        24.1,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Coal",
      data: [
        13.9,
        15.1,
        17.3,
        12.4,
        13.7,
        12.2,
        11.4,
        13.3,
        13.2,
        11.8,
        13.1,
        12.2,
        11.7,
        11.4,
        10.6,
        11.6,
        11.4,
        10.8,
        10.9,
        10.9,
        10.6,
        11.4,
        11.6,
        13,
        12.5,
        11.1,
        12.2,
        13.1,
        12,
        12.8,
        13.7,
        14.9,
        13.7,
        15.9,
        17.2,
        18.3,
        18.2,
        16.3,
        14.9,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Natural gas",
      data: [
        20.9,
        21.6,
        23.7,
        18.1,
        18.9,
        18.1,
        17.6,
        18,
        18.7,
        17.4,
        16,
        15.8,
        16,
        15.8,
        14.8,
        16.9,
        15.3,
        16.8,
        17.9,
        17.3,
        19,
        19.7,
        21.6,
        22.4,
        22.5,
        21,
        24.7,
        26,
        24.9,
        26.2,
        24.7,
        25.9,
        22.8,
        23.5,
        21.7,
        22.6,
        24.4,
        21.1,
        18.6,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Others",
      data: [
        2.3,
        2.2,
        2.4,
        2.2,
        2.2,
        2.3,
        2.2,
        2.1,
        2,
        2.1,
        2.2,
        2.2,
        2.1,
        2.3,
        2.2,
        2.2,
        2.3,
        2.2,
        2.2,
        2.3,
        2.3,
        2.4,
        2.3,
        2.4,
        2.4,
        2.4,
        2.4,
        2.4,
        2.4,
        2.2,
        2.2,
        2.2,
        2.2,
        2.2,
        2.2,
        2.3,
        2.3,
        2.4,
        2.2,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Hydro",
      data: [
        11.6,
        11,
        10.6,
        11.4,
        10.6,
        11.7,
        11.8,
        11.9,
        12.3,
        13.1,
        13.3,
        13.8,
        13,
        12.3,
        12.4,
        13.6,
        16.2,
        15.3,
        16,
        16.6,
        15.9,
        14.6,
        14.9,
        16.1,
        16.2,
        15.1,
        13.3,
        13.1,
        12.4,
        11.8,
        12.6,
        12.9,
        12.2,
        11.2,
        11.5,
        11.5,
        10.8,
        9.6,
        10.4,
        10.9,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Wind",
      data: [
        16.7,
        17.7,
        17.3,
        12.6,
        22.7,
        19.1,
        21.3,
        22.4,
        19.9,
        18,
        18.7,
        16,
        17.3,
        15.8,
        13.1,
        16.1,
        9.9,
        13.2,
        13.5,
        13.1,
        13,
        11.3,
        13.3,
        10.7,
        8.5,
        11.3,
        15.6,
        9.8,
        7.2,
        10.5,
        9.1,
        8,
        6.9,
        13.1,
        12,
        11.3,
        9.9,
        10.3,
        15.5,
        19.8,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Solar",
      data: [
        1.9,
        1.8,
        1.9,
        1.6,
        2.1,
        3,
        3,
        3.4,
        3.2,
        3.6,
        5.2,
        6.3,
        6.7,
        8.3,
        9.5,
        8.9,
        9.3,
        8.6,
        9.2,
        8.8,
        9.6,
        11.1,
        8,
        8.2,
        9.6,
        9.7,
        9.2,
        9.3,
        8.9,
        9.1,
        8.8,
        9.5,
        8.3,
        8.3,
        6.9,
        8,
        7.9,
        6.5,
        4.7,
        4.5,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
    {
      name: "Other Res",
      data: [
        6.1,
        5.6,
        5.4,
        5.2,
        5.4,
        5.3,
        5.6,
        5.7,
        5.8,
        5.7,
        5.9,
        6.5,
        6.6,
        6.6,
        7.2,
        6.9,
        7,
        7.1,
        6.5,
        6.4,
        6.6,
        6.5,
        6.1,
        6.1,
        6,
        5.9,
        5.7,
        5.9,
        6,
        6,
        5.8,
        5.8,
        6.1,
        5.9,
        5.8,
        5.8,
        5.7,
        5.9,
        6.1,
        5,
      ],
      marker: {
        enabled: false,
        symbol: "circle",
      },
    },
  ];

  return (
    <div>
      <div>
        <LineChart series={lineSeries} />
        <PercentArea series={percentArea} />
      </div>
    </div>
  );
};

const LineChart = ({ series }) => {
  const containerProps = {
    style: {
      width: "97%",
      margin: "auto",
    },
  };

  const options = {
    title: {
      text: "Total generated energy within last 40 weeks and breakdown",
    },
    yAxis: {
      tickLength: 0,
      title: {
        text: "Total energy generation",
      },
    },
    xAxis: {
      offset: 0,
      tickLength: 0,
      title: {
        text: "Weeks",
      },
      labels: {
        formatter: function () {
          return this.pos + 1;
        },
      },
      plotLines: [
        {
          color: "orange",
          value: 9,
          width: 2,
          dashStyle: "Dash",
          label: {
            text: "First lockdown",
            // rotation: 90,
          },
        },
        {
          color: "orange",
          dashStyle: "Dash",
          value: 18,
          width: 2,
        },
        {
          color: "red",
          value: 44,
          width: 2,
          dashStyle: "Dash",
          label: {
            text: "Second lockdown",
            // rotation: 90,
          },
        },
        {
          color: "red",
          dashStyle: "Dash",
          value: 48,
          width: 2,
        },
      ],
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let tooltip =
          this.points.length > 1
            ? `2020: <b>${this.y}</b><br/>2015-19: <b>${this.points[1].point.low}-${this.points[1].point.high}</b>`
            : `2015-19: <b>${this.points[0].point.low}-${this.points[0].point.high}</b>`;
        return `<b>Week ${this.x + 1}</b><br/>${tooltip}`;
      },
    },
    legend: {
      enabled: false,
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

const PercentArea = ({ series }) => {
  const containerProps = {
    style: {
      width: "100%",
      height: "500px",
    },
  };

  const options = {
    chart: {
      type: "area",
      backgroundColor: "transparent",
    },
    title: {
      text: "Breakdown - Percent area",
    },
    plotOptions: {
      area: {
        stacking: "percent",
        lineColor: "#ffffff",
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: "#ffffff",
        },
        accessibility: {
          pointDescriptionFormatter: function (point) {
            function round(x) {
              return Math.round(x * 100) / 100;
            }
            return (
              point.index +
              1 +
              ", " +
              point.category +
              ", " +
              point.y +
              " millions, " +
              round(point.percentage) +
              "%, " +
              point.series.name
            );
          },
        },
      },
    },
    yAxis: {
      tickLength: 0,
      title: {
        text: null,
      },
      labels: {
        format: "{value}%",
      },
    },
    xAxis: {
      offset: 0,
      tickLength: 0,
      title: {
        text: "Weeks",
      },
      labels: {
        formatter: function () {
          return this.pos + 1;
        },
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b>',
      split: true,
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

export default Electricity;
