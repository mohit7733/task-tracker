import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  status: 'all',
  searchQuery: '',
  selectedCategory: 'all',
  priorityFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  taskDate: "",
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.status = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPriorityFilter: (state, action) => {
      state.priorityFilter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.sortOrder = action.payload === 'priority' ? 'asc' : "desc";
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
    setTaskDate: (state, action) => {
      state.taskDate = action.payload;
    },
  },
});

export const {
  setStatusFilter,
  setSearchQuery,
  setSelectedCategory,
  setPriorityFilter,
  setSortBy,
  setSortOrder,
  resetFilters,
  setTaskDate,
} = filtersSlice.actions;

export default filtersSlice.reducer; 