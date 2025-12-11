import { NavLink } from 'react-router-dom';
import '../../styles/components/TopNavigation.css';

export function TopNavigation() {
  return (
    <div className="top-nav-container">
      <NavLink 
        to="/clientes" 
        className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}
      >
        Clientes
      </NavLink>

      <NavLink 
        to="/livros" 
        className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}
      >
        Livros
      </NavLink>

      <NavLink 
        to="/emprestimos" 
        className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}
      >
        Empréstimos
      </NavLink>
    </div>
  );
}