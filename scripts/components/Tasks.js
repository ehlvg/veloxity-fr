import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { StorageManager } from '../storage';

const Tasks = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const columns = [
    { id: 'todo', title: 'К выполнению', color: 'bg-gray-50 border-gray-200' },
    { id: 'in-progress', title: 'В работе', color: 'bg-blue-50 border-blue-200' },
    { id: 'review', title: 'На проверке', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'done', title: 'Выполнено', color: 'bg-green-50 border-green-200' }
  ];

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = () => {
    const projectData = StorageManager.getProjects().find(p => p.id === projectId);
    setProject(projectData);
    
    const tasksData = StorageManager.getTasksByProject(projectId);
    setTasks(tasksData);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSaveTask = (taskData) => {
    const taskWithProject = { ...taskData, projectId };
    
    if (editingTask) {
      StorageManager.updateTask(editingTask.id, taskWithProject);
    } else {
      StorageManager.addTask(taskWithProject);
    }
    
    loadData();
    setShowModal(false);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      StorageManager.deleteTask(taskId);
      loadData();
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Проверяем, что мы действительно покидаем колонку
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== columnId) {
      StorageManager.updateTask(draggedTask.id, { status: columnId });
      loadData();
    }
    
    setDraggedOverColumn(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTeamName = () => {
    if (!project?.teamId) return 'Без команды';
    const teams = StorageManager.getTeams();
    const team = teams.find(t => t.id === project.teamId);
    return team ? team.name : 'Без команды';
  };

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            Проект не найден
          </h1>
          <Link to="/projects" className="text-orange-600 hover:text-orange-700 font-martian">
            Вернуться к проектам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок проекта */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link
              to="/projects"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800">
              {project.name}
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="font-martian text-sm">{getTeamName()}</span>
            <span className="text-gray-400">•</span>
            <span className="font-martian text-sm">{tasks.length} задач</span>
          </div>
        </div>
        
        <button
          onClick={handleCreateTask}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Добавить задачу</span>
        </button>
      </div>

      {/* Канбан доска */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`bg-white rounded-2xl p-4 shadow-md border ${column.color} ${
              draggedOverColumn === column.id ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
            } transition-all duration-200`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Заголовок колонки */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair font-bold text-gray-800">
                {column.title}
              </h3>
              <span className="bg-gray-200 text-gray-700 text-xs font-martian px-2 py-1 rounded-full">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            {/* Задачи */}
            <div className="space-y-3 min-h-[200px]">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedTask?.id === task.id}
                />
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <i className="ph ph-clipboard mx-auto mb-2 opacity-50 text-lg"></i>
                  <p className="text-sm font-martian">Пусто</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно задачи */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Компонент карточки задачи
const TaskCard = ({ task, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Touch handlers для мобильных устройств
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      // Здесь можно добавить логику для смены статуса свайпом
      console.log('Swipe detected:', isLeftSwipe ? 'left' : 'right');
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move group ${
        isDragging ? '' : ''
      }`}
    >
      {/* Заголовок задачи */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-martian font-medium text-gray-800 text-sm line-clamp-2 flex-1 pr-2">
          {task.title}
        </h4>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="Редактировать"
          >
            <i className="ph ph-pencil-line"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
            title="Удалить"
          >
            <i className="ph ph-trash"></i>
          </button>
        </div>
      </div>

      {/* Описание */}
      {task.description && (
        <p className="text-gray-600 font-martian text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Метаданные */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-martian font-medium text-xs">
                  {task.assignee.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-600 font-martian">{task.assignee}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {task.priority && (
            <span className={`w-2 h-2 rounded-full ${
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} title={`${task.priority} приоритет`}></span>
          )}
          <span className="text-gray-500 font-martian">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для создания/редактирования задачи
const TaskModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    assignee: task?.assignee || '',
    status: task?.status || 'todo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            {task ? 'Редактировать задачу' : 'Создать задачу'}
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
              Название задачи
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Введите название задачи"
              required
            />
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
              placeholder="Описание задачи..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 appearance-none border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="todo">К выполнению</option>
                <option value="in-progress">В работе</option>
                <option value="review">На проверке</option>
                <option value="done">Выполнено</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
              Исполнитель
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Имя исполнителя"
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
              {task ? 'Сохранить' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tasks;