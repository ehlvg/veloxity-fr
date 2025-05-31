// Утилита для работы с localStorage
export class StorageManager {
  static KEYS = {
    USER: 'pm_user',
    TEAMS: 'pm_teams',
    PROJECTS: 'pm_projects',
    TASKS: 'pm_tasks',
    THEME: 'pm_theme',
    ONBOARDING: 'pm_onboarding'
  };

  // Пользователь
  static getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.USER));
    } catch {
      return null;
    }
  }

  static setUser(user) {
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
  }

  static clearUser() {
    localStorage.removeItem(this.KEYS.USER);
  }

  // Команды
  static getTeams() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.TEAMS)) || [];
    } catch {
      return [];
    }
  }

  static setTeams(teams) {
    localStorage.setItem(this.KEYS.TEAMS, JSON.stringify(teams));
  }

  static addTeam(team) {
    const teams = this.getTeams();
    const newTeam = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...team
    };
    teams.push(newTeam);
    this.setTeams(teams);
    return newTeam;
  }

  static updateTeam(teamId, updates) {
    const teams = this.getTeams();
    const index = teams.findIndex(t => t.id === teamId);
    if (index !== -1) {
      teams[index] = { ...teams[index], ...updates };
      this.setTeams(teams);
      return teams[index];
    }
    return null;
  }

  static deleteTeam(teamId) {
    const teams = this.getTeams();
    const filtered = teams.filter(t => t.id !== teamId);
    this.setTeams(filtered);
  }

  // Проекты
  static getProjects() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.PROJECTS)) || [];
    } catch {
      return [];
    }
  }

  static setProjects(projects) {
    localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects));
  }

  static addProject(project) {
    const projects = this.getProjects();
    const newProject = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...project
    };
    projects.push(newProject);
    this.setProjects(projects);
    return newProject;
  }

  static updateProject(projectId, updates) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.setProjects(projects);
      return projects[index];
    }
    return null;
  }

  static deleteProject(projectId) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    this.setProjects(filtered);
  }

  // Задачи
  static getTasks() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.TASKS)) || [];
    } catch {
      return [];
    }
  }

  static setTasks(tasks) {
    localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
  }

  static addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'todo',
      ...task
    };
    tasks.push(newTask);
    this.setTasks(tasks);
    return newTask;
  }

  static updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setTasks(tasks);
      return tasks[index];
    }
    return null;
  }

  static deleteTask(taskId) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    this.setTasks(filtered);
  }

  static getTasksByProject(projectId) {
    return this.getTasks().filter(task => task.projectId === projectId);
  }

  // Тема
  static getTheme() {
    return 'light';
  }

  // Онбординг
  static getOnboardingStatus() {
    return localStorage.getItem(this.KEYS.ONBOARDING) === 'true';
  }

  static setOnboardingStatus(status) {
    localStorage.setItem(this.KEYS.ONBOARDING, status.toString());
  }

  // Поиск по всем элементам
  static searchAll(query) {
    const teams = this.getTeams();
    const projects = this.getProjects();
    const tasks = this.getTasks();
    
    const lowerQuery = query.toLowerCase();
    
    const results = {
      teams: teams.filter(team => 
        team.name?.toLowerCase().includes(lowerQuery) ||
        team.description?.toLowerCase().includes(lowerQuery)
      ),
      projects: projects.filter(project => 
        project.name?.toLowerCase().includes(lowerQuery) ||
        project.description?.toLowerCase().includes(lowerQuery)
      ),
      tasks: tasks.filter(task => 
        task.title?.toLowerCase().includes(lowerQuery) ||
        task.description?.toLowerCase().includes(lowerQuery)
      )
    };
    
    return results;
  }

  // Инициализация тестовых данных
  static initializeTestData() {
    if (this.getTeams().length === 0) {
      const testTeams = [
        {
          id: '1',
          name: 'Frontend Team',
          description: 'Команда фронтенд разработки',
          color: '#FF6B35',
          members: [
            { id: '1', name: 'Erich', role: 'Lead Developer', email: 'erich@example.com' },
            { id: '2', name: 'Alice', role: 'UI/UX Designer', email: 'alice@example.com' }
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Backend Team',
          description: 'Команда бэкенд разработки',
          color: '#4ECDC4',
          members: [
            { id: '3', name: 'Bob', role: 'Backend Developer', email: 'bob@example.com' }
          ],
          createdAt: new Date().toISOString()
        }
      ];
      this.setTeams(testTeams);
    }

    if (this.getProjects().length === 0) {
      const testProjects = [
        {
          id: '1',
          name: 'Project Manager App',
          description: 'Приложение для управления проектами',
          teamId: '1',
          status: 'active',
          priority: 'high',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'API Gateway',
          description: 'Система управления API',
          teamId: '2',
          status: 'planning',
          priority: 'medium',
          createdAt: new Date().toISOString()
        }
      ];
      this.setProjects(testProjects);
    }

    if (this.getTasks().length === 0) {
      const testTasks = [
        {
          id: '1',
          title: 'Создать компонент авторизации',
          description: 'Разработать форму входа и регистрации',
          projectId: '1',
          status: 'todo',
          priority: 'high',
          assignee: 'Erich',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Настроить роутинг',
          description: 'Добавить React Router для навигации',
          projectId: '1',
          status: 'in-progress',
          priority: 'medium',
          assignee: 'Erich',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Создать API эндпоинты',
          description: 'Реализовать REST API для проектов',
          projectId: '2',
          status: 'done',
          priority: 'high',
          assignee: 'Bob',
          createdAt: new Date().toISOString()
        }
      ];
      this.setTasks(testTasks);
    }
  }
}