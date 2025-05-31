import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { StorageManager } from '../storage';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedTeam]);

  const loadData = () => {
    const projectsData = StorageManager.getProjects();
    const teamsData = StorageManager.getTeams();
    setProjects(projectsData);
    setTeams(teamsData);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Фильтр по команде
    if (selectedTeam) {
      filtered = filtered.filter(project => project.teamId === selectedTeam);
    }

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = (projectId) => {
    StorageManager.deleteProject(projectId);
    loadData();
    setShowDeleteConfirm(null);
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      StorageManager.updateProject(editingProject.id, projectData);
    } else {
      StorageManager.addProject(projectData);
    }
    loadData();
    setShowModal(false);
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Без команды';
  };

  const getTeamColor = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.color : '#6B7280';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок и поиск */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
            Проекты
          </h1>
          <p className="text-gray-600 font-martian">
            Управляйте проектами и отслеживайте прогресс
          </p>
        </div>
        <button
          onClick={handleCreateProject}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Создать проект</span>
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Поиск */}
          <div className="md:col-span-2">
            <div className="relative">
              <i className="ph ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск проектов..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Фильтр по команде */}
          <div>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 appearance-none py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Все команды</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Активные фильтры */}
        {(searchQuery || selectedTeam) && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-martian">Активные фильтры:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-martian flex items-center space-x-1">
                <span>Поиск: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTeam && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-martian flex items-center space-x-1">
                <span>Команда: {getTeamName(selectedTeam)}</span>
                <button
                  onClick={() => setSelectedTeam('')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Список проектов */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              teamName={getTeamName(project.teamId)}
              teamColor={getTeamColor(project.teamId)}
              onEdit={() => handleEditProject(project)}
              onDelete={() => setShowDeleteConfirm(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <i className="ph ph-cards-three text-gray-700 mb-6 text-5xl"></i>
          <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2">
            {searchQuery || selectedTeam ? 'Проекты не найдены' : 'Пока нет проектов'}
          </h3>
          <p className="text-gray-600 font-martian mb-6">
            {searchQuery || selectedTeam
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первый проект для начала работы'
            }
          </p>
          {!searchQuery && !selectedTeam && (
            <button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Создать проект
            </button>
          )}
        </div>
      )}

      {/* Модальное окно проекта */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          teams={teams}
          onSave={handleSaveProject}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Подтверждение удаления */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          projectName={projects.find(p => p.id === showDeleteConfirm)?.name}
          onConfirm={() => handleDeleteProject(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// Компонент карточки проекта
const ProjectCard = ({ project, teamName, teamColor, onEdit, onDelete }) => {
  const tasks = StorageManager.getTasksByProject(project.id);
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'planning':
        return { label: 'Планирование', color: 'bg-yellow-100 text-yellow-800' };
      case 'active':
        return { label: 'Активный', color: 'bg-green-100 text-green-800' };
      case 'on-hold':
        return { label: 'На паузе', color: 'bg-orange-100 text-orange-800' };
      case 'completed':
        return { label: 'Завершен', color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high':
        return { label: 'Высокий', color: 'text-red-600' };
      case 'medium':
        return { label: 'Средний', color: 'text-yellow-600' };
      case 'low':
        return { label: 'Низкий', color: 'text-green-600' };
      default:
        return { label: priority, color: 'text-gray-600' };
    }
  };

  const statusInfo = getStatusInfo(project.status);
  const priorityInfo = getPriorityInfo(project.priority);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 group">
      {/* Заголовок проекта */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/projects/${project.id}/tasks`}
            className="block group-hover:text-orange-600 transition-colors duration-200"
          >
            <h3 className="text-lg font-playfair font-bold text-gray-800 mb-1">
              {project.name}
            </h3>
          </Link>
          <div className="flex items-center space-x-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: teamColor }}
            ></span>
            <span className="text-sm text-gray-600 font-martian">{teamName}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Редактировать"
          >
            <i className="ph ph-pencil-line"></i>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Удалить"
          >
            <i className="ph ph-trash"></i>
          </button>
        </div>
      </div>

      {/* Описание */}
      {project.description && (
        <p className="text-gray-600 font-martian text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Статус и приоритет */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-martian ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
        <div className="flex items-center space-x-1">
          <i className="ph ph-rocket-launch"></i>
          <span className={`text-xs font-martian ${priorityInfo.color}`}>
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* Прогресс */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-martian text-gray-600">Прогресс задач</span>
          <span className="text-sm font-martian text-gray-800 font-medium">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500 font-martian text-right">
          {Math.round(progress)}% завершено
        </div>
      </div>

      {/* Кнопка просмотра задач */}
      <Link
        to={`/projects/${project.id}/tasks`}
        className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-200 text-gray-700 rounded-xl font-martian font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>Канбан-доска</span>
      </Link>
    </div>
  );
};

// Модальное окно для создания/редактирования проекта
const ProjectModal = ({ project, teams, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    teamId: project?.teamId || '',
    status: project?.status || 'planning',
    priority: project?.priority || 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            {project ? 'Редактировать проект' : 'Создать проект'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
              Название проекта
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Введите название проекта"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
              Команда
            </label>
            <select
              value={formData.teamId}
              onChange={(e) => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
              className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Без команды</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="planning">Планирование</option>
                <option value="active">Активный</option>
                <option value="on-hold">На паузе</option>
                <option value="completed">Завершен</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Описание проекта..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
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
              {project ? 'Сохранить' : 'Создать проект'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Модальное окно подтверждения удаления
const DeleteConfirmModal = ({ projectName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-playfair font-bold text-gray-800 mb-2">
            Удалить проект
          </h3>
          <p className="text-gray-600 font-martian mb-6">
            Вы уверены, что хотите удалить проект "{projectName}"? 
            Все связанные задачи также будут удалены.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-martian font-medium transition-colors duration-200 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-martian font-medium transition-colors duration-200 hover:bg-red-700"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;