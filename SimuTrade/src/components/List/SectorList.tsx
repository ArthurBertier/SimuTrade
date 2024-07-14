import { useState, useEffect } from 'react';

interface SectorListProps {
  selectedIndustry: string;
}

interface Sector {
  name: string;
}

const SectorList: React.FC<SectorListProps> = ({ selectedIndustry }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    setSectors([
      { name: 'Sector 1' },
      { name: 'Sector 2' },
      { name: 'Sector 3' }
    ]);
  }, [selectedIndustry]);

  return (
    <div>
      <h2>Sectors in {selectedIndustry}</h2>
      {sectors.map(sector => (
        <div key={sector.name}>{sector.name}</div>
      ))}
    </div>
  );
};

export default SectorList;
