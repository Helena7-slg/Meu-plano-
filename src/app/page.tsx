"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Target,
  Clock,
  Star
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: 'work' | 'personal' | 'health' | 'study';
}

export default function MonthlyPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'personal' as Task['category']
  });

  // Gerar dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0]
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateString: date.toISOString().split('T')[0]
      });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTasksForDate = (dateString: string) => {
    return tasks.filter(task => task.date === dateString);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !selectedDate) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      date: selectedDate,
      priority: newTask.priority,
      category: newTask.category,
      completed: false
    };

    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'personal' });
    setShowTaskModal(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category
    });
    setShowTaskModal(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTask.title.trim()) return;

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...newTask }
        : task
    ));
    
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'personal' });
    setShowTaskModal(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const openTaskModal = (dateString: string) => {
    setSelectedDate(dateString);
    setShowTaskModal(true);
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'personal' });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-green-100 text-green-800';
      case 'study': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planejador Mensal</h1>
                <p className="text-gray-600">Organize seus planos e metas mensais</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total de tarefas</div>
                <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Concluídas</div>
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day.dateString);
              const isToday = day.dateString === today;
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                    ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  `}
                  onClick={() => day.isCurrentMonth && openTaskModal(day.dateString)}
                >
                  <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`
                          text-xs p-1 rounded truncate cursor-pointer
                          ${getCategoryColor(task.category)}
                          ${task.completed ? 'opacity-60 line-through' : ''}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskComplete(task.id);
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span>{task.title}</span>
                        </div>
                      </div>
                    ))}
                    
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayTasks.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tarefas Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.filter(t => !t.completed).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta Prioridade</p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => t.priority === 'high' && !t.completed).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meta do Mês</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o título da tarefa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descrição opcional"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value as Task['category'] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="personal">Pessoal</option>
                      <option value="work">Trabalho</option>
                      <option value="health">Saúde</option>
                      <option value="study">Estudos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingTask ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List for Selected Date */}
      {selectedDate && getTasksForDate(selectedDate).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-4 max-w-sm w-full mx-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Tarefas para {new Date(selectedDate).toLocaleDateString('pt-BR')}
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getTasksForDate(selectedDate).map(task => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3 text-white" />}
                    </button>
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit3 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}