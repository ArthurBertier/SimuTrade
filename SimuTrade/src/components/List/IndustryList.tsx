import { useState } from 'react';

interface IndustryListProps {
  onIndustrySelect: (industry: string) => void;
}

enum Industry {
  BasicMaterials = "Basic Materials",
  FinancialServices = "Financial Services",
  Industrials = "Industrials",
  Healthcare = "Healthcare",
  ConsumerCyclical = "Consumer Cyclical",
  Technology = "Technology",
  ConsumerDefensive = "Consumer Defensive",
  Energy = "Energy",
  RealEstate = "Real Estate",
  CommunicationServices = "Communication Services",
  Utilities = "Utilities"
}

const IndustryList: React.FC<IndustryListProps> = ({ onIndustrySelect }) => {
    const [industries] = useState<Industry[]>(Object.values(Industry));
    const [selectedIndustry, setSelectedIndustry] = useState<Industry>(Industry.Technology);

    const handleSelect = (industry: Industry) => {
        setSelectedIndustry(industry);
        onIndustrySelect(industry);
    };

    return (
        <div className='button-container'>
            {industries.map(industry => (
                <button
                    className={`sector-button ${industry === selectedIndustry ? 'selected' : ''}`}
                    key={industry}
                    onClick={() => handleSelect(industry)}
                >
                    {industry}
                </button>
            ))}
        </div>
    );
};

export default IndustryList;
