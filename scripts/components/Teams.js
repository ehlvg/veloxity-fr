import React, { useState, useEffect } from 'react';
import { StorageManager } from '../storage';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    setTeams(StorageManager.getTeams());
  };

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setShowModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  const handleDeleteTeam = (teamId) => {
    StorageManager.deleteTeam(teamId);
    loadTeams();
    setShowDeleteConfirm(null);
  };

  const handleSaveTeam = (teamData) => {
    if (editingTeam) {
      StorageManager.updateTeam(editingTeam.id, teamData);
    } else {
      StorageManager.addTeam(teamData);
    }
    loadTeams();
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
            Команды
          </h1>
          <p className="text-gray-600 font-martian">
            Управляйте командами и участниками
          </p>
        </div>
        <button
          onClick={handleCreateTeam}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Создать команду</span>
        </button>
      </div>

      {/* Список команд */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => handleEditTeam(team)}
              onDelete={() => setShowDeleteConfirm(team.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <i className="ph ph-users-three text-5xl mb-6 text-gray-700"></i>
          <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2">
            Пока нет команд
          </h3>
          <p className="text-gray-600 font-martian mb-6">
            Создайте первую команду для начала работы
          </p>
          <button
            onClick={handleCreateTeam}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Создать команду
          </button>
        </div>
      )}

      {/* Модальное окно команды */}
      {showModal && (
        <TeamModal
          team={editingTeam}
          onSave={handleSaveTeam}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Подтверждение удаления */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          teamName={teams.find(t => t.id === showDeleteConfirm)?.name}
          onConfirm={() => handleDeleteTeam(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// Компонент карточки команды
const TeamCard = ({ team, onEdit, onDelete }) => {
  const memberCount = team.members?.length || 0;
  const teamColor = team.color || '#FF6B35';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 group">
      {/* Заголовок команды */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: teamColor }}
          >
            <i className="ph ph-users-three text-white"></i>
          </div>
          <div>
            <h3 className="text-lg font-playfair font-bold text-gray-800">
              {team.name}
            </h3>
            <p className="text-sm text-gray-600 font-martian">
              {memberCount} {memberCount === 1 ? 'участник' : memberCount < 5 ? 'участника' : 'участников'}
            </p>
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
      {team.description && (
        <p className="text-gray-600 font-martian text-sm mb-4 line-clamp-2">
          {team.description}
        </p>
      )}

      {/* Участники */}
      {team.members && team.members.length > 0 && (
        <div>
          <h4 className="text-sm font-martian font-medium text-gray-700 mb-2">
            Участники:
          </h4>
          <div className="space-y-2">
            {team.members.slice(0, 3).map((member, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white font-martian font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-martian font-medium text-gray-800 truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
            {team.members.length > 3 && (
              <p className="text-xs text-gray-500 font-martian">
                и еще {team.members.length - 3} участник{team.members.length - 3 > 1 ? 'а' : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Модальное окно для создания/редактирования команды
const TeamModal = ({ team, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
    color: team?.color || '#FF6B35',
    members: team?.members || []
  });
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });
  const [showAddMember, setShowAddMember] = useState(false);

  const colorOptions = [
    '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.role.trim()) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { ...newMember, id: Date.now().toString() }]
      }));
      setNewMember({ name: '', role: '', email: '' });
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleMemberRoleChange = (index, newRole) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, role: newRole } : member
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            {team ? 'Редактировать команду' : 'Создать команду'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Название команды
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-martian text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Введите название команды"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-martian font-medium text-gray-700 mb-2">
                Цвет команды
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                      formData.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
              placeholder="Описание команды..."
            />
          </div>

          {/* Участники */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-martian font-medium text-gray-700">
                Участники команды
              </label>
              <button
                type="button"
                onClick={() => setShowAddMember(true)}
                className="text-sm font-martian text-orange-600 hover:text-orange-700 transition-colors duration-200"
              >
                + Добавить участника
              </button>
            </div>

            {formData.members.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-white font-martian font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-martian font-medium text-gray-800 text-sm">
                        {member.name}
                      </p>
                      <select
                        value={member.role}
                        onChange={(e) => handleMemberRoleChange(index, e.target.value)}
                        className="text-xs appearance-none text-gray-600 font-martian bg-transparent border-none focus:outline-none"
                      >
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Manager">Manager</option>
                        <option value="Lead Developer">Lead Developer</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-red-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <i className="ph ph-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddMember && (
              <div className="p-4 bg-blue-50 rounded-xl mb-4">
                <h4 className="text-sm font-martian font-medium text-gray-800 mb-3">
                  Добавить участника
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Имя участника"
                    className="px-3 py-2 border border-gray-200 rounded-lg font-martian text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                    className="px-3 appearance-none py-2 border border-gray-200 rounded-lg font-martian text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите роль</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Manager">Manager</option>
                    <option value="Lead Developer">Lead Developer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email (опционально)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-martian text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-martian text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    Добавить
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-martian text-sm hover:bg-gray-400 transition-colors duration-200"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Кнопки */}
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
              {team ? 'Сохранить' : 'Создать команду'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Модальное окно подтверждения удаления
const DeleteConfirmModal = ({ teamName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-trash text-red-600"></i>
          </div>
          <h3 className="text-lg font-playfair font-bold text-gray-800 mb-2">
            Удалить команду
          </h3>
          <p className="text-gray-600 font-martian mb-6">
            Вы уверены, что хотите удалить команду "{teamName}"? 
            Это действие нельзя отменить.
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

export default Teams;