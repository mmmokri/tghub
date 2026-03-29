declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready(): void;
        colorScheme: 'light' | 'dark';
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        initDataUnsafe?: {
          user?: {
            username?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}

export {};