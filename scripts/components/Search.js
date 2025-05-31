import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { StorageManager } from '../storage';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    teams: [],
    projects: [],
    tasks: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Фокус на поле поиска при загрузке
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults({ teams: [], projects: [], tasks: [] });
      setHasSearched(false);
    }
  }, [query]);

  const performSearch = () => {
    setIsSearching(true);
    
    // Имитация задержки поиска
    setTimeout(() => {
      const searchResults = StorageManager.searchAll(query);
      setResults(searchResults);
      setIsSearching(false);
      setHasSearched(true);
    }, 300);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults({ teams: [], projects: [], tasks: [] });
    setHasSearched(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const getTotalResults = () => {
    return results.teams.length + results.projects.length + results.tasks.length;
  };

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'teams':
        return { teams: results.teams, projects: [], tasks: [] };
      case 'projects':
        return { teams: [], projects: results.projects, tasks: [] };
      case 'tasks':
        return { teams: [], projects: [], tasks: results.tasks };
      default:
        return results;
    }
  };

  const getTeamName = (teamId) => {
    const teams = StorageManager.getTeams();
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Без команды';
  };

  const getProjectName = (projectId) => {
    const projects = StorageManager.getProjects();
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Неизвестный проект';
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const filteredResults = getFilteredResults();
  const totalResults = getTotalResults();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
          Поиск
        </h1>
        <p className="text-gray-600 font-martian">
          Найдите команды, проекты и задачи
        </p>
      </div>

      {/* Поле поиска */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите запрос для поиска..."
            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl font-martian text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {isSearching && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin w-5 h-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Результаты поиска */}
      {hasSearched && (
        <>
          {/* Статистика и табы */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-600 font-martian">
                  {totalResults > 0 ? (
                    <>Найдено {totalResults} результат{totalResults === 1 ? '' : totalResults < 5 ? 'а' : 'ов'} по запросу <span className="font-medium">"{query}"</span></>
                  ) : (
                    <>Ничего не найдено по запросу <span className="font-medium">"{query}"</span></>
                  )}
                </p>
              </div>
            </div>

            {/* Фильтры по типу */}
            {totalResults > 0 && (
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-martian text-sm transition-all duration-200 ${
                    activeTab === 'all'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Все ({totalResults})
                </button>
                {results.teams.length > 0 && (
                  <button
                    onClick={() => setActiveTab('teams')}
                    className={`px-4 py-2 rounded-lg font-martian text-sm transition-all duration-200 ${
                      activeTab === 'teams'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Команды ({results.teams.length})
                  </button>
                )}
                {results.projects.length > 0 && (
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-4 py-2 rounded-lg font-martian text-sm transition-all duration-200 ${
                      activeTab === 'projects'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Проекты ({results.projects.length})
                  </button>
                )}
                {results.tasks.length > 0 && (
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-4 py-2 rounded-lg font-martian text-sm transition-all duration-200 ${
                      activeTab === 'tasks'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Задачи ({results.tasks.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Результаты */}
          {totalResults > 0 ? (
            <div className="space-y-6">
              {/* Команды */}
              {filteredResults.teams.length > 0 && (
                <div>
                  <h3 className="text-lg font-playfair font-bold text-gray-800 mb-4 flex items-center">
                    <i className="ph ph-users-three"></i>
                    Команды
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredResults.teams.map((team) => (
                      <Link
                        key={team.id}
                        to="/teams"
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: team.color || '#FF6B35' }}
                          >
                            <i className="ph ph-users-three"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-martian font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                              {highlightText(team.name, query)}
                            </h4>
                            {team.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {highlightText(team.description, query)}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {team.members?.length || 0} участник{(team.members?.length || 0) === 1 ? '' : (team.members?.length || 0) < 5 ? 'а' : 'ов'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Проекты */}
              {filteredResults.projects.length > 0 && (
                <div>
                  <h3 className="text-lg font-playfair font-bold text-gray-800 mb-4 flex items-center">
                    <i className="ph ph-cards-three"></i>
                    Проекты
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredResults.projects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}/tasks`}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <i className="ph ph-cards-three"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-martian font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                              {highlightText(project.name, query)}
                            </h4>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {highlightText(project.description, query)}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-xs text-gray-500">
                                {getTeamName(project.teamId)}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs font-martian ${
                                project.status === 'active' ? 'bg-green-100 text-green-800' :
                                project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status === 'active' ? 'Активный' :
                                 project.status === 'planning' ? 'Планирование' :
                                 project.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Задачи */}
              {filteredResults.tasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-playfair font-bold text-gray-800 mb-4 flex items-center">
                    <i className="ph ph-check-circle"></i>
                    Задачи
                  </h3>
                  <div className="space-y-3">
                    {filteredResults.tasks.map((task) => (
                      <Link
                        key={task.id}
                        to={`/projects/${task.projectId}/tasks`}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group block"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            task.status === 'done' ? 'bg-green-100' :
                            task.status === 'in-progress' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            <i className="ph ph-check-circle"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-martian font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                              {highlightText(task.title, query)}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {highlightText(task.description, query)}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-xs text-gray-500">
                                {getProjectName(task.projectId)}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs font-martian ${
                                task.status === 'done' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status === 'done' ? 'Выполнено' :
                                 task.status === 'in-progress' ? 'В работе' :
                                 'К выполнению'}
                              </span>
                              {task.priority && (
                                <span className={`text-xs ${
                                  task.priority === 'high' ? 'text-red-600' :
                                  task.priority === 'medium' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {task.priority === 'high' ? 'Высокий' :
                                   task.priority === 'medium' ? 'Средний' :
                                   'Низкий'} приоритет
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <i className="ph ph-question w-24 h-24"></i>
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2">
                Ничего не найдено
              </h3>
              <p className="text-gray-600 font-martian mb-6">
                Попробуйте изменить поисковый запрос или создать новые элементы
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/teams"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-martian font-medium transition-colors duration-200 hover:bg-blue-700"
                >
                  Создать команду
                </Link>
                <Link
                  to="/projects"
                  className="px-4 py-2 bg-green-600 text-white rounded-xl font-martian font-medium transition-colors duration-200 hover:bg-green-700"
                >
                  Создать проект
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Пустое состояние */}
      {!hasSearched && !query && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2">
            Начните поиск
          </h3>
          <p className="text-gray-600 font-martian mb-6">
            Введите запрос в поле выше, чтобы найти команды, проекты или задачи
          </p>
          <div className="text-sm text-gray-500 font-martian">
            <p className="mb-2">Примеры поисковых запросов:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setQuery('Frontend')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Frontend
              </button>
              <button
                onClick={() => setQuery('API')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                API
              </button>
              <button
                onClick={() => setQuery('задача')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                задача
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;