import { Link } from 'react-router-dom';
import '../styles/global.css'; // Ou crie um sidebar.css específico
//import '../styles/Sidebar.css'; // Se criar o CSS específico da sidebar

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/logocafe.png" alt="Logo" className="logo-img" />
        <h1 className="brand-name">Bookend coffee</h1>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">Início</Link>
          </li>
          <li>
            <Link to="/cadastro" className="nav-link">Cadastro</Link>
          </li>
          <li>
            <Link to="/emprestimo" className="nav-link">Empréstimo</Link>
          </li>
        </ul>

        <div className="nav-divider"></div>

        <ul className="nav-list">
          <li className="nav-group">
            <div className="group-header">
              <span>Quadros</span>
              <button className="btn-add">+</button>
            </div>
            <ul className="sub-list">
              <li>
                <Link to="/kanban" className="nav-link active-item">Quadro 1</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}