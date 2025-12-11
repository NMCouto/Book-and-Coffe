import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { List } from 'phosphor-react'; // Ícone do menu (Hambúrguer)
import './App.css';

// Componentes
import { Sidebar } from './components/ui/Sidebar';

// Páginas
import { Login } from './pages/login'; 
import { Clientes } from './pages/clientes';
import { Livros } from './pages/livros';
import { Emprestimos } from './pages/emprestimos';
import { BoardPage } from './pages/Quadros/BoardPage';
import { BoardProvider } from './contexts/BoardContext';

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
    <BoardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/inicio" element={<Navigate to="/quadros/operacional" replace />} />

          <Route path="/quadros/:boardId" element={
            <LayoutComSidebar>
              <BoardPage />
            </LayoutComSidebar>
          } />
          
          <Route path="/clientes" element={
            <LayoutComSidebar>
              <Clientes />
            </LayoutComSidebar>
          } />

          <Route path="/livros" element={
            <LayoutComSidebar>
              <Livros />
            </LayoutComSidebar>
          } />

          <Route path="/emprestimos" element={
            <LayoutComSidebar>
              <Emprestimos />
            </LayoutComSidebar>
          } />
          
        </Routes>
      </BrowserRouter>
    </BoardProvider>
  )
}