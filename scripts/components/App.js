import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';

// Импортируем компоненты
import Auth from './Auth';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Teams from './Teams';
import Projects from './Projects';
import Search from './Search';
import Tasks from './Tasks';
import Settings from './Settings';
import Navbar from './Navbar';

// Утилита для работы с localStorage
import { StorageManager } from '../storage';

const App = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const savedUser = StorageManager.getUser();
    const savedTheme = StorageManager.getTheme();
    const onboardingStatus = StorageManager.getOnboardingStatus();
    
    if (savedUser) {
      setUser(savedUser);
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsOnboarded(onboardingStatus);
  }, []);

  useEffect(() => {
    // Применяем тему
    document.documentElement.className = theme;
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
    StorageManager.setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    StorageManager.clearUser();
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    StorageManager.setOnboardingStatus(true);
  };

  // Если пользователь не авторизован
  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
          <Routes>
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // Если пользователь не прошел онбординг
  if (!isOnboarded) {
    return (
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
          <Onboarding onComplete={handleOnboardingComplete} user={user} />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        'bg-gradient-to-br from-orange-50 to-orange-100'
      }`}>
        <Navbar user={user} onLogout={handleLogout} theme={theme} />
        
        <main className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/search" element={<Search />} />
            <Route path="/projects/:projectId/tasks" element={<Tasks />} />
            <Route path="/settings" element={
              <Settings 
                user={user} 
                onUserUpdate={setUser}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;