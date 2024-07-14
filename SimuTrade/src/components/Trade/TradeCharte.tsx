import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, BarChart, Bar
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface StockData {
  Datetime: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

const TradeChart: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [interval, setInterval] = useState('1m');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any[] = await invoke('get_stocks'); // Type as any to handle complex nested objects
        const formattedResult = result.map(stock => {
          const { Datetime, ...rest } = stock;
          let isoDate = ''; // Default blank date
          if (Datetime && Datetime.$date && Datetime.$date.$numberLong) {
            const timestamp = parseInt(Datetime.$date.$numberLong, 10);
            if (!isNaN(timestamp)) {
              isoDate = new Date(timestamp).toISOString();
            } else {
              console.error('Invalid timestamp:', Datetime.$date.$numberLong);
            }
          } else {
            console.error('Date format is incorrect or missing');
          }
          return { ...rest, Datetime: isoDate };
        });
        setData(formattedResult);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
  }, []);

  const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(event.target.value);
  };

  const formatXAxis = (tickItem: string) => {
    return format(parseISO(tickItem), 'MM/dd HH:mm');
  };

  return (
    <div className="trade-chart">
      <div className="chart-controls">
        <label htmlFor="interval">Interval: </label>
        <select id="interval" value={interval} onChange={handleIntervalChange}>
          <option value="1m">1 Minute</option>
          <option value="5m">5 Minutes</option>
          <option value="30m">30 Minutes</option>
          <option value="3h">3 Hours</option>
          <option value="12h">12 Hours</option>
          <option value="1d">1 Day</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Datetime" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Close" stroke="#8884d8" />
          <Brush dataKey="Datetime" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data}>
          <XAxis dataKey="Datetime" tickFormatter={formatXAxis} />
          <Tooltip />
          <Bar dataKey="Volume" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradeChart;
