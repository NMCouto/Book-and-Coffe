import { useState } from 'react';
import '../styles/cadastroModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CadastroEmprestimo({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState(1); // Controla se é tela 1 ou 2

  if (!isOpen) return null;

  // Funções de navegação
  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  
  const handleFinish = () => {
    alert("Empréstimo Realizado!"); // Aqui entraria a lógica de salvar
    setStep(1); // Reseta para o próximo
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Novo Empréstimo</h2>

        {/* STEPPER VISUAL */}
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Livro e Cliente</span>
          </div>
          
          <div style={{width: '50px'}}></div> {/* Espaço extra p/ linha */}

          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Prazos e Datas</span>
          </div>
        </div>

        {/* CONTEÚDO DO FORMULÁRIO */}
        <form>
          {step === 1 ? (
            /* ETAPA 1: Identificação */
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">ISBN do Livro</label>
                <input type="text" className="form-input" placeholder="Insira o ISBN" />
              </div>
              <div className="form-group">
                <label className="form-label">Título do Livro</label>
                <input type="text" className="form-input" placeholder="Insira o título" />
              </div>
              <div className="form-group">
                <label className="form-label">CPF do Cliente</label>
                <input type="text" className="form-input" placeholder="Insira o CPF do cliente" />
              </div>
            </div>
          ) : (
            /* ETAPA 2: Datas */
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Data de Empréstimo</label>
                {/* Usei type="date" para facilitar, mas mantém a classe de estilo */}
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Data de Devolução</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <input type="text" className="form-input" placeholder="Condição do livro, etc." />
              </div>
            </div>
          )}

          {/* RODAPÉ (BOTÕES) - Idêntico ao Cliente */}
          <div className="modal-footer">
            {step === 1 ? (
              <>
                <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn-solid" onClick={handleNext}>Continuar</button>
              </>
            ) : (
              <>
                <button type="button" className="btn-outline" onClick={handleBack}>Voltar</button>
                <button type="button" className="btn-solid" onClick={handleFinish}>Finalizar</button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}