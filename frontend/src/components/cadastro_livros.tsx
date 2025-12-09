import { useState } from 'react';
import '../styles/cadastroModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CadastroLivro({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState(1); // Controla se é tela 1 ou 2

  if (!isOpen) return null;

  // Funções de navegação
  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  
  const handleFinish = () => {
    alert("Livro Cadastrado!"); // Aqui entraria a lógica de salvar
    setStep(1); // Reseta para o próximo
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Cadastro</h2>

        {/* STEPPER VISUAL */}
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Informações básicas</span>
          </div>
          
          <div style={{width: '50px'}}></div> {/* Espaço extra p/ linha */}

          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Informações extras</span>
          </div>
        </div>

        {/* CONTEÚDO DO FORMULÁRIO */}
        <form>
          {step === 1 ? (
            /* ETAPA 1 */
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Título</label>
                <input type="text" className="form-input" placeholder="Insira o título" />
              </div>
              <div className="form-group">
                <label className="form-label">Gênero</label>
                <input type="text" className="form-input" placeholder="Insira o gênero" />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input type="text" className="form-input" placeholder="Insira o ISBN" />
              </div>
            </div>
          ) : (
            /* ETAPA 2 */
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Volume</label>
                <input type="text" className="form-input" placeholder="Insira o volume" />
              </div>
              <div className="form-group">
                <label className="form-label">Autor</label>
                <input type="text" className="form-input" placeholder="Insira o autor" />
              </div>
              <div className="form-group">
                <label className="form-label">Editora</label>
                <input type="text" className="form-input" placeholder="Insira a editora" />
              </div>
              <div className="form-group">
                <label className="form-label">Data de lancamento</label>
                <input type="text" className="form-input" placeholder="DD/MM/AAAA" />
              </div>
              {/* Espaço vazio para manter altura se necessário */}
              <div style={{height: '85px'}}></div> 
            </div>
          )}

          {/* RODAPÉ (BOTÕES) */}
          <div className="modal-footer">
            {step === 1 ? (
              <>
                <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn-solid" onClick={handleNext}>Continuar</button>
              </>
            ) : (
              <>
                <button type="button" className="btn-outline" onClick={handleBack}>Voltar</button>
                <button type="button" className="btn-solid" onClick={handleFinish}>Continuar</button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}