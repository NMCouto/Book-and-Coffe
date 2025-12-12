import { useState, useEffect } from 'react';
import type { LivroView } from '../types';
import '../styles/cadastroModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  livroParaEditar?: LivroView | null;
  onSave: (dados: any) => void;
}

export function CadastroLivro({ isOpen, onClose, livroParaEditar, onSave }: ModalProps) {
  const [step, setStep] = useState(1);

  // Estados do Formulário
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  
  // Passo 2
  const [genero, setGenero] = useState('');
  const [editora, setEditora] = useState('');
  const [volume, setVolume] = useState('');
  const [dataLancamento, setDataLancamento] = useState('');

  // Efeito para Preencher (Edição) ou Limpar (Novo)
  useEffect(() => {
    if (isOpen) {
        if (livroParaEditar) {
            // Edição
            setTitulo(livroParaEditar.titulo);
            setAutor(livroParaEditar.autor);
            setIsbn(livroParaEditar.isbn);
            setGenero(livroParaEditar.genero || '');
            
            // Campos que podem não estar na View padrão, mas o backend pode ter
            // Aqui assumimos valores padrão ou vazios se não vierem na View
            setEditora(''); 
            setVolume(''); 
            setDataLancamento('');
        } else {
            // Novo
            setTitulo(''); setAutor(''); setIsbn(''); 
            setGenero(''); setEditora(''); setVolume(''); setDataLancamento('');
        }
        setStep(1);
    }
  }, [isOpen, livroParaEditar]);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!titulo.trim() || !autor.trim() || !isbn.trim()) {
      alert("Título, Autor e ISBN são obrigatórios.");
      return;
    }

    const dadosLivro = {
      titulo,
      autor,
      isbn,
      genero,
      editora,
      volume,
      data_lancamento: dataLancamento
    };

    onSave(dadosLivro);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">
            {livroParaEditar ? 'Editar Livro' : 'Novo Livro'}
        </h2>

        {/* Stepper */}
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Dados Principais</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Detalhes</span>
          </div>
        </div>

        <form className="cadastro-form" onKeyDown={handleKeyDown}>
          {step === 1 ? (
            <div className="step-content" key="step-1">
              <div className="form-group">
                <label className="form-label">Título do Livro *</label>
                <input type="text" className="form-input" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: O Hobbit" autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Autor *</label>
                <input type="text" className="form-input" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Ex: J.R.R. Tolkien" />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN *</label>
                <input type="text" className="form-input" value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="Apenas números" />
              </div>
            </div>
          ) : (
            <div className="step-content" key="step-2">
              <div className="form-group">
                <label className="form-label">Gênero</label>
                <input type="text" className="form-input" value={genero} onChange={e => setGenero(e.target.value)} placeholder="Ex: Fantasia" autoFocus />
              </div>
              <div style={{display:'flex', gap:10}}>
                  <div className="form-group" style={{flex:2}}>
                    <label className="form-label">Editora</label>
                    <input type="text" className="form-input" value={editora} onChange={e => setEditora(e.target.value)} />
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label className="form-label">Volume</label>
                    <input type="number" className="form-input" value={volume} onChange={e => setVolume(e.target.value)} />
                  </div>
              </div>
              <div className="form-group">
                <label className="form-label">Data Lançamento</label>
                <input type="date" className="form-input" value={dataLancamento} onChange={e => setDataLancamento(e.target.value)} />
              </div>
            </div>
          )}

          <div className="modal-footer">
            {step === 1 ? (
              <>
                <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
                <button 
                    type="button" 
                    className="btn-solid" 
                    onClick={() => setStep(2)} 
                    disabled={!titulo || !autor || !isbn}
                    style={{opacity: (!titulo || !autor || !isbn) ? 0.6 : 1}}
                >
                    Continuar
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Voltar</button>
                <button type="button" className="btn-solid" onClick={handleFinish}>
                    {livroParaEditar ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}