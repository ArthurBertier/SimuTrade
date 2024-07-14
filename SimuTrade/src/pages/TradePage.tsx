import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import ChartComponent from '../components/Chart/ChartComponent';
import { invoke } from '@tauri-apps/api';
import '../styles/tradePage.css';

type TradePageParams = {
  ticker: string;
};

type PriceDataDetails = {
  period: string;
  interval: string;
  closes: number[];
  opens: number[];
  highs: number[];
  lows: number[];
  volumes: number[];
  timestamps: number[];
};

type StockDetailsResponse = {
  ticker: string;
  price_data?: PriceDataDetails[];
};

const TradePage = () => {
  const { ticker } = useParams<TradePageParams>();
  const [stockDetail, setStockDetail] = useState<StockDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const [tradeType, setTradeType] = useState("quantity"); // "quantity" or "money"
  const [quantity, setQuantity] = useState(0);
  const [money, setMoney] = useState(0);
  const [position, setPosition] = useState("long");
  const [takeProfit, setTakeProfit] = useState<number | null>(null);
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState(10000); 
  const userId = localStorage.getItem('user_id'); 
  const navigate = useNavigate();

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
      const fetchedData: { price_data: PriceDataDetails[] } = await invoke('get_stock_periods', { ticker, period, interval });

      if (!Array.isArray(fetchedData.price_data)) {
        console.error('Fetched price_data is not an array:', fetchedData.price_data);
        setLoading(false);
        return;
      }

      const newData = fetchedData.price_data[0];

      setStockDetail(prevState => {
        if (!prevState) return null;
        return {
          ...prevState,
          price_data: prevState.price_data?.map((data, i) => 
            i === index ? newData : data
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

  const latestPrice = stockDetail?.price_data?.[selectedPeriodIndex]?.closes.slice(-1)[0] || 0;

  const handleTradeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTradeType(event.target.value);
    if (event.target.value === "quantity") {
      setQuantity(Math.floor(money / latestPrice));
    } else {
      setMoney(quantity * latestPrice);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.floor(Number(event.target.value));
    setQuantity(newQuantity);
    setMoney(newQuantity * latestPrice);
  };

  const handleMoneyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMoney = Number(event.target.value);
    setMoney(newMoney);
    setQuantity(Math.floor(newMoney / latestPrice));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tradeData = {
      ticker,
      position,
      quantity,
      price: latestPrice,
      takeProfit,
      stopLoss,
      trade_type: tradeType,
      money,
      user_id: userId, // Ensure this is included
      amount: tradeType === "quantity" ? quantity * latestPrice : money,
      user_balance: userBalance, // Ensure this is included
    };
    try {
      await invoke('submit_trade', { tradeData });
      alert('Trade submitted successfully!');
      navigate('/trade-history');
    } catch (error) {
      console.error('Error submitting trade:', error);
      alert('Failed to submit trade.');
    }
  };

  const calculateRR = () => {
    if (takeProfit !== null && stopLoss !== null) {
      const risk = Math.abs(latestPrice - stopLoss);
      const reward = Math.abs(takeProfit - latestPrice);
      return (reward / risk).toFixed(2);
    }
    return 'N/A';
  };

  if (loading) return <div>Loading...</div>;
  if (!stockDetail) return <div>No data available</div>;

  const priceData = stockDetail.price_data ? stockDetail.price_data[selectedPeriodIndex] : null;

  const chartData = priceData
    ? priceData.timestamps.map((timestamp, index) => ({
        label: new Date(timestamp * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        value: priceData.closes[index],
      }))
    : [];

  return (
    <>
      <Navbar />
      <div className="trade-page">
        <h2>{stockDetail.ticker} - Place a Trade</h2>
        <ChartComponent data={chartData} ticker={stockDetail.ticker} isPriceUp={true /* Set dynamically based on your data */} />
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
        <form className="trade-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="position">Position:</label>
            <select id="position" name="position" value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
          <div className="form-group">
            <label>Trade Type:</label>
            <div>
              <input type="radio" id="quantity" name="tradeType" value="quantity" checked={tradeType === "quantity"} onChange={handleTradeTypeChange} />
              <label htmlFor="quantity">Quantity</label>
              <input type="radio" id="money" name="tradeType" value="money" checked={tradeType === "money"} onChange={handleTradeTypeChange} />
              <label htmlFor="money">Money</label>
            </div>
          </div>
          {tradeType === "quantity" ? (
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input type="number" id="quantity" name="quantity" value={quantity} onChange={handleQuantityChange} />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="money">Money:</label>
              <input type="number" id="money" name="money" value={money} onChange={handleMoneyChange} />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="takeProfit">Take Profit:</label>
            <input type="number" id="takeProfit" name="takeProfit" value={takeProfit || ''} onChange={(e) => setTakeProfit(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label htmlFor="stopLoss">Stop Loss:</label>
            <input type="number" id="stopLoss" name="stopLoss" value={stopLoss || ''} onChange={(e) => setStopLoss(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Last Price:</label>
            <input type="number" value={latestPrice} readOnly style={{ backgroundColor: '#2B3A42', color: '#FFFFFF' }} />
          </div>
          <div className="form-group">
            <label>User Balance:</label>
            <input type="number" value={userBalance} readOnly style={{ backgroundColor: '#2B3A42', color: '#FFFFFF' }} />
          </div>
          <div className="form-group">
            <label>Risk-Reward Ratio:</label>
            <input type="text" value={calculateRR()} readOnly style={{ backgroundColor: '#2B3A42', color: '#FFFFFF' }} />
          </div>
          <div className="form-group">
            <label>Money Spent:</label>
            <input type="number" value={tradeType === "quantity" ? quantity * latestPrice : money} readOnly style={{ backgroundColor: '#2B3A42', color: '#FFFFFF' }} />
          </div>
          <div className="form-group">
            <button type="submit">Submit Trade</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TradePage;
