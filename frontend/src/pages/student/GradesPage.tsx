import React, { useEffect, useState } from 'react';
import '../../styles/student/GradesPage.css';

interface GradesPageProps {
  onGoToCabinet: () => void;
  onGoToGroup: () => void;
}

const GradesPage: React.FC<GradesPageProps> = ({ onGoToCabinet, onGoToGroup }) => {
  const [theme, setTheme] = useState({
    bg: '#1A2026',
    text: '#FFFFFF',
    hint: '#8E949A',
    buttonPrimary: '#248BDA',
    secondaryBg: '#212932',
    accent: '#248BDA',
  });

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

  const gradeData = [
    {
      id: 1,
      name: 'Иванов Иван',
      period: '17.11.25-26.12.25',
      grades: [4, 4, 4, 4],
      finalGrade: 4
    },
    {
      id: 2,
      name: 'Иванов Иван',
      period: '17.11.24-26.12.24',
      grades: [5, 3, 5, 3],
      finalGrade: 4
    }
  ];

  const containerStyle = { backgroundColor: theme.bg, color: theme.text };
  const cardStyle = { backgroundColor: theme.secondaryBg };
  const hintStyle = { color: theme.hint };
  const gradeCircleStyle = { borderColor: theme.accent, color: theme.accent };

  return (
    <div className="grades-container" style={containerStyle}>
      <header className="grades-header">
        <h1>Успеваемость</h1>
      </header>

      <main className="grades-content">
        {gradeData.map(item => (
          <section key={item.id} className="grade-card" style={cardStyle}>
            <p className="grade-period" style={hintStyle}>{item.period}</p>
            <h2 className="grade-name">{item.name}</h2>
            <div className="grades-wrapper">
              <div className="current-grades">
                {item.grades.map((grade, idx) => (
                  <div key={idx} className="grade-circle" style={gradeCircleStyle}>
                    {grade}
                  </div>
                ))}
              </div>
              <div className="final-grade-wrapper">
                <div className="grade-circle final" style={gradeCircleStyle}>
                  {item.finalGrade}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Нижнее меню */}
      <nav className="bottom-nav" style={{ backgroundColor: theme.secondaryBg }}>
        <div className="nav-item" onClick={onGoToGroup}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span>Моя группа</span>
        </div>
        <div className="nav-item" onClick={onGoToCabinet}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <span>Мой кабинет</span>
        </div>
        <div className="nav-item active" style={{ color: theme.accent }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
          </svg>
          <span>Успеваемость</span>
        </div>
      </nav>
    </div>
  );
};

export default GradesPage;
