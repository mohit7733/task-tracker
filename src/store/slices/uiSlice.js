import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    isTaskFormOpen: false,
    selectedTask: null,
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isStatsDialogOpen: false,
    isSharingDialogOpen: false,
    isExportDialogOpen: false,
    isImportDialogOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
            state.isTaskFormOpen = true;
        },

        // use in header component
        toggleTaskForm: (state) => {
            state.isTaskFormOpen = !state.isTaskFormOpen;
            if (!state.isTaskFormOpen) {
                state.selectedTask = null;
            }
        },
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('darkMode', state.isDarkMode);
        },
        toggleStatsDialog: (state) => {
            state.isStatsDialogOpen = !state.isStatsDialogOpen;
        },
        toggleSharingDialog: (state) => {
            state.isSharingDialogOpen = !state.isSharingDialogOpen;
        },
        toggleExportDialog: (state) => {
            state.isExportDialogOpen = !state.isExportDialogOpen;
        },
        toggleImportDialog: (state) => {
            state.isImportDialogOpen = !state.isImportDialogOpen;
        },
    },
});

export const {
    toggleTaskForm,
    setSelectedTask,
    toggleDarkMode,
    toggleStatsDialog,
    toggleSharingDialog,
    toggleExportDialog,
    toggleImportDialog,
} = uiSlice.actions;

export default uiSlice.reducer; 