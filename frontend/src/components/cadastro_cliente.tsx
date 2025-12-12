import { useState, useEffect } from 'react';
import type { ClienteView } from '../types'; // Importar o tipo
import '../styles/cadastroModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteParaEditar?: ClienteView | null; 
  onSave: (dados: any) => void;
}

export function CadastroCliente({ isOpen, onClose, clienteParaEditar, onSave }: ModalProps) {
  const [step, setStep] = useState(1);

  // Estados
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');

  // EFEITO: Popula ou Limpa o formulário ao abrir
  useEffect(() => {
    if (isOpen) {
        if (clienteParaEditar) {
            // MODO EDIÇÃO: Preenche os dados
            setNome(clienteParaEditar.nome);
            setCpf(clienteParaEditar.cpf);
            setTelefone(clienteParaEditar.telefone);
            setCep(clienteParaEditar.cep || '');
            
            // Tratamento da data (DD/MM/AAAA para YYYY-MM-DD do input date)
            // Se a data já vier formatada do adapter, talvez precise converter
            // Vamos assumir que se tiver data, tentamos converter.
            // Se o seu adapter já manda string formatada, pode precisar de ajuste aqui.
            if (clienteParaEditar.dataNasc) {
                 // Exemplo simples, pode variar dependendo de como vem do adapter
                 // Se vier "10/12/2025", precisamos virar "2025-12-10"
                 const partes = clienteParaEditar.dataNasc.split('/');
                 if (partes.length === 3) {
                     setDataNasc(`${partes[2]}-${partes[1]}-${partes[0]}`);
                 } else {
                     setDataNasc(''); 
                 }
            } else {
                setDataNasc('');
            }
        } else {
            // MODO CRIAÇÃO: Limpa tudo
            setNome(''); setCpf(''); setDataNasc(''); setTelefone(''); setCep('');
        }
        setStep(1); // Sempre volta para o passo 1
    }
  }, [isOpen, clienteParaEditar]);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!nome.trim() || !cpf.trim() || !telefone.trim()) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const dadosCliente = {
      nome,
      cpf,
      dataNasc, 
      telefone,
      cep
    };

    onSave(dadosCliente);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">
            {clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Informações básicas</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Contato e Endereço</span>
          </div>
        </div>

        <form className="cadastro-form" onKeyDown={handleKeyDown}>
          {step === 1 ? (
            <div className="step-content" key="step-1">
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input type="text" placeholder='Coloque seu nome completo' className="form-input" value={nome} onChange={e => setNome(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">CPF *</label>
                <input type="text" placeholder='Coloque seu CPF. Ex: 000.000.000-00' className="form-input" value={cpf} onChange={e => setCpf(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input type="date" placeholder='Coloque a sua data de nascimento' className="form-input" value={dataNasc} onChange={e => setDataNasc(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="step-content" key="step-2">
              <div className="form-group">
                <label className="form-label">Telefone / Celular *</label>
                <input type="text" placeholder='Coloque seu número de telefone. Ex: (00) 00000-0000' className="form-input" value={telefone} onChange={e => setTelefone(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">CEP</label>
                <input type="text" placeholder='Coloque seu CEP. Ex: 00000-000' className="form-input" value={cep} onChange={e => setCep(e.target.value)} />
              </div>
              <div style={{height: '85px'}}></div> 
            </div>
          )}

          <div className="modal-footer">
            {step === 1 ? (
              <>
                <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn-solid" onClick={() => setStep(2)} disabled={!nome || !cpf}>Continuar</button>
              </>
            ) : (
              <>
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Voltar</button>
                <button type="button" className="btn-solid" onClick={handleFinish}>
                    {clienteParaEditar ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}