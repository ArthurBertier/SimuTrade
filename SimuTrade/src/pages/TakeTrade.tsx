import React from 'react';
import TradeChart from '../components/Trade/TradeCharte';
import TradeForm from '../components/Trade/TradeForm';
import OrderBook from '../components/Trade/OrderBook';
import '../styles/takeTrade.css';

const TakeTradePage: React.FC = () => {
  return (
    <div className="take-trade-page">
      <div className="trade-header">
        <div className="stock-info">
          <h2>APPL</h2>
          <h3>326,15$ - <span className="percentage">0,79%</span></h3>
        </div>
      </div>
      <TradeChart />
      <OrderBook />
      <TradeForm />
    </div>
  );
};

export default TakeTradePage;
