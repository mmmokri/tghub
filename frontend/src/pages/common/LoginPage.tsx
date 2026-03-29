import React, { useEffect, useState } from 'react';
import '../../styles/common/LoginPage.css';

interface LoginPageProps {
  onBack: () => void;
  onGoToCreate: () => void;
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onGoToCreate, onLogin }) => {
  const [theme, setTheme] = useState({
    bg: '#1A2026',
    text: '#FFFFFF',
    hint: '#8E949A',
    buttonLogin: '#248BDA',
    buttonSecondary: '#212932',
    inputBg: '#212932',
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const params = tg.themeParams;
      if (params) {
        setTheme(prev => ({
          ...prev,
          bg: params.bg_color || prev.bg,
          text: params.text_color || prev.text,
          hint: params.hint_color || prev.hint,
          buttonLogin: params.button_color || prev.buttonLogin,
          buttonSecondary: params.secondary_bg_color || prev.buttonSecondary,
          inputBg: params.secondary_bg_color || prev.inputBg,
        }));
      }
    }
  }, []);

  const containerStyle = { backgroundColor: theme.bg, color: theme.text };
  const inputStyle = { backgroundColor: theme.inputBg, color: theme.text };
  const primaryButtonStyle = { backgroundColor: theme.buttonLogin, color: '#FFFFFF' };
  const secondaryButtonStyle = { backgroundColor: theme.buttonSecondary, color: theme.text };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container" style={containerStyle}>
      <header className="login-header">
        <h1>Авторизация</h1>
      </header>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Логин" 
            style={inputStyle} 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Пароль" 
            style={inputStyle} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="actions-container">
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={primaryButtonStyle}
          >
            Войти
          </button>
          <button type="button" className="btn btn-secondary" onClick={onGoToCreate} style={secondaryButtonStyle}>
            У меня нет профиля
          </button>
          <button type="button" className="btn btn-secondary" onClick={onBack} style={secondaryButtonStyle}>
            Назад
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
