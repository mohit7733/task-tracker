import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Returns empty array if something goes wrong
const loadTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (err) {
    console.error('Oops, failed to load tasks:', err);
    return [];
  }
};

// Helper to save tasks to localStorage
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (err) {
    console.error('Uh oh, failed to save tasks:', err);
  }
};

// Our initial state 
export const initialState = {
  tasks: loadTasksFromStorage(),
  status: 'idle',
  error: null,
};

// This handles adding new tasks asynchronously
export const addTask = createAsyncThunk(
  'tasks/addTask', //type prefix
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

// The main slice 
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Toggle a task
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.tasks);
      }
    },

    // Import tasks
    importTasks: (state, action) => {
      state.tasks = action.payload;
      saveTasksToStorage(state.tasks);
    },

    // Update an existing task with new data
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        saveTasksToStorage(state.tasks);
      }
    },
    // Bye bye task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },

    // Drag and drop reordering  
    reorderTasks: (state, action) => {
      state.tasks = action.payload;
      saveTasksToStorage(state.tasks);
    },
  },

  // Handle async task adding states
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
} = tasksSlice.actions;

export default tasksSlice.reducer;