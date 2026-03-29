import React, { useEffect, useState } from 'react';
import '../../styles/common/CreateProfilePage.css';

interface CreateProfilePageProps {
  onBack: () => void;
  onGoToLogin: () => void;
  onRegister: (username: string) => void;
}

const CreateProfilePage: React.FC<CreateProfilePageProps> = ({ onBack, onGoToLogin, onRegister }) => {
  const [theme, setTheme] = useState({
    bg: '#1A2026',
    text: '#FFFFFF',
    hint: '#8E949A',
    buttonLogin: '#248BDA',
    buttonSecondary: '#212932',
    inputBg: '#212932',
    accent: '#248BDA',
    accentActive: '#1255CA',
  });

  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('');
  const [group, setGroup] = useState('');
  const [university, setUniversity] = useState('');

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

  const stackOptions = ['JS', 'PHP', 'HTML', 'Python'];

  const toggleStack = (item: string) => {
    setSelectedStack(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const containerStyle = { backgroundColor: theme.bg, color: theme.text };
  const inputStyle = { backgroundColor: theme.inputBg, color: theme.text };
  const hintStyle = { color: theme.hint };
  const primaryButtonStyle = { backgroundColor: theme.buttonLogin, color: '#FFFFFF' };
  const secondaryButtonStyle = { backgroundColor: theme.buttonSecondary, color: theme.text };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onRegister(username);
    }
  };

  return (
    <div className="profile-container" style={containerStyle}>
      <header className="profile-header">
        <h1>Создание профиля</h1>
      </header>

      <form className="profile-form" onSubmit={handleRegister}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Фамилия Имя" 
            style={inputStyle} 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="input-group select-wrapper">
          <select 
            style={inputStyle} 
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="" disabled hidden>Выберите курс</option>
            <option value="3">3 курс</option>
            <option value="4">4 курс</option>
          </select>
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Группа" 
            style={inputStyle} 
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Учебное заведение" 
            style={inputStyle} 
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
        </div>

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

        <div className="stack-section">
          <p className="stack-title" style={hintStyle}>Стек технологий (дополнительно)</p>
          <div className="stack-grid">
            {stackOptions.map(item => (
              <div 
                key={item}
                className={`stack-tile ${selectedStack.includes(item) ? 'selected' : ''}`}
                onClick={() => toggleStack(item)}
                style={{
                  backgroundColor: 'rgba(36, 139, 218, 0.2)',
                  borderColor: selectedStack.includes(item) ? theme.accentActive : theme.accent,
                  color: theme.text
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="actions-container">
          <button type="submit" className="btn btn-primary" style={primaryButtonStyle}>
            Отправить
          </button>
          <button type="button" className="btn btn-secondary" onClick={onGoToLogin} style={secondaryButtonStyle}>
            У меня есть профиль
          </button>
          <button type="button" className="btn btn-secondary" onClick={onBack} style={secondaryButtonStyle}>
            Назад
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfilePage;
