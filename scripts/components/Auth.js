import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Имя обязательно';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Симуляция запроса к серверу
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || formData.email)}&background=FF6B35&color=fff&size=150`
      };
      
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo и заголовок */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <i className="ph ph-rocket-launch text-2xl text-white"></i>
          </div>
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-2">
            Veloxity
          </h1>
          <p className="text-gray-600 font-martian text-sm">
            {isLogin ? 'Добро пожаловать обратно!' : 'Начните управлять проектами эффективно'}
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-2">
              {isLogin ? 'Вход в аккаунт' : 'Создание аккаунта'}
            </h2>
            <p className="text-gray-600 font-martian text-sm">
              {isLogin ? 'Введите свои данные для входа' : 'Заполните форму для регистрации'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Имя (только для регистрации) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-2xl font-martian text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Введите ваше имя"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 font-martian">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-2xl font-martian text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-martian">{errors.email}</p>
              )}
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-2xl font-martian text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Введите пароль"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-martian">{errors.password}</p>
              )}
            </div>

            {/* Подтверждение пароля (только для регистрации) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
                  Подтвердите пароль
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-2xl font-martian text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Повторите пароль"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-martian">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-2xl font-martian font-medium text-sm transition-all duration-200 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </div>
              ) : (
                isLogin ? 'Войти' : 'Создать аккаунт'
              )}
            </button>
          </form>

          {/* Переключение между входом и регистрацией */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-martian text-sm">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button
                onClick={toggleMode}
                className="ml-1 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>

        {/* Демо вход */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onLogin({
              id: 'demo',
              email: 'demo@projectflow.com',
              name: 'Demo User',
              avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=FF6B35&color=fff&size=150'
            })}
            className="text-gray-500 hover:text-gray-700 font-martian text-sm transition-colors duration-200"
          >
            Демо вход (без регистрации)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;