import React from 'react'
import Highcharts from 'highcharts/highmaps'
import HighchartsReact from 'highcharts-react-official'

window.Highcharts = Highcharts; //this line did the magic
export default _ => {

  const heatmapSeries = [
    {
      data: [[0,0,13.3],[1,0,13.9],[2,0,15.1],[3,0,17.3],[4,0,12.4],[5,0,13.7],[6,0,12.2],[7,0,11.4],[8,0,13.3],[9,0,13.2],[10,0,11.8],[11,0,13.1],[12,0,12.2],[13,0,11.7],[14,0,11.4],[15,0,10.6],[16,0,11.6],[17,0,11.4],[18,0,10.8],[19,0,10.9],[20,0,10.9],[21,0,10.6],[22,0,11.4],[23,0,11.6],[24,0,13],[25,0,12.5],[26,0,11.1],[27,0,12.2],[28,0,13.1],[29,0,12],[30,0,12.8],[31,0,13.7],[32,0,14.9],[33,0,13.7],[34,0,15.9],[35,0,17.2],[36,0,18.3],[37,0,18.2],[38,0,16.3],[39,0,14.9],[0,1,19.2],[1,1,20.9],[2,1,21.6],[3,1,23.7],[4,1,18.1],[5,1,18.9],[6,1,18.1],[7,1,17.6],[8,1,18],[9,1,18.7],[10,1,17.4],[11,1,16],[12,1,15.8],[13,1,16],[14,1,15.8],[15,1,14.8],[16,1,16.9],[17,1,15.3],[18,1,16.8],[19,1,17.9],[20,1,17.3],[21,1,19],[22,1,19.7],[23,1,21.6],[24,1,22.4],[25,1,22.5],[26,1,21],[27,1,24.7],[28,1,26],[29,1,24.9],[30,1,26.2],[31,1,24.7],[32,1,25.9],[33,1,22.8],[34,1,23.5],[35,1,21.7],[36,1,22.6],[37,1,24.4],[38,1,21.1],[39,1,18.6],[0,2,2.3],[1,2,2.3],[2,2,2.2],[3,2,2.4],[4,2,2.2],[5,2,2.2],[6,2,2.3],[7,2,2.2],[8,2,2.1],[9,2,2],[10,2,2.1],[11,2,2.2],[12,2,2.2],[13,2,2.1],[14,2,2.3],[15,2,2.2],[16,2,2.2],[17,2,2.3],[18,2,2.2],[19,2,2.2],[20,2,2.3],[21,2,2.3],[22,2,2.4],[23,2,2.3],[24,2,2.4],[25,2,2.4],[26,2,2.4],[27,2,2.4],[28,2,2.4],[29,2,2.4],[30,2,2.2],[31,2,2.2],[32,2,2.2],[33,2,2.2],[34,2,2.2],[35,2,2.2],[36,2,2.3],[37,2,2.3],[38,2,2.4],[39,2,2.2],[0,3,28.9],[1,3,26.7],[2,3,25.9],[3,3,25.7],[4,3,26.5],[5,3,26.1],[6,3,25.7],[7,3,25.4],[8,3,25.3],[9,3,25.7],[10,3,25.5],[11,3,26.2],[12,3,26],[13,3,27.2],[14,3,28.3],[15,3,26.9],[16,3,26.9],[17,3,26.8],[18,3,24.9],[19,3,24.1],[20,3,24.4],[21,3,24.7],[22,3,24.1],[23,3,23.2],[24,3,21.9],[25,3,20.5],[26,3,21.7],[27,3,22.6],[28,3,24],[29,3,23.2],[30,3,22.4],[31,3,23.1],[32,3,23.6],[33,3,23],[34,3,22.2],[35,3,22.4],[36,3,22.5],[37,3,22.8],[38,3,23.5],[39,3,24.1],[0,4,11.6],[1,4,11],[2,4,10.6],[3,4,11.4],[4,4,10.6],[5,4,11.7],[6,4,11.8],[7,4,11.9],[8,4,12.3],[9,4,13.1],[10,4,13.3],[11,4,13.8],[12,4,13],[13,4,12.3],[14,4,12.4],[15,4,13.6],[16,4,16.2],[17,4,15.3],[18,4,16],[19,4,16.6],[20,4,15.9],[21,4,14.6],[22,4,14.9],[23,4,16.1],[24,4,16.2],[25,4,15.1],[26,4,13.3],[27,4,13.1],[28,4,12.4],[29,4,11.8],[30,4,12.6],[31,4,12.9],[32,4,12.2],[33,4,11.2],[34,4,11.5],[35,4,11.5],[36,4,10.8],[37,4,9.6],[38,4,10.4],[39,4,10.9],[0,4,16.7],[1,4,17.7],[2,4,17.3],[3,4,12.6],[4,4,22.7],[5,4,19.1],[6,4,21.3],[7,4,22.4],[8,4,19.9],[9,4,18],[10,4,18.7],[11,4,16],[12,4,17.3],[13,4,15.8],[14,4,13.1],[15,4,16.1],[16,4,9.9],[17,4,13.2],[18,4,13.5],[19,4,13.1],[20,4,13],[21,4,11.3],[22,4,13.3],[23,4,10.7],[24,4,8.5],[25,4,11.3],[26,4,15.6],[27,4,9.8],[28,4,7.2],[29,4,10.5],[30,4,9.1],[31,4,8],[32,4,6.9],[33,4,13.1],[34,4,12],[35,4,11.3],[36,4,9.9],[37,4,10.3],[38,4,15.5],[39,4,19.8],[0,5,1.9],[1,5,1.8],[2,5,1.9],[3,5,1.6],[4,5,2.1],[5,5,3],[6,5,3],[7,5,3.4],[8,5,3.2],[9,5,3.6],[10,5,5.2],[11,5,6.3],[12,5,6.7],[13,5,8.3],[14,5,9.5],[15,5,8.9],[16,5,9.3],[17,5,8.6],[18,5,9.2],[19,5,8.8],[20,5,9.6],[21,5,11.1],[22,5,8],[23,5,8.2],[24,5,9.6],[25,5,9.7],[26,5,9.2],[27,5,9.3],[28,5,8.9],[29,5,9.1],[30,5,8.8],[31,5,9.5],[32,5,8.3],[33,5,8.3],[34,5,6.9],[35,5,8],[36,5,7.9],[37,5,6.5],[38,5,4.7],[39,5,4.5],[0,6,6.1],[1,6,5.6],[2,6,5.4],[3,6,5.2],[4,6,5.4],[5,6,5.3],[6,6,5.6],[7,6,5.7],[8,6,5.8],[9,6,5.7],[10,6,5.9],[11,6,6.5],[12,6,6.6],[13,6,6.6],[14,6,7.2],[15,6,6.9],[16,6,7],[17,6,7.1],[18,6,6.5],[19,6,6.4],[20,6,6.6],[21,6,6.5],[22,6,6.1],[23,6,6.1],[24,6,6],[25,6,5.9],[26,6,5.7],[27,6,5.9],[28,6,6],[29,6,6],[30,6,5.8],[31,6,5.8],[32,6,6.1],[33,6,5.9],[34,6,5.8],[35,6,5.8],[36,6,5.7],[37,6,5.9],[38,6,6.1],[39,6,5]],
      borderColor: 'black',
      borderWidth: .5,
    }
  ]

  const lineSeries = [
    {
      data: [53212,58191,59211,59873,56247,57751,56631,55862,56877,56429,53270,49170,47706,46570,42236,44105,43842,41347,44127,44967,43052,43477,44659,44580,45389,46853,46972,46584,46629,47223,47925,47813,46646,47169,48253, 48582, 49369, 48631, 47686, 47233]
    }
  ];

  const percentArea = [
    {
      name: 'Nuclear',
      data: [28.9,26.7,25.9,25.7,26.5,26.1,25.7,25.4,25.3,25.7,25.5,26.2,26,27.2,28.3,26.9,26.9,26.8,24.9,24.1,24.4,24.7,24.1,23.2,21.9,20.5,21.7,22.6,24,23.2,22.4,23.1,23.6,23,22.2,22.4,22.5,22.8,23.5,24.1]
    },
    {
      name: 'Coal',
      data: [13.9,15.1,17.3,12.4,13.7,12.2,11.4,13.3,13.2,11.8,13.1,12.2,11.7,11.4,10.6,11.6,11.4,10.8,10.9,10.9,10.6,11.4,11.6,13,12.5,11.1,12.2,13.1,12,12.8,13.7,14.9,13.7,15.9,17.2,18.3,18.2,16.3,14.9]
    }, 
    {
      name: 'Natural gas',
      data: [20.9,21.6,23.7,18.1,18.9,18.1,17.6,18,18.7,17.4,16,15.8,16,15.8,14.8,16.9,15.3,16.8,17.9,17.3,19,19.7,21.6,22.4,22.5,21,24.7,26,24.9,26.2,24.7,25.9,22.8,23.5,21.7,22.6,24.4,21.1,18.6]
    }, 
    {
      name: 'Others',
      data: [2.3,2.2,2.4,2.2,2.2,2.3,2.2,2.1,2,2.1,2.2,2.2,2.1,2.3,2.2,2.2,2.3,2.2,2.2,2.3,2.3,2.4,2.3,2.4,2.4,2.4,2.4,2.4,2.4,2.2,2.2,2.2,2.2,2.2,2.2,2.3,2.3,2.4,2.2]
    }, 
    {
      name: 'Hydro',
      data: [11.6,11,10.6,11.4,10.6,11.7,11.8,11.9,12.3,13.1,13.3,13.8,13,12.3,12.4,13.6,16.2,15.3,16,16.6,15.9,14.6,14.9,16.1,16.2,15.1,13.3,13.1,12.4,11.8,12.6,12.9,12.2,11.2,11.5,11.5,10.8,9.6,10.4,10.9]
    }, 
    {
      name: 'Wind',
      data: [16.7,17.7,17.3,12.6,22.7,19.1,21.3,22.4,19.9,18,18.7,16,17.3,15.8,13.1,16.1,9.9,13.2,13.5,13.1,13,11.3,13.3,10.7,8.5,11.3,15.6,9.8,7.2,10.5,9.1,8,6.9,13.1,12,11.3,9.9,10.3,15.5,19.8]
    }, 
    {
      name: 'Solar',
      data: [1.9,1.8,1.9,1.6,2.1,3,3,3.4,3.2,3.6,5.2,6.3,6.7,8.3,9.5,8.9,9.3,8.6,9.2,8.8,9.6,11.1,8,8.2,9.6,9.7,9.2,9.3,8.9,9.1,8.8,9.5,8.3,8.3,6.9,8,7.9,6.5,4.7,4.5]
    }, 
    {
      name: 'Other Res',
      data: [6.1,5.6,5.4,5.2,5.4,5.3,5.6,5.7,5.8,5.7,5.9,6.5,6.6,6.6,7.2,6.9,7,7.1,6.5,6.4,6.6,6.5,6.1,6.1,6,5.9,5.7,5.9,6,6,5.8,5.8,6.1,5.9,5.8,5.8,5.7,5.9,6.1,5]
    }, 
  ]

  return (
    <div>
      <div>
        <LineChart series={lineSeries} />      
        <Heatmap series={heatmapSeries} />      
        <PercentArea series={percentArea} />      
      </div>
    </div>
  )
}

