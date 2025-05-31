import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { StorageManager } from '../storage';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    tasks: 0,
    projects: 0,
    teams: 0,
    pendingTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState('task');

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = () => {
    const tasks = StorageManager.getTasks();
    const projects = StorageManager.getProjects();
    const teams = StorageManager.getTeams();
    const pendingTasks = tasks.filter(task => task.status !== 'done').length;

    setStats({
      tasks: tasks.length,
      projects: projects.length,
      teams: teams.length,
      pendingTasks
    });
  };

  const loadRecentActivity = () => {
    const tasks = StorageManager.getTasks();
    const projects = StorageManager.getProjects();
    const teams = StorageManager.getTeams();

    const allItems = [
      ...tasks.map(item => ({ ...item, type: 'task', icon: '✓' })),
      ...projects.map(item => ({ ...item, type: 'project', icon: '📁' })),
      ...teams.map(item => ({ ...item, type: 'team', icon: '👥' }))
    ];

    // Сортируем по дате создания
    const sorted = allItems
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setRecentActivity(sorted);
  };

  const handleQuickAdd = (data) => {
    if (quickAddType === 'task') {
      StorageManager.addTask({
        title: data.title,
        description: data.description || '',
        priority: 'medium',
        projectId: data.projectId
      });
    } else if (quickAddType === 'project') {
      StorageManager.addProject({
        name: data.title,
        description: data.description || '',
        status: 'planning',
        priority: 'medium'
      });
    }
    
    setShowQuickAdd(false);
    loadStats();
    loadRecentActivity();
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Приветствие */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-3 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800">
                {getTimeOfDay()}, {user.name}!
              </h1>
              <p className="text-gray-600 font-martian">
                Готовы к продуктивному дню?
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowQuickAdd(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Быстрое добавление</span>
          </button>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-martian text-gray-600 mb-1">К выполнению</p>
              <p className="text-2xl font-playfair font-bold text-gray-800">{stats.pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <i className="ph ph-check-circle text-white"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-martian text-gray-600 mb-1">Всего задач</p>
              <p className="text-2xl font-playfair font-bold text-gray-800">{stats.tasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <i className="ph ph-list text-white"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-martian text-gray-600 mb-1">Проекты</p>
              <p className="text-2xl font-playfair font-bold text-gray-800">{stats.projects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <i className="ph ph-cards-three text-white"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-martian text-gray-600 mb-1">Команды</p>
              <p className="text-2xl font-playfair font-bold text-gray-800">{stats.teams}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <i className="ph ph-users-three text-white"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия и активность */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Быстрые действия */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-playfair font-bold text-gray-800 mb-4">
              Быстрые действия
            </h2>
            <div className="space-y-3">
              <Link
                to="/teams"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <i className="ph ph-users-three text-white"></i>
                </div>
                <div>
                  <p className="font-martian font-medium text-gray-800">Управление командами</p>
                  <p className="text-sm text-gray-600">Создать или изменить команду</p>
                </div>
              </Link>

              <Link
                to="/projects"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <i className="ph ph-cards-three text-white"></i>
                </div>
                <div>
                  <p className="font-martian font-medium text-gray-800">Новый проект</p>
                  <p className="text-sm text-gray-600">Создать новый проект</p>
                </div>
              </Link>

              <Link
                to="/search"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <i className="ph ph-magnifying-glass text-white"></i>
                </div>
                <div>
                  <p className="font-martian font-medium text-gray-800">Поиск</p>
                  <p className="text-sm text-gray-600">Найти задачи, проекты, команды</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Недавняя активность */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-playfair font-bold text-gray-800 mb-4">
              Недавняя активность
            </h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-martian font-medium text-gray-800">
                        {item.title || item.name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="capitalize">{item.type === 'task' ? 'Задача' : item.type === 'project' ? 'Проект' : 'Команда'}</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    {item.status && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-martian ${
                        item.status === 'done' ? 'bg-green-100 text-green-800' :
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'done' ? 'Выполнено' :
                         item.status === 'in-progress' ? 'В работе' :
                         item.status === 'todo' ? 'К выполнению' : item.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-martian">Пока нет активности</p>
                <p className="text-sm text-gray-400 font-martian mt-1">Создайте первую задачу или проект</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно быстрого добавления */}
      {showQuickAdd && (
        <QuickAddModal
          type={quickAddType}
          onTypeChange={setQuickAddType}
          onSubmit={handleQuickAdd}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
};

// Компонент модального окна для быстрого добавления
const QuickAddModal = ({ type, onTypeChange, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: ''
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (type === 'task') {
      setProjects(StorageManager.getProjects());
    }
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
      setFormData({ title: '', description: '', projectId: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-playfair font-bold text-gray-800">
            Быстрое добавление
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="ph ph-x text-lg"></i>
          </button>
        </div>

        {/* Переключатель типа */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => onTypeChange('task')}
            className={`flex-1 py-2 px-4 rounded-lg font-martian text-sm transition-all duration-200 ${
              type === 'task' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
            }`}
          >
            Задача
          </button>
          <button
            onClick={() => onTypeChange('project')}
            className={`flex-1 py-2 px-4 rounded-lg font-martian text-sm transition-all duration-200 ${
              type === 'project' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
            }`}
          >
            Проект
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
              {type === 'task' ? 'Название задачи' : 'Название проекта'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={type === 'task' ? 'Введите название задачи' : 'Введите название проекта'}
              required
            />
          </div>

          {type === 'task' && projects.length > 0 && (
            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
                Проект (опционально)
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Выберите проект</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-1">
              Описание (опционально)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Добавьте описание..."
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-martian font-medium transition-colors duration-200 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;