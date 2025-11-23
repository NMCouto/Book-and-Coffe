import { useState } from 'react';
import type { FormEvent } from 'react';
import  { useNavigate } from 'react-router-dom'; // Hook de navegação
import '../styles/login.css';

export function Login() {
  // Estados para capturar o que o usuário digita
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  
  const navigate = useNavigate();

  // Função disparada ao clicar em "Continuar"
  function handleLogin(event: FormEvent) {
    event.preventDefault(); // Evita que a página recarregue

    if (!usuario || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    
    // aqui teriam as validações com o backend, por enquanto só ignoramos e vamos para outra tela

    console.log("Login realizado:", { usuario, senha });
     
    navigate('/kanban'); 
  }

  return (
    <div className="login-container">
      <main className="login-card">
        
        {/* Cabeçalho com Logo */}
        <header className="login-header">
          <div className="logo-container">
            <img src="/assets/logocafe.png" alt="Xícara" className="logo-img" />
            <h1 className="brand-title">Bookend coffe</h1>
          </div>
          <h2 className="login-subtitle">Realize o login para continuar</h2>
        </header>

        {/* Formulário */}
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
        </form>

      </main>
    </div>
  );
}