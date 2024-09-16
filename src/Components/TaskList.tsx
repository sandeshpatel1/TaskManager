import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { deleteTask, updateTask } from '../redux/tasksSlice';
import { Task } from '../redux/types'; 
import toast from 'react-hot-toast';
import { CheckCircle, Circle, Trash2, Edit3 } from 'lucide-react';
import TaskEditModal from './TaskEditModal';

const TaskList: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortType, setSortType] = useState<string>('dueDate');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
    toast.success('Task deleted successfully!', {
      position: 'bottom-right',
      duration: 5000,
    });
  };

  const handleStatusToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask: Task = { ...task, status: task.status === 'in-progress' ? 'completed' : 'in-progress' };
      dispatch(updateTask(updatedTask));
      toast.success(`Task marked as ${updatedTask.status}`, {
        position: 'bottom-right',
        duration: 5000,
      });
    }
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  const filteredTasks = tasks
    .filter(task => 
      (filter === 'all' || task.status === filter) &&
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.dueDate.includes(searchTerm))
    )
    .sort((a, b) => {
      if (sortType === 'dueDate') {
        // Sort by due date, prioritizing overdue tasks
        const today = new Date();
        const aDate = new Date(a.dueDate);
        const bDate = new Date(b.dueDate);
        const isAPastDue = aDate < today;
        const isBPastDue = bDate < today;

        if (isAPastDue && !isBPastDue) return -1;
        if (!isAPastDue && isBPastDue) return 1;
        return aDate.getTime() - bDate.getTime();
      }
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2">Filter:</label>
          <select onChange={(e) => setFilter(e.target.value)} value={filter} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Sort by:</label>
          <select onChange={(e) => setSortType(e.target.value)} value={sortType} className="border p-2 rounded">
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, description, or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`border p-4 space-y-2 rounded shadow-md ${task.priority === 'high' ? 'bg-red-100' : task.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <button onClick={() => openEditModal(task)}>
                <Edit3 className="text-gray-500" />
              </button>
            </div>
            <p>{task.description}</p>
            <p className="text-sm">Due: {task.dueDate}</p>
            <p className={`text-sm font-semibold ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>Priority: {task.priority}</p>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleStatusToggle(task.id)}>
                {task.status === 'completed' ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <Circle className="text-yellow-600" />
                )}
              </button>
              <span className={`text-sm ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {task.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
      <TaskEditModal task={taskToEdit} isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default TaskList;
