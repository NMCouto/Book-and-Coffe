import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom';
export default function Analise() {
  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Diagnóstico mensal</h2>

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

      <div className="fotoGrafico">
        <img src="./src/assets/pngegg.png" alt="foto" />
      </div>

    <div className="button-details">
<Link to="/analiseDetalhes">
      <button> Ver detalhes</button>
      </Link>
    </div>





    </div>
  )
}