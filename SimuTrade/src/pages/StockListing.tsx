import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IndustryList from '../components/List/IndustryList';
import SectorList from '../components/List/SectorList';
import Navbar from '../components/Navbar/Navbar';
import { invoke } from '@tauri-apps/api';
import '../styles/stockListing.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { XAxis } from 'recharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const stockListingPage = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [stockList, setStockList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0);  

  const handleIndustrySelect = async (industry: string) => {
    setSelectedIndustry(industry);
    fetchStocks(industry, 1);  
  };

  const fetchStocks = async (industry: string, page: number) => {
    try {
      const response: any = await invoke('get_stocks_list', {
        payload: {
          user_id: localStorage.getItem("user_id"),
          sector: industry, 
          page: page,
          items_per_page: 100
        }
      });
      setStockList(response.documents);
      setTotalPages(response.totalPages); 
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handlePageChange = (page: number) => {
    fetchStocks(selectedIndustry!, page);  
  };

  const navigateToStockDetail = (ticker: String) => {
    navigate(`/stock-detail/${ticker}`);
  };
  const prepareChartData = (stock) => {
    const labels = stock.price_data.map(data => new Date(data.date).toLocaleDateString());
    const dataPoints = stock.price_data.map(data => data.price);
  
    const isPriceUp = dataPoints[0] < dataPoints[dataPoints.length - 1];
  
    const data = {
      labels,
      datasets: [
        {
          label: `${stock.ticker} Price`,
          data: dataPoints,
          borderColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)',
          backgroundColor: isPriceUp ? 'rgba(40, 167, 69, 0.5)' : 'rgba(220, 53, 69, 0.5)', 
          borderWidth: 2,
          pointBackgroundColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)',
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: isPriceUp ? 'rgb(40, 167, 69)' : 'rgb(220, 53, 69)'
        }
      ]
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
            precision: 0
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "white",
            autoSkip: true,
            maxRotation: 0,
            maxTicksLimit: 6
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "white"
          }
        }
      }
    };
  
    return { data, options };
  };
  
  
  
  
  
  return (
    <div>
      <Navbar />
      <div className='Box'>
        <div className='SideBar'>
          <h1>Filter by industry</h1>
          <IndustryList onIndustrySelect={handleIndustrySelect} />
          {selectedIndustry && (
            <div>
            </div>
          )}
        </div>
        <div className='MainContent'>
          <div className='Top'>
            <h1>Discover new <span>performing</span> stock</h1>
          </div>
          <div className='Bottom'>
            <h1>Stocks listing</h1>
            {stockList.map((stock, index) => (
              <div className='StockList' key={index} onClick={() => navigateToStockDetail(stock.ticker)}>
    <div className='StockHeader'>
    <span className='Ticker'>{stock.ticker}</span>
      <span className='CompanyName'>{stock.name}</span>
    </div>
    <div className='StockInfo'>
      <span className='LastPrice'>Last Price: ${stock.price_data.slice(-1)[0]?.price.toFixed(2) ?? 'N/A'}</span>
      <span className={`Change ${stock.price_data[0]?.price < stock.price_data.slice(-1)[0]?.price ? 'up' : 'down'}`}>
        {stock.price_data[0] && stock.price_data.slice(-1)[0] ? 
          (((stock.price_data.slice(-1)[0].price - stock.price_data[0].price) / stock.price_data[0].price) * 100).toFixed(2) + '%' : 
          'N/A'}
      </span>
    </div>
    <div className='ChartContainer'>
    <Line {...prepareChartData(stock)} />

    </div>
  </div>
))}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} disabled={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default stockListingPage;
