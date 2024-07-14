import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartData = {
  label: string;
  value: number;
};

type ChartComponentProps = {
  data: ChartData[];
  ticker: string;
  isPriceUp: boolean;
};

const ChartComponent: React.FC<ChartComponentProps> = ({ data, ticker, isPriceUp }) => {
  const labels = data.map(item => item.label);
  const dataPoints = data.map(item => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${ticker} Price`,
        data: dataPoints,
        borderColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)',
        backgroundColor: isPriceUp ? 'rgba(40, 167, 69, 0.5)' : 'rgba(220, 53, 69, 0.5)', 
        borderWidth: 2,
        pointBackgroundColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          borderColor: "white",
          color: "rgba(255, 255, 255, 0.1)",
          borderDash: [5, 5],
        },
        ticks: {
          color: "white",
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
          autoSkip: true,
          maxRotation: 0,
          maxTicksLimit: 6,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
