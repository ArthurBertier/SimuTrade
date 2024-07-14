import Navbar from '../components/Navbar/Navbar';
import React from 'react';
import TradeTracking from "../components/Trade/TradeTracking"

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar /> 
      <TradeTracking />
    </div>
  );
};

export default HomePage;
