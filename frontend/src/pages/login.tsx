import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  
  const navigate = useNavigate();

  function handleLogin(event: FormEvent) {
    event.preventDefault(); 
    if (!usuario || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    console.log("Login realizado:", { usuario, senha });
    navigate('/quadros/operacional'); 
  }

  return (
    <div className="login-container">
      <main className="login-card">
        
        <header className="login-header">
          <div className="logo-container">
            <img src="/assets/logocafe.png" alt="Xícara" className="logo-img" />
            <h1 className="brand-title">Book and coffe</h1>
          </div>
          <h2 className="login-subtitle">Realize o login para continuar</h2>
        </header>

        <form onSubmit={handleLogin} className="login-form">
          
          <div className="form-group">
            <label htmlFor="user" className="form-label">Usuário*</label>
            <input 
              id="user"
              type="text" 
              placeholder="Insira seu usuário" 
              className="form-input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass" className="form-label">Senha*</label>
            <input 
              id="pass"
              type="password" 
              placeholder="Insira sua senha" 
              className="form-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            Continuar
          </button>

          {/* --- NOVOS LINKS AQUI --- */}
          <div className="login-footer">
            <Link to="/esqueci-senha" className="login-link">
              Esqueci minha senha
            </Link>
            
            <Link to="/registrar" className="login-link bold">
              Não possuo conta
            </Link>
          </div>

        </form>

      </main>
    </div>
  );
}