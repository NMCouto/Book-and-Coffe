import React from 'react';
import { useFilter } from '../context/ConteudoFiltro';

const BarraMensal: React.FC = () => {
  const { selectedMonth, setSelectedMonth, monthNames } = useFilter();

  return (
    <div className="small-sidebar">
      <nav>
        {monthNames.map((monthName, index) => (
          <button
            key={index}
            className={`month-btn-small ${selectedMonth === index ? 'active-month-small' : ''}`}
            onClick={() => setSelectedMonth(index)}
            title={monthName}
          >

            {monthName.substring(0, 3)}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BarraMensal;