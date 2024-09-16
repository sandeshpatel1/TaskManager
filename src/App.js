import React from 'react';
import './index.css';
import TaskForm from './Components/TaskForm';
import TaskList from './Components/TaskList';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Task Manager</h1>
      <TaskForm />
      <TaskList />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000, // 5 seconds
        }}
      />
    </div>
  );
};

export default App;
