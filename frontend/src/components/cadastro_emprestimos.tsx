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
  
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [obs, setObs] = useState('');
  const [status, setStatus] = useState('Em dia'); // Novo Estado

  // Modais
  const [isSelLivroOpen, setIsSelLivroOpen] = useState(false);
  const [isSelClienteOpen, setIsSelClienteOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (emprestimoParaEditar) {
            // MODO EDIÇÃO
            setIsbn(emprestimoParaEditar.isbn);
            setTitulo(emprestimoParaEditar.titulo);
            setCpf(emprestimoParaEditar.cpfCliente);
            // obs vem do campo comentario
            setObs(emprestimoParaEditar.comentario || ''); 
            setStatus(emprestimoParaEditar.status || 'Em dia');

            if (emprestimoParaEditar.dataEmissao) setDataEmissao(emprestimoParaEditar.dataEmissao.split('T')[0]);
            if (emprestimoParaEditar.dataDevolucao) setDataDevolucao(emprestimoParaEditar.dataDevolucao.split('T')[0]);
        } else {
            // MODO CRIAÇÃO
            setIsbn(''); setTitulo(''); setCpf(''); setNomeCliente('');
            setDataEmissao(new Date().toISOString().split('T')[0]); 
            setDataDevolucao(''); setObs(''); setStatus('em_dia');
            setStep(1);
        }
    }
  }, [isOpen, emprestimoParaEditar]);

  // Handlers de Seleção (Mantidos iguais)
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

  const handleFinish = async () => {
    if (!isbn || !cpf || !dataDevolucao) {
        alert("Por favor, preencha o livro, o cliente e a data de devolução.");
        return;
    }
    const dados = { isbn, titulo, cpf, dataEmissao, dataDevolucao, obs, status };
    
    try {
        // Tenta salvar no pai (Service)
        await onSave(dados);
        
        // Se chegou aqui, deu sucesso! Pode fechar.
        onClose();
    } catch (error) {
        // Se deu erro (Livro Indisponível), cai aqui.
        // NÃO chamamos onClose(), então o modal fica aberto
        // O alerta já foi mostrado pelo pai (handleSaveNew)
    }
  };

  // ... (Colunas colunasLivro e colunasCliente mantidas iguais) ...
  const colunasLivro: ColumnDef<LivroView>[] = [
    { header: 'Título', accessor: 'titulo', className: 'text-left' },
    { header: 'ISBN', accessor: 'isbn', className: 'text-left' },
    { header: 'Disp.', className: 'text-center', render: (l) => l.disponivel ? <Check color="green"/> : <span style={{color:'red'}}>X</span> },
    { header: 'Ação', className: 'text-center', render: (l) => <button className="btn-solid" style={{padding:'4px'}} onClick={()=>handleSelectLivro(l)}><Check/></button> }
  ];
  const colunasCliente: ColumnDef<ClienteView>[] = [
    { header: 'Nome', accessor: 'nome', className: 'text-left' },
    { header: 'CPF', accessor: 'cpf', className: 'text-left' },
    { header: 'Ação', className: 'text-center', render: (c) => <button className="btn-solid" style={{padding:'4px'}} onClick={()=>handleSelectCliente(c)}><Check/></button> }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-card">
          <h2 className="modal-title">
              {emprestimoParaEditar ? 'Editar Empréstimo' : 'Novo Empréstimo'}
          </h2>

          <div className="stepper">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div><span className="step-label">Itens</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step-item ${step === 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div><span className="step-label">Prazos</span>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 ? (
              <div className="step-content" key="step-1">
                {/* Inputs de Livro e Cliente (Mantidos iguais ao anterior, com lupa) */}
                <div className="form-group">
                  <label className="form-label">Livro</label>
                  <div style={{display: 'flex', gap: 8}}>
                      <input className="form-input" value={titulo || isbn} readOnly style={{backgroundColor: '#f9f9f9', flex: 1}} placeholder="Selecione..." onClick={() => setIsSelLivroOpen(true)}/>
                      <button type="button" className="btn-solid" onClick={() => setIsSelLivroOpen(true)}><MagnifyingGlass size={20} color="white" /></button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cliente</label>
                  <div style={{display: 'flex', gap: 8}}>
                      <input className="form-input" value={nomeCliente || cpf} readOnly style={{backgroundColor: '#f9f9f9', flex: 1}} placeholder="Selecione..." onClick={() => setIsSelClienteOpen(true)}/>
                      <button type="button" className="btn-solid" onClick={() => setIsSelClienteOpen(true)}><MagnifyingGlass size={20} color="white" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="step-content" key="step-2">
                
                {/* MOSTRAR STATUS APENAS NA EDIÇÃO */}
                {emprestimoParaEditar && (
                    <div className="form-group">
                        <label className="form-label">Status Atual</label>
                        <select 
                            className="form-input" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Em dia">Em dia</option>
                            <option value="Atrasado">Atrasado</option>
                            <option value="Devolvido">Devolvido (Finalizado)</option>
                        </select>
                    </div>
                )}

                <div className="form-group">
                  <label className="form-label">Data de Emissão</label>
                  <input type="date" className="form-input" value={dataEmissao} onChange={e => setDataEmissao(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Data Devolução</label>
                  <input type="date" className="form-input" value={dataDevolucao} onChange={e => setDataDevolucao(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea className="form-input" value={obs} onChange={e => setObs(e.target.value)} style={{height: 60, resize: 'none'}} />
                </div>
              </div>
            )}

            <div className="modal-footer">
              {step === 1 ? (
                <>
                  <button className="btn-outline" onClick={onClose}>Cancelar</button>
                  <button className="btn-solid" onClick={() => setStep(2)} disabled={!isbn || !cpf}>Continuar</button>
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
      
      {/* Modais de seleção (Mantidos) */}
      <GenericSelectionModal<LivroView> isOpen={isSelLivroOpen} onClose={() => setIsSelLivroOpen(false)} title="Selecionar Livro" fetchData={LivrosService.getAll} columns={colunasLivro} searchKeys={['titulo', 'isbn']} />
      <GenericSelectionModal<ClienteView> isOpen={isSelClienteOpen} onClose={() => setIsSelClienteOpen(false)} title="Selecionar Cliente" fetchData={ClientesService.getAll} columns={colunasCliente} searchKeys={['nome', 'cpf']} />
    </>
  );
}