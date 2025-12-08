import { useState } from 'react'
import './App.css'
import { Pencil, Trash2, Search, Menu } from 'lucide-react'

function App() {
  const [abaAtiva, setAbaAtiva] = useState('clientes')
  const [buscaCliente, setBuscaCliente] = useState('')
  const [buscaLivro, setBuscaLivro] = useState('')

  // Dados fake
  const clientes = [
    { data: '01/01/2025', nome: 'cliente 1', cpf: '123.456.789-00' },
    { data: '15/02/2025', nome: 'Maria Silva', cpf: '987.654.321-00' },
  ]

  const livros = [
    { data: '01/01/2025', titulo: 'Livro 1', isbn: '111-22-3333-4444-5' },
    { data: '10/03/2025', titulo: 'O Senhor dos Anéis', isbn: '978-85-359-0277-4' },
  ]

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <button className="menu-btn">
            <Menu size={28} />
          </button>
          <img src="/coffee-book.svg" alt="logo" className="logo" />
          <h1>Bookend coffe</h1>
        </div>
      </header>

      {/* ABAS */}
      <div className="tabs">
        <button className="tab-btn">Novo Cadastro</button>
        <button className="tab-btn">Alterações</button>
      </div>

      <main className="main-content">
        {/* BOTÕES DE ABA CLIENTES / LIVROS */}
        <div className="aba-buttons">
          <button
            className={abaAtiva === 'clientes' ? 'aba-active' : ''}
            onClick={() => setAbaAtiva('clientes')}
          >
            Clientes
          </button>
          <button
            className={abaAtiva === 'livros' ? 'aba-active' : ''}
            onClick={() => setAbaAtiva('livros')}
          >
            Livros
          </button>
        </div>

        {/* TABELA DE CLIENTES */}
        {abaAtiva === 'clientes' && (
          <div className="tabela-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
              />
              <Search className="search-icon" size={20} />
            </div>

            <table className="tabela">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clientes
                  .filter(c => c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || 
                              c.cpf.includes(buscaCliente))
                  .map((c, i) => (
                    <tr key={i}>
                      <td>{c.data}</td>
                      <td>{c.nome}</td>
                      <td>{c.cpf}</td>
                      <td className="acoes">
                        <button className="acao-btn delete"><Trash2 size={18} /></button>
                        <button className="acao-btn edit"><Pencil size={18} /></button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABELA DE LIVROS */}
        {abaAtiva === 'livros' && (
          <div className="tabela-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar..."
                value={buscaLivro}
                onChange={(e) => setBuscaLivro(e.target.value)}
              />
              <Search className="search-icon" size={20} />
            </div>

            <table className="tabela">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Título</th>
                  <th>ISBN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {livros
                  .filter(l => l.titulo.toLowerCase().includes(buscaLivro.toLowerCase()) || 
                              l.isbn.includes(buscaLivro))
                  .map((l, i) => (
                    <tr key={i}>
                      <td>{l.data}</td>
                      <td>{l.titulo}</td>
                      <td>{l.isbn}</td>
                      <td className="acoes">
                        <button className="acao-btn delete"><Trash2 size={18} /></button>
                        <button className="acao-btn edit"><Pencil size={18} /></button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default App