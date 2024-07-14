import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { invoke } from '@tauri-apps/api';
import ChartComponent from '../components/Chart/ChartComponent';
import CompanyData from '../components/Stock/CompanyData';
import '../styles/stockDetails.css';

type Profile = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  industry?: string;
  sector?: string;
  longBusinessSummary?: string;
};

type Financials = {
  marketCap?: { fmt: string; raw: number };
  volume?: { fmt: string; raw: number };
};

type PriceDataDetails = {
  period: string;
  interval: string;
  closes: number[];
  timestamps: string[];
};

type StockDetailsResponse = {
  ticker: string;
  financials?: Financials;
  key_statistics?: any; // Define more specifically if needed
  price_data?: PriceDataDetails[];
  profile?: Profile;
};

const StockDetailPage = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [stockDetail, setStockDetail] = useState<StockDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const detail: StockDetailsResponse = await invoke('get_stock_detail', { ticker });
        setStockDetail(detail);
      } catch (error) {
        console.error('Error fetching stock detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [ticker]);

  const fetchFreshData = async (index: number) => {
    if (!stockDetail?.price_data?.[index]) return;
    const { period, interval } = stockDetail.price_data[index];
    setLoading(true);
    try {
      const fetchedData: any = await invoke('get_stock_periods', { ticker, period, interval });
  
      if (!Array.isArray(fetchedData.price_data)) {
        console.error('Fetched price_data is not an array:', fetchedData.price_data);
        setLoading(false);
        return;
      }
  
      setStockDetail(prevState => {
        if (!prevState) return null;
        return {
          ...prevState,
          price_data: prevState.price_data?.map((data, i) => 
            i === index ? fetchedData.price_data[0] : data
          ),
        };
      });
  
      setSelectedPeriodIndex(index);
    } catch (error) {
      console.error('Error fetching stock detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!stockDetail) return <div>No data available</div>;

  const priceData = stockDetail.price_data ? stockDetail.price_data[selectedPeriodIndex] : null;

  const chartData = priceData
    ? priceData.timestamps.map((timestamp, index) => ({
        label: new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        value: priceData.closes[index],
      }))
    : [];

  const companyData = {
    sector: stockDetail.profile?.sector || 'N/A',
    industry: stockDetail.profile?.industry || 'N/A',
    orders: [], // Placeholder for orders
    marketCap: stockDetail.financials?.marketCap?.fmt || 'N/A',
    volume: stockDetail.financials?.volume?.fmt || 'N/A',
    longBusinessSummary: stockDetail.profile?.longBusinessSummary || 'N/A',
  };

  const percentageChange = priceData
    ? ((priceData.closes[priceData.closes.length - 1] - priceData.closes[0]) / priceData.closes[0]) * 100
    : 0;

  const isPriceUp = percentageChange >= 0;

  return (
    <>
      <Navbar />
      <div className="stock-detail-page">
        <div className="stock-header">
          <h2>{stockDetail.ticker}</h2>
          <p>
            {priceData?.closes[priceData.closes.length - 1]} USD
            <span className={isPriceUp ? 'positive-change' : 'negative-change'}>
              ({percentageChange.toFixed(2)}%)
            </span>
          </p>
        </div>
        <ChartComponent data={chartData} ticker={stockDetail.ticker} isPriceUp={isPriceUp} />
        <div className="period-selector">
          {stockDetail.price_data && stockDetail.price_data.map((data, index) => (
            <button
              key={index}
              className={index === selectedPeriodIndex ? 'selected' : ''}
              onClick={() => fetchFreshData(index)}
            >
              {data.period} ({data.interval})
            </button>
          ))}
        </div>
        <CompanyData data={companyData} />
        <button onClick={() => navigate(`/trade/${stockDetail.ticker}`)} className="trade-button">
          Place a Trade
        </button>
      </div>
    </>
  );
};

export default StockDetailPage;
