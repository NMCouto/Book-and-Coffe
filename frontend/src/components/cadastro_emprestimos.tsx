import { useState, useEffect } from 'react';
import { MagnifyingGlass, Check } from 'phosphor-react';
import type { EmprestimoView, LivroView, ClienteView, ColumnDef } from '../types';
import { GenericSelectionModal } from './modals/GenericSelectionModal';
import { LivrosService } from '../services/livrosService';
import { ClientesService } from '../services/clientesService';
import '../styles/cadastroModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  emprestimoParaEditar?: EmprestimoView | null;
  onSave: (dados: any) => void;
}

export function CadastroEmprestimo({ isOpen, onClose, emprestimoParaEditar, onSave }: ModalProps) {
  const [step, setStep] = useState(1);
  
  // Estados do Formulário
  const [isbn, setIsbn] = useState('');
  const [titulo, setTitulo] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]); // Hoje
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [obs, setObs] = useState('');

  // Controle dos Modais de Seleção
  const [isSelLivroOpen, setIsSelLivroOpen] = useState(false);
  const [isSelClienteOpen, setIsSelClienteOpen] = useState(false);

  // Efeito para preencher (Edição) ou limpar (Novo)
  useEffect(() => {
    if (isOpen && emprestimoParaEditar) {
      setIsbn(emprestimoParaEditar.isbn);
      setTitulo(emprestimoParaEditar.titulo);
      setCpf(emprestimoParaEditar.cpfCliente);
      // Tenta preencher datas se existirem
      if (emprestimoParaEditar.dataEmissao) setDataEmissao(emprestimoParaEditar.dataEmissao.split('T')[0]);
      if (emprestimoParaEditar.dataDevolucao) setDataDevolucao(emprestimoParaEditar.dataDevolucao.split('T')[0]);
    } else if (isOpen && !emprestimoParaEditar) {
      // Limpa tudo se for novo cadastro
      setIsbn(''); setTitulo(''); setCpf(''); setNomeCliente('');
      setDataEmissao(new Date().toISOString().split('T')[0]); 
      setDataDevolucao(''); setObs('');
      setStep(1);
    }
  }, [isOpen, emprestimoParaEditar]);

  // --- HANDLERS DE SELEÇÃO ---
  const handleSelectLivro = (livro: LivroView) => {
    setIsbn(livro.isbn);
    setTitulo(livro.titulo);
    setIsSelLivroOpen(false);
  };

  const handleSelectCliente = (cliente: ClienteView) => {
    setCpf(cliente.cpf);
    setNomeCliente(cliente.nome);
    setIsSelClienteOpen(false);
  };

  const handleFinish = () => {
    if (!isbn || !cpf || !dataDevolucao) {
        alert("Por favor, preencha o livro, o cliente e a data de devolução.");
        return;
    }
    const dados = { isbn, titulo, cpf, dataEmissao, dataDevolucao, obs };
    onSave(dados);
    onClose();
  };

  // --- COLUNAS PARA O MODAL DE SELEÇÃO ---
  
  const colunasLivro: ColumnDef<LivroView>[] = [
    { header: 'Título', accessor: 'titulo', className: 'text-left' },
    { header: 'ISBN', accessor: 'isbn', className: 'text-left' },
    { 
        header: 'Disponível', className: 'text-center',
        render: (l) => l.disponivel 
            ? <span style={{color:'var(--status-success-text)', fontWeight:'bold'}}>Sim</span> 
            : <span style={{color:'var(--status-danger-text)'}}>Não</span> 
    },
    {
        header: 'Ação', className: 'text-center',
        render: (l) => (
            <button 
                className="btn-solid" 
                style={{padding: '6px 12px'}}
                disabled={!l.disponivel} 
                onClick={() => handleSelectLivro(l)}
                title="Selecionar este livro"
            >
                <Check size={16} weight="bold"/>
            </button>
        )
    }
  ];

  const colunasCliente: ColumnDef<ClienteView>[] = [
    { header: 'Nome', accessor: 'nome', className: 'text-left' },
    { header: 'CPF', accessor: 'cpf', className: 'text-left' },
    {
        header: 'Ação', className: 'text-center',
        render: (c) => (
            <button 
                className="btn-solid" 
                style={{padding: '6px 12px'}}
                onClick={() => handleSelectCliente(c)}
                title="Selecionar este cliente"
            >
                <Check size={16} weight="bold"/>
            </button>
        )
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-card">
          <h2 className="modal-title">
              {emprestimoParaEditar ? 'Editar Empréstimo' : 'Novo Empréstimo'}
          </h2>

          {/* Stepper Visual */}
          <div className="stepper">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div>
              <span className="step-label">Itens e Pessoas</span>
            </div>
            <div className={`step-item ${step === 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span className="step-label">Prazos</span>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 ? (
              <div className="step-content">
                
                {/* --- SELEÇÃO DE LIVRO --- */}
                <div className="form-group">
                  <label className="form-label">Livro</label>
                  <div style={{display: 'flex', gap: 8}}>
                      <input 
                        className="form-input" 
                        value={titulo || isbn} 
                        placeholder="Clique na lupa para selecionar..." 
                        readOnly 
                        // MUDANÇA AQUI: Adicionado 'flex: 1' para ocupar o espaço
                        style={{cursor: 'pointer', backgroundColor: '#f9f9f9', flex: 1}}
                        onClick={() => setIsSelLivroOpen(true)}
                      />
                      <button 
                        type="button"
                        className="btn-solid" 
                        onClick={() => setIsSelLivroOpen(true)}
                        title="Buscar Livro no Acervo"
                      >
                        <MagnifyingGlass size={20} color="white" />
                      </button>
                  </div>
                  {titulo && <small style={{color: '#666', marginLeft: 4}}>ISBN: {isbn}</small>}
                </div>

                {/* --- SELEÇÃO DE CLIENTE --- */}
                <div className="form-group" style={{marginTop: 15}}>
                  <label className="form-label">Cliente</label>
                  <div style={{display: 'flex', gap: 8}}>
                      <input 
                        className="form-input" 
                        value={nomeCliente || cpf} 
                        placeholder="Clique na lupa para selecionar..." 
                        readOnly 
                        // MUDANÇA AQUI: Adicionado 'flex: 1'
                        style={{cursor: 'pointer', backgroundColor: '#f9f9f9', flex: 1}}
                        onClick={() => setIsSelClienteOpen(true)}
                      />
                      <button 
                        type="button"
                        className="btn-solid" 
                        onClick={() => setIsSelClienteOpen(true)}
                        title="Buscar Cliente Cadastrado"
                      >
                        <MagnifyingGlass size={20} color="white" />
                      </button>
                  </div>
                  {nomeCliente && <small style={{color: '#666', marginLeft: 4}}>CPF: {cpf}</small>}
                </div>

              </div>
            ) : (
              /* ETAPA 2: PRAZOS */
              <div className="step-content">
                <div className="form-group">
                  <label className="form-label">Data de Emissão</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={dataEmissao} 
                    onChange={e => setDataEmissao(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Previsão de Devolução</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={dataDevolucao} 
                    onChange={e => setDataDevolucao(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea 
                    className="form-input" 
                    value={obs} 
                    onChange={e => setObs(e.target.value)} 
                    style={{height: 80, resize: 'none'}} 
                    placeholder="Estado do livro, observações gerais..."
                  />
                </div>
              </div>
            )}

            {/* Rodapé */}
            <div className="modal-footer">
              {step === 1 ? (
                <>
                  <button className="btn-outline" onClick={onClose}>Cancelar</button>
                  <button 
                    className="btn-solid" 
                    onClick={() => setStep(2)} 
                    disabled={!isbn || !cpf} // Bloqueia se não selecionou ambos
                    style={{opacity: (!isbn || !cpf) ? 0.6 : 1}}
                  >
                    Continuar
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-outline" onClick={() => setStep(1)}>Voltar</button>
                  <button className="btn-solid" onClick={handleFinish}>Confirmar</button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* --- MODAIS DE SELEÇÃO --- */}
      
      {/* Modal Genérico para LIVROS */}
      <GenericSelectionModal<LivroView>
        isOpen={isSelLivroOpen}
        onClose={() => setIsSelLivroOpen(false)}
        title="Selecionar Livro"
        fetchData={LivrosService.getAll}
        columns={colunasLivro}
        searchKeys={['titulo', 'isbn']}
      />

      {/* Modal Genérico para CLIENTES */}
      <GenericSelectionModal<ClienteView>
        isOpen={isSelClienteOpen}
        onClose={() => setIsSelClienteOpen(false)}
        title="Selecionar Cliente"
        fetchData={ClientesService.getAll}
        columns={colunasCliente}
        searchKeys={['nome', 'cpf']}
      />
    </>
  );
}