const LineChart = ({ series }) => {
  const containerProps = {
    style: {
      width: '97%',
      margin: 'auto'
    }
  };

  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Total generated energy within last 40 weeks and breakdown'
    },
    yAxis: { 
      tickLength: 0,
      title: {
        text: 'Total energy generation'
      },
    },
    xAxis: {
      offset: 0,
      tickLength: 0,
      title: {
        text: 'Weeks'
      },
      labels: {
        formatter: function() {
          return this.pos + 1
        }
      }
    },
    tooltip: {
      formatter: function () {
        return `
          <b> Week ${this.point.x + 1}</b><br/>
          ${this.point.y}
        `
      }
    },
    legend:{
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: series
  };

  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  );
}

const Heatmap = ({ series }) => {
  const xAxisLabels = ['Coal','Natural gas', 'Others','Nuclear','Hydro','Wind','Solar','Other RES'];
  const  getEnergyFromLabel = y => xAxisLabels[y];
  const containerProps = {
    style: {
      width: '100%',
    }
  };

  const options = {
    chart: {
      type: 'heatmap',
      backgroundColor: 'transparent',
    },
    title: {
      text: 'Breakdown - Heatmap'
    },
    boost: {
      useGPUTranslations: true,
    },
    yAxis: { 
      categories: xAxisLabels,
      tickLength: 0,
      title: {
        text: null
      },
    },
    xAxis: {
      offset: 0,
      tickLength: 0,
      title: {
        text: 'Weeks'
      },
      labels: {
        formatter: function() {
          return this.pos + 1
        }
    }

    },
    colorAxis: {
      minColor: '#fff',
      maxColor: '#002999',
      startOnTick: false,
      endOnTick: false,
      labels: {
        format: '{value}%'
      }
    },
    tooltip: {
      formatter: function () {
        return `
          <b>${getEnergyFromLabel(this.point.y)}</b><br/>
          Week ${this.point.x + 1}<br/>
          ${this.point.value +'%'}
        `
      }
    },
    credits: {
      enabled: false
    },
    series: series
  };

  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  );
}

