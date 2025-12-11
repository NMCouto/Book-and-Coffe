import { useState } from 'react'
import { Search, Trash2, Pencil } from 'lucide-react'

export default function Cadastro() {
  const [abaAtiva, setAbaAtiva] = useState('clientes')

  const clientes = [
    { data: '01/01/2025', nome: 'cliente 1', cpf: '123.456.789-00' },
    { data: '15/02/2025', nome: 'Maria Silva', cpf: '987.654.321-00' },
  ]

  const livros = [
    { data: '01/01/2025', titulo: 'Livro 1', isbn: '111-22-3333-4444-5' },
    { data: '10/03/2025', titulo: 'O Senhor dos Anéis', isbn: '978-85-359-0277-4' },
  ]

  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Cadastro</h2>
      
      <div className="aba-buttons">
        <button className={abaAtiva === 'clientes' ? 'aba-active' : ''} onClick={() => setAbaAtiva('clientes')}>
          Clientes
        </button>
        <button className={abaAtiva === 'livros' ? 'aba-active' : ''} onClick={() => setAbaAtiva('livros')}>
          Livros
        </button>
      </div>

      {abaAtiva === 'clientes' && (
        <div className="tabela-container">
          <div className="search-bar"><input type="text" placeholder="Buscar..." /><Search className="search-icon" /></div>
          <table className="tabela">
            <thead><tr><th>Data</th><th>Nome</th><th>CPF</th><th></th></tr></thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr key={i}><td>{c.data}</td><td>{c.nome}</td><td>{c.cpf}</td>
                  <td className="acoes">
                    <button className="acao-btn delete"><Trash2 size={18}/></button>
                    <button className="acao-btn edit"><Pencil size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {abaAtiva === 'livros' && (
        <div className="tabela-container">
          <div className="search-bar"><input type="text" placeholder="Buscar..." /><Search className="search-icon" /></div>
          <table className="tabela">
            <thead><tr><th>Data</th><th>Título</th><th>ISBN</th><th></th></tr></thead>
            <tbody>
              {livros.map((l, i) => (
                <tr key={i}><td>{l.data}</td><td>{l.titulo}</td><td>{l.isbn}</td>
                  <td className="acoes">
                    <button className="acao-btn delete"><Trash2 size={18}/></button>
                    <button className="acao-btn edit"><Pencil size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}