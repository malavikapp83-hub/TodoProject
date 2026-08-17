import { useState } from 'react';
import './App.css';

const API_URL = 'https://todoproject-h31f.onrender.com';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // =========================
  // REFRESH ACCESS TOKEN
  // =========================

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }

      localStorage.setItem('access_token', data.access);

      return data.access;
    } catch {
      return null;
    }
  };

  // =========================
  // AUTHENTICATED REQUEST
  // =========================

  const authenticatedFetch = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();

      if (!token) {
        setLoggedIn(false);
        setError(
          'Your session has expired. Please log in again.'
        );

        return response;
      }

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return response;
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(
        `${API_URL}/api/token/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Login failed'
        );
      }

      localStorage.setItem(
        'access_token',
        data.access
      );

      localStorage.setItem(
        'refresh_token',
        data.refresh
      );

      setLoggedIn(true);

      await getTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // GET TASKS
  // =========================

  const getTasks = async () => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/api/tasks/`
      );

      if (!response.ok) {
        throw new Error(
          `Could not load tasks: ${response.status}`
        );
      }

      const data = await response.json();

      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // CREATE TASK
  // =========================

  const createTask = async (event) => {
    event.preventDefault();

    if (!newTask.trim()) {
      return;
    }

    try {
      const response = await authenticatedFetch(
        `${API_URL}/api/tasks/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newTask,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not create task'
        );
      }

      setTasks((currentTasks) => [
        ...currentTasks,
        data,
      ]);

      setNewTask('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // COMPLETE TASK
  // =========================

  const toggleTask = async (task) => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/api/tasks/${task.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_completed: !task.is_completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not update task'
        );
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? data
            : currentTask
        )
      );

      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // EDIT TASK
  // =========================

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setError('');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const editTask = async (taskId) => {
    if (!editingTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    try {
      const response = await authenticatedFetch(
        `${API_URL}/api/tasks/${taskId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editingTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not edit task'
        );
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? data : task
        )
      );

      cancelEditing();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const deleteTask = async (taskId) => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/api/tasks/${taskId}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not delete task: ${response.status}`
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );

      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setLoggedIn(false);
    setTasks([]);
    setUsername('');
    setPassword('');
    setError('');
  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!loggedIn) {
    return (
      <div className="App login-container">
        <h1>My Todo App</h1>

        <form onSubmit={login}>
          <div className="login-field">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          <button type="submit">
            Login
          </button>
        </form>

        {error && (
          <p className="error">{error}</p>
        )}
      </div>
    );
  }

  // =========================
  // TODO SCREEN
  // =========================

  return (
    <div className="App">
      <div className="app-header">
        <h1>My Todo App</h1>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {error && (
        <p className="error">{error}</p>
      )}

      <form
        className="add-task-form"
        onSubmit={createTask}
      >
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(event) =>
            setNewTask(event.target.value)
          }
        />

        <button
          className="add-button"
          type="submit"
        >
          Add Task
        </button>
      </form>

      <h2 className="tasks-title">
        Tasks
      </h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div
              className="task-card"
              key={task.id}
            >
              <input
                className="task-checkbox"
                type="checkbox"
                checked={task.is_completed}
                onChange={() =>
                  toggleTask(task)
                }
              />

              {editingTaskId === task.id ? (
                <>
                  <input
                    className="edit-input"
                    type="text"
                    value={editingTitle}
                    onChange={(event) =>
                      setEditingTitle(
                        event.target.value
                      )
                    }
                    autoFocus
                  />

                  <div className="task-actions">
                    <button
                      className="save-button"
                      onClick={() =>
                        editTask(task.id)
                      }
                    >
                      Save
                    </button>

                    <button
                      className="cancel-button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    className={`task-title ${
                      task.is_completed
                        ? 'completed'
                        : ''
                    }`}
                  >
                    {task.title}
                  </span>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() =>
                        startEditing(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;