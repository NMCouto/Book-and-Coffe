import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useAlert } from '../contexts/AlertContext';
import '../styles/login.css';

export function Registrar() {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !usuario || !senha) return;

    setIsLoading(true);

    try {
      await AuthService.register(usuario, senha, nome);
      
      await showAlert({
        title: 'Sucesso!',
        message: 'Conta criada com sucesso. Faça login para entrar.',
        confirmText: 'Ir para Login',
        type: 'alert'
      });
      navigate('/');

    } catch (error: any) {
      if (error.message === 'USER_EXISTS') {
        showAlert({ title: 'Erro', message: 'Este nome de usuário já está em uso.', type: 'alert' });
      }
    }finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <main className="login-card">
        <header className="login-header">
          <h1 className="brand-title">Criar Conta</h1>
          <h2 className="login-subtitle">Preencha os dados abaixo</h2>
        </header>

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input type="text" className="form-input" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Usuário</label>
            <input type="text" className="form-input" value={usuario} onChange={e => setUsuario(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input type="password" className="form-input" value={senha} onChange={e => setSenha(e.target.value)} />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Registrar'}
          </button>
          
          <div className="login-footer" style={{justifyContent: 'center'}}>
            <Link to="/" className="login-link">Já tenho uma conta</Link>
          </div>
        </form>
      </main>
    </div>
  );
}