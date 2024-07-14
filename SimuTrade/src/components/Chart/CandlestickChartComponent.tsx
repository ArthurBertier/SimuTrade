// import React, { useEffect, useRef } from 'react';
// import { Chart as ChartJS, registerables, ChartOptions, ChartData } from 'chart.js';
// import { Chart } from 'react-chartjs-2';
// import 'chartjs-chart-financial';
// import { CategoryScale, LinearScale, Title, Tooltip, Legend, TimeScale, Chart as ChartJSNamespace } from 'chart.js';
// import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// import 'chartjs-adapter-date-fns';

// // Register the necessary components with ChartJS
// ChartJS.register(
//   ...registerables,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   TimeScale,
//   CandlestickController,
//   CandlestickElement
// );

// type CandlestickData = {
//   x: Date;
//   o: number;
//   h: number;
//   l: number;
//   c: number;
// };

// type CandlestickChartComponentProps = {
//   data: CandlestickData[];
//   ticker: string;
//   isPriceUp: boolean;
// };

// const CandlestickChartComponent: React.FC<CandlestickChartComponentProps> = ({ data, ticker, isPriceUp }) => {
//   const chartRef = useRef<ChartJS<'candlestick'>>(null);

//   const chartData: ChartData<'candlestick', CandlestickData[], unknown> = {
//     datasets: [
//       {
//         label: `${ticker} Candlestick`,
//         data: data,
//         borderColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options: ChartOptions<'candlestick'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         type: 'time',
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: 'white',
//           autoSkip: true,
//           maxRotation: 0,
//           maxTicksLimit: 6,
//         },
//       },
//       y: {
//         beginAtZero: false,
//         grid: {
//           borderColor: 'white',
//           color: 'rgba(255, 255, 255, 0.1)',
//           borderDash: [5, 5],
//         },
//         ticks: {
//           color: 'white',
//           precision: 0,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: true,
//         labels: {
//           color: 'white',
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label(ctx) {
//             const { o, h, l, c } = ctx.raw as CandlestickData;
//             return `O: ${o} H: ${h} L: ${l} C: ${c}`;
//           }
//         }
//       }
//     },
//   };

//   useEffect(() => {
//     const chart = chartRef.current;
//     return () => {
//       if (chart) {
//         chart.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div style={{ height: '400px', width: '100%' }}>
//       <Chart ref={chartRef} type="candlestick" data={chartData} options={options} />
//     </div>
//   );
// };

// export default CandlestickChartComponent;
