import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useAlert } from '../contexts/AlertContext';
import '../styles/login.css';

export function EsqueciSenha() {
  const [usuario, setUsuario] = useState('');
  const { showAlert } = useAlert();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;

    await AuthService.resetPassword(usuario);
    
    showAlert({
      title: 'Email Enviado',
      message: 'Se o usuário existir, enviamos as instruções de recuperação.',
      confirmText: 'OK',
      type: 'alert'
    });
  }

  return (
    <div className="login-container">
      <main className="login-card">
        <header className="login-header">
          <h1 className="brand-title">Recuperar Senha</h1>
          <h2 className="login-subtitle">Digite seu usuário para recuperar o acesso</h2>
        </header>

        <form onSubmit={handleReset} className="login-form">
          <div className="form-group">
            <label className="form-label">Usuário</label>
            <input type="text" className="form-input" value={usuario} onChange={e => setUsuario(e.target.value)} />
          </div>

          <button type="submit" className="btn-login">Enviar</button>
          
          <div className="login-footer" style={{justifyContent: 'center'}}>
            <Link to="/" className="login-link">Voltar para Login</Link>
          </div>
        </form>
      </main>
    </div>
  );
}