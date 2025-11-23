import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';

// Crie arquivos vazios nessas pastas só para o erro sumir por enquanto
import { Login } from './pages/login'; 
import { Cadastro } from './pages/cadastro';
import { Kanban } from './pages/kanban';

// Layout que exibe a Sidebar + O conteúdo da página ao lado
function LayoutComSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content">
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
        
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas com Sidebar */}
        <Route path="/kanban" element={
          <LayoutComSidebar>
            <Kanban />
          </LayoutComSidebar>
        } />
        
        {/* Adicione outras rotas aqui */}
      </Routes>
    </BrowserRouter>
  )
}