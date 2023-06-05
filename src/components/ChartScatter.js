import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Scatter } from 'react-chartjs-2';
import chartTrendline from 'chartjs-plugin-trendline';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin,chartTrendline, );


function ChartScatter ({dataArray, errorAccept,offArray, label1, label2, label3,titleX,titleY,bounds}) {

  const options = {
    plugins: {
      autocolors: false,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: bounds[0],
            yMax: bounds[1],
            borderColor: 'lightgreen',
            borderWidth: 2,
          }
        }
      }
    },
    
    scales: {
      y: {
        title: {
          display:true,
          text:titleY
        },
        min: bounds[2],
        max: bounds[3],},
      x: {
        title: {
          display:true,
          text:titleX
        },
        min: bounds[0],
        max: bounds[1],
      }
    },
  };

  const data = {
    datasets: [
      {
        label: label2,
        backgroundColor:'rgba(144,238,144,1)',
        data: errorAccept
      },
      {
        label: label1,
        backgroundColor:'lightgray',
        data: dataArray,
        trendlineLinear: {
          lineStyle: "dotted",
          width: 2
      }
      },
      {
        label: label3,
        backgroundColor:'red',
        data: offArray
      },
    ],
  };
  return (
    <Scatter options={options} data={data} />
  )}
    
export default ChartScatter

  
