import { useState } from 'react';
import '../styles/cadastroModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: any) => void;
}

export function CadastroCliente({ isOpen, onClose, onSave }: ModalProps) {
  const [step, setStep] = useState(1);

  // Estados do Formulário (Iniciando vazios para garantir controle)
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [DataNasc, setDataNasc] = useState('');
  const [Telefone, setTelefone] = useState('');
  const [CEP, setCEP] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setNome(''); setCpf(''); setDataNasc(''); setTelefone(''); setCEP('');
    setStep(1);
  };

  const handleFinish = () => {
    // Depuração: Verifique no console se os dados estão aqui
    console.log("Tentando salvar:", { nome, cpf, Telefone });

    if (!nome.trim() || !cpf.trim() || !Telefone.trim()) {
      alert("Por favor, preencha os campos obrigatórios (Nome, CPF e Telefone).");
      return;
    }

    const novoCliente = {
      nome,
      cpf,
      DataNasc, 
      Telefone,
      CEP,
      emprestimosAtivos: 0
    };

    onSave(novoCliente);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Impede que o 'Enter' envie o formulário e recarregue a página acidentalmente
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Novo Cliente</h2>

        {/* STEPPER */}
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Informações básicas</span>
          </div>
          
          <div className="step-connector"></div> {/* Linha ajustada */}

          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Contato e Endereço</span>
          </div>
        </div>

        <form className="cadastro-form" onKeyDown={handleKeyDown}>
          {step === 1 ? (
            /* IMPORTANTE: A prop key="step-1" força o React a recriar 
               os inputs, limpando qualquer "lixo" visual da outra etapa 
            */
            <div className="step-content" key="step-1">
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Ana Silva"
                  value={nome} 
                  onChange={e => setNome(e.target.value)}
                  autoFocus // Foca no primeiro campo
                />
              </div>
              <div className="form-group">
                <label className="form-label">CPF *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="000.000.000-00"
                  value={cpf} 
                  onChange={e => setCpf(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={DataNasc} 
                  onChange={e => setDataNasc(e.target.value)}
                />
              </div>
            </div>
          ) : (
            /* IMPORTANTE: key="step-2" garante que estes inputs 
               sejam tratados como novos elementos
            */
            <div className="step-content" key="step-2">
              <div className="form-group">
                <label className="form-label">Telefone / Celular *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="(00) 00000-0000"
                  value={Telefone} 
                  onChange={e => setTelefone(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">CEP</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="00000-000"
                  value={CEP} 
                  onChange={e => setCEP(e.target.value)}
                />
              </div>
              <div style={{height: '85px'}}></div> 
            </div>
          )}

          {/* RODAPÉ */}
          <div className="modal-footer">
            {step === 1 ? (
              <>
                <button type="button" className="btn-outline" onClick={handleClose}>Cancelar</button>
                <button 
                    type="button" 
                    className="btn-solid" 
                    onClick={() => setStep(2)}
                    // Opcional: Desabilita se não preencheu o básico
                    disabled={!nome || !cpf}
                    style={{ opacity: (!nome || !cpf) ? 0.6 : 1 }}
                >
                    Continuar
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Voltar</button>
                <button type="button" className="btn-solid" onClick={handleFinish}>Cadastrar</button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}