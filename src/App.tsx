import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './componentes/Header'
import Sidebar from './componentes/Sidebar'
import Cadastro from './paginas/Cadastro'
import Analise from './paginas/Analise'
import AnaliseDetalhes from './paginas/AnaliseDetalhes'
import Emprestimo from './paginas/Emprestimo'
import { FilterProvider } from './context/ConteudoFiltro';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <FilterProvider> 
        <div className="app-container">
          <Header />
          <div className="main-layout">
            <Sidebar /> 
            <main className="content">
              <Routes>
                <Route path="/" element={<Cadastro />} />
                <Route path="/analise" element={<Analise />} />
                <Route path="/analiseDetalhes" element={<AnaliseDetalhes/>}/>
                <Route path="/emprestimo" element={<Emprestimo/>}/>
              </Routes>
            </main>
          </div>
        </div>

      </FilterProvider>
    </BrowserRouter>
  )
}

export default App