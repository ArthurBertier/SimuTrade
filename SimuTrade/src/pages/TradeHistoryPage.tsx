import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import Navbar from '../components/Navbar/Navbar';
// import '../styles/tradeHistoryPage.css';

type Trade = {
  id: string;
  ticker: string;
  position: string;
  quantity: number;
  price: number;
  take_profit: number | null;
  stop_loss: number | null;
  status: string;
  amount: number;
  trade_type: string;
};

const TradeHistoryPage: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filter, setFilter] = useState<string>('Ongoing');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const fetchedTrades: Trade[] = await invoke('get_user_trades', { userId: localStorage.getItem('user_id')
        }); 
        setTrades(fetchedTrades);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchTrades();
  }, []);

  const filteredTrades = trades.filter(trade => trade.status === filter);

  return (
    <>
      <Navbar />
      <div className="trade-history-page">
        <h2>Trade History</h2>
        <div className="filter-buttons">
          {['Ongoing', 'Closed', 'Lost', 'Win'].map(status => (
            <button
              key={status}
              className={filter === status ? 'selected' : ''}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="trade-list">
          {filteredTrades.map(trade => (
            <div key={trade.id} className="trade-item">
              <p>Ticker: {trade.ticker}</p>
              <p>Position: {trade.position}</p>
              <p>Quantity: {trade.quantity}</p>
              <p>Price: {trade.price}</p>
              <p>Take Profit: {trade.take_profit}</p>
              <p>Stop Loss: {trade.stop_loss}</p>
              <p>Status: {trade.status}</p>
              <p>Amount: {trade.amount}</p>
              <p>Trade Type: {trade.trade_type}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TradeHistoryPage;
