export const aiInput =  `
I'll create a beautiful, production-ready Todo App with modern design and full functionality.

<boltArtifact id="todo-app" title="Modern Todo App">
<boltAction type="file" filePath="src/App.tsx">
import React, { useState, useEffect } from 'react';
import { Check, Trash2, Plus, Sun, Moon, CheckSquare } from 'lucide-react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import { Todo } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTodo = (text: string) => {
    if (text.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([newTodo, ...todos]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className={min-h-screen transition-colors duration-300 darkmode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Header
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          completed={completedCount}
          total={totalCount}
        />

        <TodoForm addTodo={addTodo} darkMode={darkMode} />

        <div className="mt-8">
          {todos.length > 0 ? (
            <TodoList
              todos={todos} 
              toggleTodo={toggleTodo} 
              deleteTodo={deleteTodo}
              darkMode={darkMode}
            />
          ) : (
            <EmptyState darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
</boltAction>

<boltAction type="file" filePath="src/components/TodoForm.tsx">
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoFormProps {
  addTodo: (text: string) => void;
  darkMode: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo, darkMode }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className={relative flex items-center darkmode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className={block w-full py-4 px-6 focus:outline-none darkmode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-800 placeholder-gray-400'}}
        />
        <button
          type="submit"
          className={absolute right-2 p-2 rounded-full text.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors duration-300}
          disabled={!text.trim()}
        >
          <Plus size={20} className={text.trim() ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-400'}} />
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
</boltAction>

<boltAction type="file" filePath="src/components/TodoList.tsx">
import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Todo } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  darkMode: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo, darkMode }) => {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={group flex items-center justify-between p-4 rounded-lg transition-all duration-300 
            darkMode
              ? todo.completed
                ? 'bg-gray-800/50 line-through text-gray-500' 
                : 'bg-gray-800 text-white' 
              : todo.completed
                ? 'bg-gray-100 line-through text-gray-400' 
                : 'bg-white text-gray-800'
          } shadow-sm hover:shadow-md}
        >
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                todo.completed 
                  ? 'bg-green-500 border-green-500' 
                  : darkMode
                    ? 'border-gray-600 hover:border-green-500' 
                    : 'border-gray-300 hover:border-green-500'
               transition-colors duration-300}
            >
              {todo.completed && <Check size={14} className="text-white" />}
            </button>
            <div className="flex-1">
              <p className={text-sm sm:text-base todo.completed ? 'line-through' : ''}>{todo.text}</p>
              <p className={text-xs darkmode ? 'text-gray-500' : 'text-gray-400'}}>
                {formatDate(todo.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={() => deleteTodo(todo.id)}
            className={p-2 rounded-full opacity-0 group-hover:opacity-100 
              darkmode
                ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                : 'hover:bg-red-100 text-gray-400 hover:text-red-500'} 
              transition-all duration-300}
            aria-label="Delete todo"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
</boltAction>

<boltAction type="file" filePath="src/components/Header.tsx">
import React from 'react';
import { Sun, Moon, CheckSquare } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  completed: number;
  total: number;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, completed, total }) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="flex items-center">
        <CheckSquare size={32} className="text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold">TodoFlow</h1>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0">
        <div className="mr-6">
          <div className={text-sm darkmode ? 'text-gray-400' : 'text-gray-500'}}>
            {total > 0 
              ? completed} of total} completed
              : 'No tasks yet'}
          </div>
          {total > 0 && (
            <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: total ? (completed / total) * 100 : 0}% }}
              ></div>
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className={p-2 rounded-full 
            darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'
          } transition-colors duration-300}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
</boltAction>

<boltAction type="file" filePath="src/components/EmptyState.tsx">
import React from 'react';
import { CheckSquare } from 'lucide-react';

interface EmptyStateProps {
  darkMode: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ darkMode }) => {
  return (
    <div className={flex flex-col items-center justify-center py-16 px-4 rounded-lg 
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-sm text-center}>
      <CheckSquare
        size={48} 
        className={darkmode ? 'text-gray-700' : 'text-gray-300'} mb-4} 
      />
      <h3 className="text-xl font-medium mb-2">No tasks yet</h3>
      <p className={darkmode ? 'text-gray-400' : 'text-gray-500'} max-w-sm}>
        Add your first task using the form above to get started with TodoFlow
      </p>
    </div>
  );
};

export default EmptyState;
</boltAction>

<boltAction type="file" filePath="src/types/index.ts">
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}
</boltAction>

<boltAction type="file" filePath="src/utils/dateUtils.ts">
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return Today at  + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })};
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return Yesterday at date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })};
  }

  // This week
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (date > weekAgo) {
    return date.toLocaleDateString([], { weekday: 'long' }) + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })};
  }

  // Default format
  return date.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
</boltAction>

<boltAction type="file" filePath="tailwind.config.js">
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
};
</boltAction>

<boltAction type="file" filePath="index.html">
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TodoFlow - Organize Your Tasks</title>
    <meta name="description" content="A modern todo app to help you organize your daily tasks and boost productivity">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</boltAction>

<boltAction type="file" filePath="public/favicon.svg">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
  <path d="m9 12 2 2 4-4"></path>
</svg>
</boltAction>

<boltAction type="shell">
npm run dev
</boltAction>
</boltArtifact>

Your TodoFlow app is now ready! This modern task management application includes:

- **Clean, responsive UI** with light/dark mode toggle
- **Complete task management** (add, complete, delete tasks)
- **Local storage persistence** for tasks and theme preference
- **Empty state** for first-time users
- **Progress tracking** showing task completion status
- **Smart date formatting** that displays relative times
- **Smooth animations and transitions** for a polished feel

The app uses Tailwind CSS for styling and Lucide React for icons, with a carefully designed UI that works on all screen sizes. The code is organized into reusable components with TypeScript for type safety.127.0.0.1 - - [04/Mar/2025 16:17:24] "OPTIONS /template HTTP/1.1" 200 -
Received a request on /template
127.0.0.1 - - [04/Mar/2025 16:17:25] "POST /template HTTP/1.1" 200 -
127.0.0.1 - - [04/Mar/2025 16:17:25] "OPTIONS /chat HTTP/1.1" 200 -
Inside function
I'll create127.0.0.1 - - [04/Mar/2025 16:17:26] "POST /chat HTTP/1.1" 200 -
 a beautiful and fully-featured Todo application for you.

<boltArtifact id="todo-app" title="Todo App">
<boltAction type="file" filePath="src/App.tsx">
import React from 'react';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <TodoApp />
    </div>
  );
}

export default App;
</boltAction>

<boltAction type="file" filePath="src/components/TodoApp.tsx">
import React, { useState, useEffect } from 'react';
import { PlusCircle, Info } from 'lucide-react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import TodoStats from './TodoStats';
import TodoFilter from './TodoFilter';
import { Todo } from '../types';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    if (text.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const toggleAll = () => {
    const areAllCompleted = todos.every((todo) => todo.completed);
    setTodos(
      todos.map((todo) => ({ ...todo, completed: !areAllCompleted }))
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 sm:px-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Task Master</h1>
            <button
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="Information"
            >
              <Info size={24} />
            </button>
          </div>
          {isInfoOpen && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-md text-white text-sm">
              <p className="mb-2">Welcome to Task Master!</p>
              <ul className="list-disc list-inside space-y-1 text-blue-50">
                <li>Add tasks using the input field below</li>
                <li>Click on a task to mark it as completed</li>
                <li>Double-click to edit a task</li>
                <li>Use filters to view different task states</li>
                <li>Your tasks are saved locally on your device</li>
              </ul>
            </div>
          )}
          <TodoForm addTodo={addTodo} />
        </div>

        <div className="divide-y divide-gray-100">
          {todos.length > 0 && (
            <>
              <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={toggleAll}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <PlusCircle size={16} className="rotate-45" />
                  <span>
                    {todos.every((todo) => todo.completed)
                      ? "Mark all as incomplete"
                      : "Mark all as complete"}
                  </span>
                </button>

                <TodoFilter filter={filter} setFilter={setFilter} />
              </div>

              <TodoList
                todos={filteredTodos}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
              />

              <TodoStats
                todos={todos}
                clearCompleted={clearCompleted}
              />
            </>
          )}

          {todos.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">Your task list is empty. Add a new task to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
</boltAction>

<boltAction type="file" filePath="src/components/TodoForm.tsx">
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TodoFormProps {
  addTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm text-white placeholder-blue-100 rounded-lg border border-white/30 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/50"
        autoFocus
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-100 transition-colors"
        aria-label="Add todo"
      >
        <PlusCircle size={24} />
      </button>
    </form>
  );
};

export default TodoForm;
</boltAction>

<boltAction type="file" filePath="src/components/TodoList.tsx">
import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { Todo } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, text: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const finishEditing = () => {
    setEditingId(null);
  };

  return (
    <ul className="divide-y divide-gray-100">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isEditing={editingId === todo.id}
          startEditing={startEditing}
          finishEditing={finishEditing}
        />
      ))}
    </ul>
  );
};

export default TodoList;
</boltAction>

<boltAction type="file" filePath="src/components/TodoItem.tsx">
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Todo } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, text: string) => void;
  isEditing: boolean;
  startEditing: (id: number) => void;
  finishEditing: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  isEditing,
  startEditing,
  finishEditing,
}) => {
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    startEditing(todo.id);
  };

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    finishEditing();
  };

  const handleCancel = () => {
    setEditText(todo.text);
    finishEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className="group px-6 py-4 hover:bg-gray-50 transition-colors">
      {isEditing ? (
        <div className="flex items-center gap-3">
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-2 text-green-500 hover:text-green-700 transition-colors"
            aria-label="Save"
          >
            <Check size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleTodo(todo.id)}
            className={mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border 
              todo.completed
                ? 'bg-blue-500 border-blue-500 flex items-center justify-center'
                : 'border-gray-300'
            }}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed && <Check size={12} className="text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <div
              className={text-base break-words 
                todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
              }}
              onDoubleClick={handleEdit}
            >
              {todo.text}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {formatDate(todo.createdAt)}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
</boltAction>

<boltAction type="file" filePath="src/components/TodoFilter.tsx">
import React from 'react';

interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => setFilter('all')}
        className={px-3 py-1 rounded-md 
          filter === 'all'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }}
      >
        All
      </button>
      <button
        onClick={() => setFilter('active')}
        className={px-3 py-1 rounded-md 
          filter === 'active'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }}
      >
        Active
      </button>
      <button
        onClick={() => setFilter('completed')}
        className={px-3 py-1 rounded-md 
          filter === 'completed'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }}
      >
        Completed
      </button>
    </div>
  );
};

export default TodoFilter;
</boltAction>

<boltAction type="file" filePath="src/components/TodoStats.tsx">
import React from 'react';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
  clearCompleted: () => void;
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos, clearCompleted }) => {
  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.length - activeTodos;

  return (
    <div className="px-6 py-3 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
      <div>
        <span className="font-medium text-gray-700">{activeTodos}</span> item{activeTodos !== 1 && 's'} left
      </div>

      {completedTodos > 0 && (
        <button
          onClick={clearCompleted}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear completed
        </button>
      )}
    </div>
  );
};

export default TodoStats;
</boltAction>

<boltAction type="file" filePath="src/types/index.ts">
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}
</boltAction>

<boltAction type="file" filePath="src/utils/dateUtils.ts">
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // For today's tasks, show the time
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return Today at date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })};
  }

  // For yesterday's tasks
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // For tasks within the last week
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date > oneWeekAgo) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }

  // For older tasks
  return date.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
</boltAction>

<boltAction type="file" filePath="index.html">
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Master | Beautiful Todo App</title>
    <meta name="description" content="A beautiful and powerful todo application to manage your tasks efficiently" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</boltAction>

<boltAction type="shell">
npm run dev
</boltAction>
</boltArtifact>

I've created a production-ready Todo application called "Task Master" with a modern, beautiful UI and comprehensive features. It includes:

- A stylish gradient header with info panel
- Smooth animations and hover effects
- Persistent storage using localStorage
- Task filtering (All/Active/Completed)
- Task editing and deletion
- Bulk actions (mark all as complete/incomplete)
- Detailed task statistics
- Responsive design that works on all devices
- Human-friendly date formatting

The UI is enhanced with subtle shadows, gradients, and transitions for a polished look. You can start using the app immediately - add tasks, mark them complete, edit them with a double-click, and use the filters to organize your view.`
