import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { List } from 'phosphor-react'; // Ícone do menu (Hambúrguer)

// Componentes
import { Sidebar } from './components/Sidebar';

// Páginas
import { Login } from './pages/login'; 
import { Clientes } from './pages/clientes';
import { Kanban } from './pages/kanban';

function LayoutComSidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="content-area">
        
        {/* 1. CABEÇALHO (TOPO) */}
        <header className="top-bar">
          <div className="top-bar-left">
            {/* Botão Hambúrguer Limpo */}
            <button 
              className="menu-trigger" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <List size={32} />
            </button>

            {/* ÁREA DA MARCA */}
            <div className="header-brand">
              <img 
                src="/assets/logocafe.png" 
                alt="Logo Bookend" 
                className="header-logo-img" 
              />
              <span className="header-brand-name">
                Book and coffe
              </span>
            </div>

          </div>
        </header>

        {/* 2. ONDE ENTRAM AS TELAS (Clientes, Kanban, etc) */}
        <main className="page-content">
          {children}
        </main>
        
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/kanban" element={
          <LayoutComSidebar>
            <Kanban />
          </LayoutComSidebar>
        } />
        
        <Route path="/clientes" element={
          <LayoutComSidebar>
            <Clientes />
          </LayoutComSidebar>
        } />
        
      </Routes>
    </BrowserRouter>
  )
}