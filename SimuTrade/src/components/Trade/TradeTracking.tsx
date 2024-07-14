import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Trade } from '../../type';
import { useUser } from '../../Contexte/UsersContexte';
import '../../styles/tradeTracking.css';

const TradeTracking = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    const fetchTrades = async () => {
      if (userId) {
        const tradesData: Trade[] = await invoke('get_tracking_trades', { userId: userId });
        setTrades(tradesData);
      }
    };

    fetchTrades();
  }, [userId]);

  return (
    <div className="trade-tracking">
      <h2>Trade Tracking</h2>
      <ul>
        <li className="trade-header">
          <span>Stock</span>
          <span>Position</span>
          <span>Size ($)</span>
          <span>Entry Price ($)</span>
          <span>Stop Loss ($)</span>
          <span>Current Price ($)</span>
          <span>PnL ($)</span>
        </li>
        {trades.map((trade, index) => (
          <li key={index} className="trade-item">
            <span>{trade.stock}</span>
            <span>{trade.position}</span>
            <span>{trade.size}</span>
            <span>{trade.entry}</span>
            <span>{trade.stop_loss}</span>
            <span>{trade.price}</span>
            <span>{trade.pnl >= 0 ? `+${trade.pnl}` : `-${trade.pnl}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradeTracking;
