import React, { useState } from 'react';

const TradeForm: React.FC = () => {
  const [price, setPrice] = useState(326.15);
  const [amount, setAmount] = useState(15);
  const [stop, setStop] = useState(1500);
  const [limit, setLimit] = useState(325.15);
  const [tp1, setTp1] = useState(328.54);
  const [tp2, setTp2] = useState(335.50);

  const total = price * amount;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="trade-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Price ($):</label>
          <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Stop ($):</label>
          <input type="number" value={stop} onChange={(e) => setStop(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Limit ($):</label>
          <input type="number" value={limit} onChange={(e) => setLimit(parseFloat(e.target.value))} />
        </div>
        <div className="form-group total">
          <label>Total ($):</label>
          <input type="number" value={total.toFixed(2)} readOnly />
        </div>
        <div className="trade-buttons">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
