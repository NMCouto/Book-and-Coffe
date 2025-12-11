import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';


const Analise: React.FC = () => {
  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Diagnóstico mensal</h2>

      <div className="cards-container">
        
        {/* CARD 1: Total de Empréstimos */}
        <div className="card-metric">
          <span>Total de Empréstimos</span>
          <div className="card-number" 
               aria-label="Total de empréstimos, 15 mil 452."
          >
            <strong>15.452</strong>
            <span className="up" aria-live="polite" aria-label="Aumento de 12 por cento">
              <ArrowUp size={16} /> +12%
            </span>
          </div>
        </div>
        
        {/* CARD 2: Clientes Ativos */}
        <div className="card-metric">
          <span>Clientes Ativos</span>
          <div className="card-number" 
               aria-label="Clientes Ativos, 3 mil 270."
          >
            <strong>3.270</strong>
            <span className="up" aria-live="polite" aria-label="Aumento de 8 por cento">
              <ArrowUp size={16} /> +8%
            </span>
          </div>
        </div>

        {/* CARD 3: Novos Clientes */}
        <div className="card-metric">
          <span>Novos clientes</span>
          <div className="card-number"
               aria-label="Novos clientes, 1 mil 374."
          >
            <strong>1.374</strong>
            <span className="up" aria-live="polite" aria-label="Aumento de 23 por cento">
              <ArrowUp size={16} /> +23%
            </span>
          </div>
        </div>
      </div>


      <div className="button-details">
        <Link to="/analiseDetalhes"> 
          <button 
            title="Acessar gráficos e tabelas detalhadas, incluindo filtros por mês."
          > 
            Ver detalhes
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Analise;