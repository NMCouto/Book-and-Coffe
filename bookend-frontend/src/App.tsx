import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { List } from 'phosphor-react'; // Ícone do menu (Hambúrguer)

// Componentes
import { Sidebar } from './components/Sidebar';

// Páginas
import { Login } from './pages/login'; 
import { Cliente } from './pages/clientes';
import { Kanban } from './pages/kanban';

function LayoutComSidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      <button 
        className="menu-trigger" 
        onClick={() => setIsSidebarOpen(true)}
      >
        <List size={32} />
      </button>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="main-content" style={{ padding: '20px', paddingTop: '60px' }}>
        {children}
      </main>
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
            <Cliente />
          </LayoutComSidebar>
        } />
        
      </Routes>
    </BrowserRouter>
  )
}