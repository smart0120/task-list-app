import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Task {
  id: number;
  task: string;
  completed?: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8000/api/tasks');
      setTasks(response.data.map((task: Task) => ({...task, completed: false})));
    } catch (error) {
      setError('Tasks could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/tasks', { task: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      setError('Could not add task.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const filterTasks = (status: string) => {
    setFilter(status);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'done') return task.completed;
    if (filter === 'open') return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Today's Tasks</h1>
      <div className="input-container">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="What's on your plan?" 
        />
        <button onClick={addTask} className='add-btn' disabled={loading}>Add</button>
      </div>
      <div className="task-filters">
        <span>DD.MM.YY</span>
        <div className='btn-group'>
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => filterTasks('all')}
          >
            All
          </button>
          <button 
            className={filter === 'done' ? 'active' : ''} 
            onClick={() => filterTasks('done')}
          >
            Done
          </button>
          <button 
            className={filter === 'open' ? 'active' : ''} 
            onClick={() => filterTasks('open')}
          >
            Open
          </button>
        </div>
      </div>
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => handleComplete(task.id)}
            />
            {task.task}
          </li>
        ))}
      </ul>
      <button className="load-tasks" onClick={loadTasks} disabled={loading}>
        {loading ? 'Loading tasks...' : 'Load previous tasks ...'}
      </button>
      {error ? <p className="error-message">{error}</p> : null}
    </div>
  );
};

export default App;
