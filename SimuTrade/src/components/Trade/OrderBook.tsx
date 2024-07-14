import React from 'react';

const supplyData = [
  { amount: 148288, price: 317.7 },
  { amount: 138288, price: 317.7 },
  // Add more data points here
];

const demandData = [
  { amount: 148288, price: 317.9 },
  { amount: 138288, price: 318.7 },
  // Add more data points here
];

const OrderBook: React.FC = () => {
  return (
    <div className="order-book">
      <div className="supply">
        <h3>Supply</h3>
        <ul>
          {supplyData.map((item, index) => (
            <li key={index}>{item.amount} @ {item.price}</li>
          ))}
        </ul>
      </div>
      <div className="demand">
        <h3>Demand</h3>
        <ul>
          {demandData.map((item, index) => (
            <li key={index}>{item.amount} @ {item.price}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderBook;
