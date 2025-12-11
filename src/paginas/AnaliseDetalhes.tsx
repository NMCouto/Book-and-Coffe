import React from 'react';
import SmallMonthSidebar from '../componentes/BarraMensal';
import BarraFiltrada from '../componentes/BarraFiltrada'; 
import { useFilter } from '../context/ConteudoFiltro';

const AnaliseDetalhes: React.FC = () => {
  const { selectedMonth, monthNames } = useFilter();
  const monthName = monthNames[selectedMonth];

  const pageTitle = `Detalhes da Análise em ${monthName}`;

  return (
    <div className="details-layout" role="main"> 
      

      <SmallMonthSidebar />
      
      <div className="details-content">
        <h2 className="titulo-pagina" aria-label={pageTitle}>
          {pageTitle}
        </h2>
        
        <div className="charts-container-details" aria-label="Gráficos de análise e dados detalhados">
            
            <BarraFiltrada />
        </div>
      </div>

    </div>
  );
};

export default AnaliseDetalhes;