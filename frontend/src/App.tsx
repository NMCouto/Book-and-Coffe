import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { List } from 'phosphor-react'; // Ícone do menu (Hambúrguer)
import './App.css';

// Componentes
import { Sidebar } from './components/ui/Sidebar';
import { BoardProvider } from './contexts/BoardContext';
import { AlertProvider } from './contexts/AlertContext';
// Páginas
import { Login } from './pages/login';
import { Registrar } from './pages/registrar'; 
import { NovaSenha } from './pages/esqueci-senha';
import { Clientes } from './pages/clientes';
import { Livros } from './pages/livros';
import { Analise } from './pages/analise';
import { Configuracao } from './pages/config'
import { Emprestimos } from './pages/emprestimos';
import { BoardPage } from './pages/Quadros/BoardPage';


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
    <AlertProvider>
      <BoardProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/esqueci-senha" element={<NovaSenha />} />

            <Route path="/registrar" element={<Registrar />} />

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

            <Route path="/config" element={
              <LayoutComSidebar>
                <Configuracao />
              </LayoutComSidebar>
            } />

            <Route path="/analise" element={
              <LayoutComSidebar>
                <Analise />
              </LayoutComSidebar>
            } />
            
          </Routes>
        </BrowserRouter>
      </BoardProvider>
    </AlertProvider>
  )
}