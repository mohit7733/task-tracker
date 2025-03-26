import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Load tasks from localStorage with error handling
const loadTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (err) {
    console.error('Failed to load tasks:', err);
    return [];
  }
};

// Save tasks to localStorage with error handling
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
};

// Load history from localStorage with error handling
const loadHistoryFromStorage = () => {
  try {
    const history = localStorage.getItem('history');
    return history ? JSON.parse(history) : [];
  } catch (err) {
    console.error('Failed to load history:', err);
    return [];
  }
};

// Save history to localStorage with error handling
const saveHistoryToStorage = (history) => {
  try {
    localStorage.setItem('history', JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history:', err);
  }
};

// Initial state
export const initialState = {
  tasks: loadTasksFromStorage(),
  status: 'idle',
  error: null,
  history: loadHistoryFromStorage(),
};

// Async thunk for adding new tasks
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    return newTask;
  }
);

// Tasks slice
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.tasks);
      }
    },

    importTasks: (state, action) => {
      state.tasks = action.payload;
      saveTasksToStorage(state.tasks);
    },

    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        saveTasksToStorage(state.tasks);
      }
    },

    deleteTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        state.history.push(task);
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        saveTasksToStorage(state.tasks);
        saveHistoryToStorage(state.history);
      }
    },

    undoDelete: (state, action) => {
      state.history = state.history.filter(t => t.id !== action.payload.id);
      state.tasks.push(action.payload);
      saveTasksToStorage(state.tasks);
      saveHistoryToStorage(state.history);
    },

    reorderTasks: (state, action) => {
      state.tasks = action.payload;
      saveTasksToStorage(state.tasks);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
        saveTasksToStorage(state.tasks);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  toggleTask,
  updateTask,
  deleteTask,
  reorderTasks,
  importTasks,
  undoDelete,
} = tasksSlice.actions;

export default tasksSlice.reducer;