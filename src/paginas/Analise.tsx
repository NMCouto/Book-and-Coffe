import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
// import BarChart from '../components/BarChart'; // Assumindo que este componente existe e está correto

const Analise: React.FC = () => {
  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Diagnóstico mensal</h2>

      {/* Cards de métrica */}
      <div className="cards-container">
        <div className="card-metric">
          <span>Total de Empréstimos</span>
          <div className="card-number">
          <strong>15.452</strong>
          <span className="up"><ArrowUp size={16} /> +12%</span>
          </div>
        </div>
        
        <div className="card-metric">
          <span>Clientes Ativos</span>
          <div className="card-number">
          <strong>3.270</strong>
          <span className="up"><ArrowUp size={16} /> +8%</span>
        </div>
        </div>

        <div className="card-metric">
          <span>Novos clientes</span>
          <div className="card-number">
          <strong>1.374</strong>
          <span className="up"><ArrowUp size={16} /> +23%</span>
        </div>
        </div>
      </div>
      
      {/* Aqui ficaria o BarChart / Gráfico de Pizza, etc. */}
      {/* <BarChart /> */}

      {/* Botão de navegação para a página de detalhes */}
      <div className="button-details">
        <Link to="/analiseDetalhes"> 
          <button> Ver detalhes</button>
        </Link>
      </div>
    </div>
  );
};

export default Analise;