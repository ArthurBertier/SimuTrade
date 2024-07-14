import React from 'react';

type CompanyDataProps = {
  sector: string;
  industry: string;
  orders: any[]; // Define more specifically if needed
  marketCap: string;
  volume: string;
  longBusinessSummary: string;
};

const CompanyData: React.FC<{ data: CompanyDataProps }> = ({ data }) => {
  return (
    <div className="company-data">
      <div className="sector">
        <h3>Sector</h3>
        <p>{data.sector}</p>
        <h3>Industry</h3>
        <p>{data.industry}</p>
      </div>
      <div className="orders">
        <h3>Orders ({data.orders.length})</h3>
      </div>
      <div className="market-statistics">
        <h3>Market Statistics</h3>
        <p>Market cap: {data.marketCap}</p>
        <p>Volume: {data.volume}</p>
      </div>
      <div className="business-summary">
        <h3>Business Summary</h3>
        <p>{data.longBusinessSummary}</p>
      </div>
    </div>
  );
};

export default CompanyData;
