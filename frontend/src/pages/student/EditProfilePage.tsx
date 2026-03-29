import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import '../../styles/student/EditProfilePage.css';

interface EditProfilePageProps {
  onBack: () => void;
  onGoToGroup: () => void;
  onGoToGrades: () => void;
  onGoToCabinet: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ onBack, onGoToGroup, onGoToGrades, onGoToCabinet }) => {
  const [theme, setTheme] = useState({
    bg: '#1A2026',
    text: '#FFFFFF',
    hint: '#8E949A',
    buttonPrimary: '#248BDA',
    secondaryBg: '#212932',
    accent: '#248BDA',
    accentActive: '#1255CA',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);

  const stackOptions = ['JS', 'PHP', 'HTML', 'Python'];

  const toggleStack = (item: string) => {
    setSelectedStack(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

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
          buttonPrimary: params.button_color || prev.buttonPrimary,
          secondaryBg: params.secondary_bg_color || prev.secondaryBg,
        }));
      }
    }
  }, []);

  const containerStyle = { backgroundColor: theme.bg, color: theme.text };
  const inputStyle = { backgroundColor: theme.secondaryBg, color: theme.text };
  const primaryButtonStyle = { backgroundColor: theme.buttonPrimary, color: '#FFFFFF' };
  const secondaryButtonStyle = { backgroundColor: theme.secondaryBg, color: theme.text };

  return (
    <div className="edit-profile-container" style={containerStyle}>
      <header className="edit-profile-header">
        <button className="back-button" onClick={onBack} style={{ color: theme.text }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1>Редактировать профиль</h1>
      </header>

      <main className="edit-profile-content">
        <form className="edit-profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <input type="text" placeholder="Фамилия Имя" style={inputStyle} />
          </div>

          <div className="input-group select-wrapper">
            <select style={inputStyle} defaultValue="">
              <option value="" disabled hidden>Выберите курс</option>
              <option value="3">3 курс</option>
              <option value="4">4 курс</option>
            </select>
          </div>

          <div className="input-group">
            <input type="text" placeholder="Введите группу" style={inputStyle} />
          </div>

          <div className="stack-section">
            <p className="stack-title" style={{ color: theme.hint }}>Стек технологий</p>
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

          <div className="edit-actions-row">
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => setIsModalOpen(true)}
              style={primaryButtonStyle}
            >
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={onBack} style={secondaryButtonStyle}>
              Отмена
            </button>
          </div>
        </form>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Подтверждение действия"
        message="Вы уверены?"
        onConfirm={() => {
          setIsModalOpen(false);
          onBack();
        }}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Подтвердить"
        cancelText="Отмена"
        theme={{
          bg: theme.bg,
          text: theme.text,
          buttonPrimary: theme.buttonPrimary,
          secondaryBg: theme.secondaryBg
        }}
      />

      {/* Нижнее меню (статичное) */}
      <nav className="bottom-nav" style={{ backgroundColor: theme.secondaryBg }}>
        <div className="nav-item" onClick={onGoToGroup}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span>Моя группа</span>
        </div>
        <div className="nav-item active" style={{ color: theme.buttonPrimary }} onClick={onGoToCabinet}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <span>Мой кабинет</span>
        </div>
        <div className="nav-item" onClick={onGoToGrades}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
          </svg>
          <span>Успеваемость</span>
        </div>
      </nav>
    </div>
  );
};

export default EditProfilePage;