const PercentArea = ({ series }) => {
  // const xAxisLabels = ['Coal','Natural gas', 'Others','Nuclear','Hydro','Wind','Solar','Other RES'];
  // const  getEnergyFromLabel = y => xAxisLabels[y];
  const containerProps = {
    style: {
      width: '100%',
    }
  };

  const options = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
    },
    title: {
      text: 'Breakdown - Percent area'
    },
    plotOptions: {
      area: {
          stacking: 'percent',
          lineColor: '#ffffff',
          lineWidth: 1,
          marker: {
              lineWidth: 1,
              lineColor: '#ffffff'
          },
          accessibility: {
              pointDescriptionFormatter: function (point) {
                  function round(x) {
                      return Math.round(x * 100) / 100;
                  }
                  return (point.index + 1) + ', ' + point.category + ', ' +
                      point.y + ' millions, ' + round(point.percentage) + '%, ' +
                      point.series.name;
              }
          }
      }
    },
    yAxis: { 
      tickLength: 0,
      title: {
        text: null
      },
      labels: {
        format: '{value}%'
      }
    },
    xAxis: {
      offset: 0,
      tickLength: 0,
      title: {
        text: 'Weeks'
      },
      labels: {
        formatter: function() {
          return this.pos + 1
        }
      }
    },
    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b>',
      split: true
    },
    credits: {
      enabled: false
    },
    series: series
  };

  return (
    <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      containerProps={containerProps}
    />
  );
}