import React, { useEffect, useState } from "react";
import "../../styles/common/WelcomePage.css";

interface WelcomePageProps {
  onCreateProfile: () => void;
  onLogin: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  onCreateProfile,
  onLogin,
}) => {
  const [theme, setTheme] = useState({
    bg: "#1A2026",
    text: "#FFFFFF",
    hint: "#8E949A",
    buttonLogin: "#248BDA",
    buttonCreate: "#212932",
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      const params = tg.themeParams;

      if (params) {
        setTheme({
          bg: params.bg_color || "#1A2026",
          text: params.text_color || "#FFFFFF",
          hint: params.hint_color || "#8E949A",
          buttonLogin: params.button_color || "#248BDA",
          buttonCreate: params.secondary_bg_color || "#212932",
        });
      }
    }
  }, []);

  const containerStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
  };

  const loginButtonStyle = {
    backgroundColor: theme.buttonLogin,
    color: "#FFFFFF",
  };

  const createButtonStyle = {
    backgroundColor: theme.buttonCreate,
    color: theme.text,
  };

  const hintStyle = {
    color: theme.hint,
  };

  return (
    <div className="welcome-container" style={containerStyle}>
      <div className="logo-container">
        <div className="logo-circle">
          <img src="/logo.svg" alt="Logo" className="logo-img" />
        </div>
      </div>

      <h1 className="welcome-title">VJ Track</h1>

      <div className="welcome-description" style={hintStyle}>
        <p>Студенты — легко фиксируйте успехи и формируйте мини-резюме.</p>
        <p>Руководители — контролируйте прогресс и создавайте базу талантов.</p>
        <p>Всё в одном месте.</p>
      </div>

      <div className="actions-container">
        <button
          className="btn btn-primary"
          onClick={onLogin}
          style={loginButtonStyle}
        >
          Войти в профиль
        </button>
        <button
          className="btn btn-secondary"
          onClick={onCreateProfile}
          style={createButtonStyle}
        >
          Создать профиль
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
