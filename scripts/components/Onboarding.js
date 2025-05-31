import React, { useState } from 'react';
import { StorageManager } from '../storage';

const Onboarding = ({ onComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Добро пожаловать в Veloxity!',
      subtitle: `Привет, ${user.name}! 👋`,
      description: 'Мы поможем вам эффективно управлять проектами и командами. Давайте познакомимся с основными возможностями.',
      icon: (
        <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    },
    {
      title: 'Создавайте команды',
      subtitle: 'Объединяйте людей для достижения целей',
      description: 'Создавайте команды, добавляйте участников, назначайте роли и эффективно координируйте работу всех участников проекта.',
      icon: (
        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      title: 'Управляйте проектами',
      subtitle: 'От идеи до реализации',
      description: 'Создавайте проекты, отслеживайте прогресс, устанавливайте приоритеты и держите все под контролем.',
      icon: (
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Канбан-доски',
      subtitle: 'Визуализируйте рабочий процесс',
      description: 'Используйте канбан-доски для управления задачами. Перетаскивайте карточки между колонками и отслеживайте прогресс в реальном времени.',
      icon: (
        <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 17a2 2 0 002-2v-4m6 0v6a2 2 0 002 2h2a2 2 0 002-2v-6M15 7h2a2 2 0 012 2v4m-2-6V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
        </svg>
      )
    },
    {
      title: 'Все готово!',
      subtitle: 'Начните создавать удивительные проекты',
      description: 'Теперь у вас есть все необходимые инструменты для эффективного управления проектами. Давайте начнем!',
      icon: (
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Инициализируем тестовые данные при завершении онбординга
      StorageManager.initializeTestData();
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    StorageManager.initializeTestData();
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Прогресс-бар */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-martian text-gray-600">
              Шаг {currentStep + 1} из {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm font-martian text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Пропустить
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
          {/* Иконка */}
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-inner">
              {currentStepData.icon}
            </div>
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
            {currentStepData.title}
          </h1>

          {/* Подзаголовок */}
          <h2 className="text-xl md:text-2xl font-martian font-medium text-gray-600 mb-6">
            {currentStepData.subtitle}
          </h2>

          {/* Описание */}
          <p className="text-gray-600 font-martian text-lg leading-relaxed max-w-xl mx-auto mb-12">
            {currentStepData.description}
          </p>

          {/* Кнопки навигации */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-2xl font-martian font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Назад
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-martian font-medium transition-all duration-200 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLastStep ? 'Начать работу' : 'Далее'}
            </button>
          </div>

          {/* Индикаторы точек */}
          <div className="flex justify-center space-x-2 mt-12">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-orange-500 scale-125'
                    : index < currentStep
                    ? 'bg-orange-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-martian text-sm">
            Veloxity поможет вам организовать работу команды и достичь поставленных целей быстрее
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;