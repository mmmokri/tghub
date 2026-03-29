import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import '../../styles/student/StudentCabinetPage.css';

interface StudentCabinetPageProps {
  onGoToNotifications: () => void;
  onGoToEditProfile: () => void;
  onLogout: () => void;
  onGoToGroup: () => void;
  onGoToGrades: () => void;
}

const StudentCabinetPage: React.FC<StudentCabinetPageProps> = ({ onGoToNotifications, onGoToEditProfile, onLogout, onGoToGroup, onGoToGrades }) => {
  const [theme, setTheme] = useState({
    bg: '#1A2026',
    text: '#FFFFFF',
    hint: '#8E949A',
    buttonPrimary: '#248BDA',
    secondaryBg: '#212932',
    accent: '#248BDA',
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [tgUser, setTgUser] = useState<{ username?: string; photo_url?: string } | null>(null);

  // Имитация данных из БД
  const [userData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    course: '1 курс',
    group: 'Группа 09.02Б',
    university: 'ЧТПТиУ',
    stack: ['JS', 'React', 'TypeScript'],
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
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
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  const containerStyle = { backgroundColor: theme.bg, color: theme.text };
  const cardStyle = { backgroundColor: theme.secondaryBg };
  const hintStyle = { color: theme.hint };
  const tagStyle = { borderColor: theme.accent, color: theme.accent, backgroundColor: 'rgba(36, 139, 218, 0.1)' };

  return (
    <div className="cabinet-container" style={containerStyle}>
      <header className="cabinet-header">
        <h1>Мой кабинет</h1>
        <div className="notification-icon" onClick={onGoToNotifications}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </div>
      </header>

      <main className="cabinet-content">
        {/* Профиль */}
        <section className="profile-card" style={cardStyle}>
          {tgUser?.photo_url ? (
            <img src={tgUser.photo_url} alt="Profile" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder"></div>
          )}
          <div className="profile-info">
            <h2>{userData.firstName} {userData.lastName}</h2>
            <p className="username" style={hintStyle}>@{tgUser?.username || 'username'}</p>
            <div className="profile-tags">
              {userData.course && <span className="tag" style={tagStyle}>{userData.course}</span>}
              {userData.group && <span className="tag" style={tagStyle}>{userData.group}</span>}
              {userData.stack && userData.stack.map(item => (
                <span key={item} className="tag" style={tagStyle}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Обучение */}
        {userData.university && (
          <section className="cabinet-section">
            <h3>Обучение</h3>
            <div className="info-card" style={cardStyle}>
              <div className="icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </div>
              <span className="info-text">{userData.university}</span>
            </div>
          </section>
        )}

        {/* Задачи */}
        <section className="cabinet-section">
          <h3>Задачи</h3>
          <div className="tasks-placeholder" style={cardStyle}>
            <p style={hintStyle}>Здесь пока ничего нет</p>
          </div>
        </section>

        <div className="cabinet-actions">
          <button className="btn btn-primary" onClick={onGoToEditProfile} style={{ backgroundColor: theme.buttonPrimary, color: '#FFFFFF' }}>
            Редактировать профиль
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsLogoutModalOpen(true)}
            style={{ backgroundColor: theme.secondaryBg, color: '#FF4B4B' }}
          >
            Выйти
          </button>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Подтверждение действия"
        message="Вы уверены?"
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          onLogout();
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
        confirmText="Подтвердить"
        cancelText="Отмена"
        theme={{
          bg: theme.bg,
          text: theme.text,
          buttonPrimary: theme.buttonPrimary,
          secondaryBg: theme.secondaryBg
        }}
      />

      {/* Нижнее меню */}
      <nav className="bottom-nav" style={{ backgroundColor: theme.secondaryBg }}>
        <div className="nav-item" onClick={onGoToGroup}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span>Моя группа</span>
        </div>
        <div className="nav-item active" style={{ color: theme.accent }}>
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

export default StudentCabinetPage;
