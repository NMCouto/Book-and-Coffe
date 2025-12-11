import React from 'react';
import SmallMonthSidebar from '../componentes/SmallMonthSidebar';
import BarraFiltrada from '../componentes/BarraFiltrada'; // Importa o gráfico filtrável
import { useFilter } from '../context/FilterContext';

const AnaliseDetalhes: React.FC = () => {
  const { selectedMonth, monthNames } = useFilter();
  const monthName = monthNames[selectedMonth];

  return (
    <div className="details-layout">
      
      {/* 1. A barra lateral de seleção de meses (Mês 1) */}
      <SmallMonthSidebar />
      
      {/* 2. O conteúdo principal da página (Mês 2) */}
      <div className="details-content">
        <h2 className="titulo-pagina">Detalhes da Análise em {monthName}</h2>
        
        {/* Container para organizar os gráficos (pode usar flexbox se tiver mais de um) */}
        <div className="charts-container-details">
            
            {/* ✅ GRÁFICO 1: Agora filtrado pelo mês selecionado na sidebar */}
            <BarraFiltrada />
        </div>
      </div>

    </div>
  );
};

export default AnaliseDetalhes;