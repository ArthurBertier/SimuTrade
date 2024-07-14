import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import StockListingPage from './pages/StockListing';
import StockDetailPage from './pages/StockDetails';
import TradePage from './pages/TradePage';
import TradeHistoryPage from './pages/TradeHistoryPage';


import "./styles/global.css";  


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/stock-listing" element={<StockListingPage />} />
        <Route path="/stock-detail/:ticker" element={<StockDetailPage />} />
        <Route path="/trade/:ticker" element={<TradePage />} /> 
        <Route path="/trade-history" element={<TradeHistoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
