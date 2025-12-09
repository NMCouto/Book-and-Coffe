import { Home, Users, BarChart3 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
          <Home size={24} />
          <span>Cadastro</span>
        </NavLink>
        <NavLink to="/analise" className={({isActive}) => isActive ? 'active' : ''}>
          <BarChart3 size={24} />
          <span>Análise</span>
        </NavLink>
      </nav>
    </aside>
  )
}