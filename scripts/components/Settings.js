import React, { useState } from 'react';
import { StorageManager } from '../storage';

const Settings = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: 'user' },
    { id: 'appearance', label: 'Внешний вид', icon: 'palette' },
    { id: 'security', label: 'Безопасность', icon: 'shield' }
  ];

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
          Настройки
        </h1>
        <p className="text-gray-600 font-martian">
          Управляйте своим профилем и предпочтениями
        </p>
      </div>

      {/* Уведомление об успехе */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-martian text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Боковая навигация */}
        <div className="lg:col-span-2">
          <nav className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-martian text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <TabIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100">
            {activeTab === 'profile' && (
              <ProfileTab 
                user={user} 
                onUserUpdate={onUserUpdate} 
                onSuccess={handleSuccess}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {activeTab === 'appearance' && (
              <AppearanceTab 
                onSuccess={handleSuccess}
              />
            )}
            {activeTab === 'security' && (
              <SecurityTab 
                onSuccess={handleSuccess}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент иконок для табов
const TabIcon = ({ icon }) => {
  const icons = {
    user: (
      <i className="ph ph-user-circle"></i>
    ),
    palette: (
      <i className="ph ph-palette"></i>
    ),
    shield: (
      <i className="ph ph-shield"></i>
    )
  };
  
  return icons[icon] || icons.user;
};

// Таб профиля
const ProfileTab = ({ user, onUserUpdate, onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Симуляция сохранения
    setTimeout(() => {
      const updatedUser = { ...user, ...formData };
      onUserUpdate(updatedUser);
      StorageManager.setUser(updatedUser);
      setIsLoading(false);
      onSuccess('Профиль успешно обновлен');
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-playfair font-bold text-gray-800 mb-2">
          Информация профиля
        </h2>
        <p className="text-gray-600 font-martian text-sm">
          Обновите информацию о своем профиле
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Аватар */}
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl border-2 border-gray-200 shadow-sm"
          />
          <div>
            <h3 className="font-martian font-medium text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-600 font-martian">{user.email}</p>
          </div>
        </div>

        {/* Поля формы */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ваше имя"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Сохранение...
              </div>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Таб внешнего вида
const AppearanceTab = ({ onSuccess }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-playfair font-bold text-gray-800 mb-2">
          Внешний вид
        </h2>
        <p className="text-gray-600 font-martian text-sm">
          Настройте внешний вид приложения под ваши предпочтения
        </p>
      </div>

      <div className="space-y-6">
        {/* Выбор темы */}
        <div>
          <h3 className="font-martian font-medium text-gray-800 mb-4">Тема</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Светлая тема */}
            <button
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                'light'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <i className="ph ph-sun text-xl text-orange-500"></i>
                <span className="font-martian text-sm text-gray-800">Светлая</span>
              </div>
            </button>
          </div>
        </div>

        {/* Дополнительные настройки */}
        <div>
          <h3 className="font-martian font-medium text-gray-800 mb-4">Дополнительные настройки</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-martian font-medium text-gray-800 text-sm">Анимации</p>
                <p className="text-gray-600 font-martian text-xs">Включить плавные переходы и анимации</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only"
                />
                <div className="w-10 h-6 bg-orange-500 rounded-full shadow-inner flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow ml-1 transform translate-x-4 transition-transform duration-200"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-martian font-medium text-gray-800 text-sm">Компактный режим</p>
                <p className="text-gray-600 font-martian text-xs">Уменьшить отступы и размер элементов</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow ml-1 transition-transform duration-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Таб безопасности
const SecurityTab = ({ onSuccess, isLoading, setIsLoading }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});

    // Валидация
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Введите текущий пароль';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Пароль должен быть не менее 6 символов';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Симуляция смены пароля
    setTimeout(() => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsLoading(false);
      onSuccess('Пароль успешно изменен');
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-playfair font-bold text-gray-800 mb-2">
          Безопасность
        </h2>
        <p className="text-gray-600 font-martian text-sm">
          Управляйте безопасностью вашего аккаунта
        </p>
      </div>

      <div className="space-y-8">
        {/* Смена пароля */}
        <div>
          <h3 className="font-martian font-medium text-gray-800 mb-4">Смена пароля</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Введите текущий пароль"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-red-600 font-martian">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Введите новый пароль"
              />
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-600 font-martian">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Повторите новый пароль"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 font-martian">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Изменение...
                  </div>
                ) : (
                  'Изменить пароль'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Дополнительная безопасность */}
        <div>
          <h3 className="font-martian font-medium text-gray-800 mb-4">Дополнительная безопасность</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-martian font-medium text-gray-800 text-sm">Двухфакторная аутентификация</p>
                <p className="text-gray-600 font-martian text-xs">Дополнительная защита вашего аккаунта</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-martian text-sm hover:bg-blue-700 transition-colors duration-200">
                Настроить
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-martian font-medium text-gray-800 text-sm">Уведомления о входе</p>
                <p className="text-gray-600 font-martian text-xs">Получать уведомления о новых входах в аккаунт</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only"
                />
                <div className="w-10 h-6 bg-orange-500 rounded-full shadow-inner flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow ml-1 transform translate-x-4 transition-transform duration-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;