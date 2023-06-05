import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({dataArray}) {
  const data = {
    labels: ['% Below Error Acceptance', '% Within Error Acceptance', '% Above Error Acceptance', '> 500% error'],
    datasets: [
      {
        data: dataArray,
        backgroundColor: [
          'rgba(173,216,230,0.4)',
          'rgba(11,156,49,0.3)',
          'rgba(173,216,230,0.7)',
          'red'
        ],
        borderColor: [
          'rgba(173,216,230,1)',
          'rgba(75, 192, 192, 1)',
          'rgba(173,216,230,1)',
          'red'
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Doughnut data={data} />;
}

export default DoughnutChart
