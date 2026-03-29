import { useEffect, useState } from 'react';
import WelcomePage from './pages/common/WelcomePage';
import CreateProfilePage from './pages/common/CreateProfilePage';
import LoginPage from './pages/common/LoginPage';
import StudentCabinetPage from './pages/student/StudentCabinetPage';
import NotificationsPage from './pages/student/NotificationsPage';
import EditProfilePage from './pages/student/EditProfilePage';
import MyGroupPage from './pages/student/MyGroupPage';
import GradesPage from './pages/student/GradesPage';
import AdminCabinetPage from './pages/admin/AdminCabinetPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminAddTaskPage from './pages/admin/AdminAddTaskPage';
import AdminTasksPage from './pages/admin/AdminTasksPage';
import AdminEditTaskPage from './pages/admin/AdminEditTaskPage';
import AdminEditProfilePage from './pages/admin/AdminEditProfilePage';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type Page = 'welcome' | 'create_profile' | 'login' | 'cabinet' | 'notifications' | 'edit_profile' | 'my_group' | 'grades' | 'admin_cabinet' | 'admin_notifications' | 'admin_add_task' | 'admin_tasks' | 'admin_edit_task' | 'admin_edit_profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Автоматическая авторизация через Telegram при загрузке
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      const userData = tg.initDataUnsafe?.user;
      const initData = tg.initData;

      if (userData) {
        fetch(`${API_URL}/api/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, userData })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
            // Если пользователь уже есть в БД, перенаправляем в кабинет
            setCurrentPage(data.user.role === 'admin' ? 'admin_cabinet' : 'cabinet');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Auth error:', err);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const goToCreateProfile = () => setCurrentPage('create_profile');
  const goToLogin = () => setCurrentPage('login');
  const goToWelcome = () => setCurrentPage('welcome');
  const goToCabinet = () => setCurrentPage('cabinet');
  const goToAdminCabinet = () => setCurrentPage('admin_cabinet');
  const goToNotifications = () => setCurrentPage('notifications');
  const goToAdminNotifications = () => setCurrentPage('admin_notifications');
  const goToAdminAddTask = () => setCurrentPage('admin_add_task');
  const goToAdminTasks = () => setCurrentPage('admin_tasks');
  const goToAdminEditTask = () => setCurrentPage('admin_edit_task');
  const goToAdminEditProfile = () => setCurrentPage('admin_edit_profile');
  const goToEditProfile = () => setCurrentPage('edit_profile');
  const goToMyGroup = () => setCurrentPage('my_group');
  const goToGrades = () => setCurrentPage('grades');

  // Функция для обработки входа/регистрации (для тестирования без TG или ручного ввода)
  const handleAuthSuccess = (username: string) => {
    // В реальном приложении здесь был бы запрос к API
    // Пока сохраняем логику: если в логине есть 'admin' - это админ
    const role = username.toLowerCase().includes('admin') ? 'admin' : 'student';
    setUser({ username, role });
    setCurrentPage(role === 'admin' ? 'admin_cabinet' : 'cabinet');
  };

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage onCreateProfile={goToCreateProfile} onLogin={goToLogin} />
      )}
      {currentPage === 'create_profile' && (
        <CreateProfilePage 
          onBack={goToWelcome} 
          onGoToLogin={goToLogin} 
          onRegister={handleAuthSuccess}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onBack={goToWelcome} 
          onGoToCreate={goToCreateProfile} 
          onLogin={handleAuthSuccess}
        />
      )}
      {currentPage === 'cabinet' && (
        <StudentCabinetPage 
          onGoToNotifications={goToNotifications} 
          onGoToEditProfile={goToEditProfile} 
          onLogout={goToWelcome}
          onGoToGroup={goToMyGroup}
          onGoToGrades={goToGrades}
        />
      )}
      {currentPage === 'admin_cabinet' && (
        <AdminCabinetPage 
          onGoToNotifications={goToAdminNotifications} 
          onGoToEditProfile={goToAdminEditProfile} 
          onLogout={goToWelcome}
          onGoToCabinet={goToAdminCabinet}
          onGoToGrades={goToGrades}
          onAddTask={goToAdminAddTask}
          onViewTasks={goToAdminTasks}
        />
      )}
      {currentPage === 'notifications' && (
        <NotificationsPage 
          onBack={goToCabinet} 
          onGoToGroup={goToMyGroup} 
          onGoToCabinet={goToCabinet} 
          onGoToGrades={goToGrades} 
        />
      )}
      {currentPage === 'admin_notifications' && (
        <AdminNotificationsPage 
          onBack={goToAdminCabinet} 
          onGoToCabinet={goToAdminCabinet} 
          onGoToGrades={goToGrades} 
        />
      )}
      {currentPage === 'admin_add_task' && (
        <AdminAddTaskPage 
          onBack={goToAdminCabinet} 
          onGoToCabinet={goToAdminCabinet} 
          onGoToGrades={goToGrades} 
        />
      )}
      {currentPage === 'admin_tasks' && (
        <AdminTasksPage 
          onBack={goToAdminCabinet} 
          onGoToCabinet={goToAdminCabinet} 
          onGoToGrades={goToGrades} 
          onEditTask={goToAdminEditTask}
        />
      )}
      {currentPage === 'admin_edit_task' && (
        <AdminEditTaskPage 
          onBack={goToAdminTasks} 
          onGoToCabinet={goToAdminCabinet} 
          onGoToGrades={goToGrades} 
        />
      )}
      {currentPage === 'admin_edit_profile' && (
        <AdminEditProfilePage 
          onBack={goToAdminCabinet} 
          onSave={() => goToAdminCabinet()} 
          onCancel={() => goToAdminCabinet()} 
          onGoToCabinet={goToAdminCabinet}
          onGoToGrades={goToGrades}
        />
      )}
      {currentPage === 'edit_profile' && (
        <EditProfilePage 
          onBack={goToCabinet} 
          onGoToGroup={goToMyGroup} 
          onGoToGrades={goToGrades} 
          onGoToCabinet={goToCabinet} 
        />
      )}
      {currentPage === 'my_group' && (
        <MyGroupPage onGoToCabinet={goToCabinet} onGoToGrades={goToGrades} />
      )}
      {currentPage === 'grades' && (
        <GradesPage onGoToCabinet={goToCabinet} onGoToGroup={goToMyGroup} />
      )}
    </div>
  )
}

export default App
