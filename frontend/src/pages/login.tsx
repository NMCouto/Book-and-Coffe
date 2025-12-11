import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext'; // Alertas bonitos
import '../styles/login.css';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Contexto para salvar o usuário
  const { showAlert } = useAlert(); // Contexto de alerta

  async function handleLogin(event: FormEvent) {
    event.preventDefault(); 

    if (!usuario || !senha) {
      showAlert({ title: 'Atenção', message: 'Por favor, preencha todos os campos.', type: 'alert' });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tenta logar no Service
      const user = await AuthService.login(usuario, senha);
      
      // 2. Se deu certo, salva no Contexto Global
      login(user);
      
      // 3. Redireciona
      navigate('/quadros/operacional');

    } catch (error: any) {
      // 4. Tratamento de Erros Específicos
      if (error.message === "USER_NOT_FOUND") {
        const desejaRegistrar = await showAlert({
            title: 'Usuário não encontrado',
            message: 'Este usuário não existe. Deseja se registrar agora?',
            confirmText: 'Sim, registrar',
            cancelText: 'Tentar novamente',
            type: 'confirm'
        });
        if (desejaRegistrar) navigate('/registrar');

      } else if (error.message === "WRONG_PASSWORD") {
        showAlert({
            title: 'Acesso Negado',
            message: 'A senha informada está incorreta.',
            type: 'alert'
        });
      } else {
        showAlert({ title: 'Erro', message: 'Ocorreu um erro ao tentar conectar.', type: 'alert' });
      }
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <main className="login-card">
        <header className="login-header">
          <div className="logo-container">
            <img 
                src="/assets/logocafe.png" 
                alt="Logo Bookend" 
                className="logo-img" 
              />
            <h1 className="brand-title">Book and coffe</h1>
          </div>
          <h2 className="login-subtitle">Realize o login para continuar</h2>
        </header>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="user" className="form-label">Usuário</label>
            <input 
              id="user" type="text" placeholder="Insira seu usuário" className="form-input"
              value={usuario} onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass" className="form-label">Senha</label>
            <input 
              id="pass" type="password" placeholder="Insira sua senha" className="form-input"
              value={senha} onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Continuar'}
          </button>

          <div className="login-footer">
            <Link to="/esqueci-senha" className="login-link">Esqueci minha senha</Link>
            <Link to="/registrar" className="login-link bold">Não possuo conta</Link>
          </div>
        </form>
      </main>
    </div>
  );
}