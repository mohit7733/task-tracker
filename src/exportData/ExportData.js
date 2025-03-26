import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { toggleExportDialog } from '../store/slices/uiSlice';

function ExportDialog() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isExportDialogOpen);
    const tasks = useSelector((state) => state.tasks.tasks);
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);

    const [format, setFormat] = useState('json');
    const [filters, setFilters] = useState({
        includeCompleted: true,
        includeActive: true,
        includeDescription: true,
        includeMetadata: true,
    });

    const handleClose = () => {
        dispatch(toggleExportDialog());
        setFormat('json');
        setFilters({
            includeCompleted: true,
            includeActive: true,
            includeDescription: true,
            includeMetadata: true,
        });
    };

    const handleExport = () => {
        let exportTasks = tasks.filter(task => {
            if (!filters.includeCompleted && task.completed) return false;
            if (!filters.includeActive && !task.completed) return false;
            return true;
        });

        exportTasks = exportTasks.map(task => {
            const formattedTask = {
                title: task.title,
                completed: task.completed,
            };
            if (filters.includeDescription) {
                formattedTask.description = task.description;
            }
            if (filters.includeMetadata) {
                formattedTask.priority = task.priority;
                formattedTask.category = task.category;
                formattedTask.dueDate = task.dueDate;
                formattedTask.createdAt = task.createdAt;
            }
            return formattedTask;
        });

        let content;
        let mimeType;
        let fileExtension;

        switch (format) {
            case 'json':
                content = JSON.stringify(exportTasks, null, 2);
                mimeType = 'application/json';
                fileExtension = 'json';
                break;
            case 'csv':
                const headers = ['title', 'completed'];
                if (filters.includeDescription) headers.push('description');
                if (filters.includeMetadata) {
                    headers.push('priority', 'category', 'dueDate', 'createdAt');
                }

                content = [
                    headers.join(','),
                    ...exportTasks.map(task =>
                        headers.map(header => {
                            const value = task[header];
                            return typeof value === 'string' ? `"${value}"` : value;
                        }).join(',')
                    ),
                ].join('\n');
                mimeType = 'text/csv';
                fileExtension = 'csv';
                break;
            default:
                return;
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-export.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        handleClose();
    };

    const handleFilterChange = (event) => {
        setFilters(prev => ({
            ...prev,
            [event.target.name]: event.target.checked,
        }));
    };

    

    return (
        isOpen ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className={`w-full max-w-md rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className={`text-xl font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                            Export Tasks
                        </h2>
                        <button
                            onClick={handleClose}
                            className={`p-1 rounded-full hover:bg-gray-700 w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="mb-4">
                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Export Format</p>
                            <div className="space-y-2">
                                <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                        type="radio"
                                        checked={format === 'json'}
                                        onChange={() => setFormat('json')}
                                        className="form-radio text-blue-600"
                                    />
                                    <span>JSON Format</span>
                                </label>
                                <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                        type="radio"
                                        checked={format === 'csv'}
                                        onChange={() => setFormat('csv')}
                                        className="form-radio text-blue-600"
                                    />
                                    <span>CSV Format</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Export Options</p>
                            {Object.entries(filters).map(([key, value]) => (
                                <label key={key} className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                        type="checkbox"
                                        name={key}
                                        checked={value}
                                        onChange={handleFilterChange}
                                        className="form-checkbox text-blue-600 rounded"
                                    />
                                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
                        <button
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancel
                        </button>
                        
                        <button
                            onClick={handleExport}
                            disabled={!filters.includeCompleted && !filters.includeActive}
                            className={`px-4 py-2 rounded-md transition-colors ${(!filters.includeCompleted && !filters.includeActive)
                                ? 'bg-blue-300 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>
        ) : null
    )
}

export default ExportDialog;