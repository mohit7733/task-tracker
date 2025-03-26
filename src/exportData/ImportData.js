import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import { toggleImportDialog } from '../store/slices/uiSlice';
import { importTasks } from '../store/slices/tasksSlice';
import { v4 as uuidv4 } from 'uuid';
function ImportDialog() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isImportDialogOpen);
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);
    const tasks = useSelector((state) => state.tasks.tasks);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [format, setFormat] = useState('json');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleClose = () => {
        dispatch(toggleImportDialog());
        setFormat('json');
        setFile(null);
        setError('');
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (fileExtension !== format) {
                setError(`Selected file format does not match chosen format (${format.toUpperCase()})`);
                setFile(null);
            } else {
                setError('');
                setFile(selectedFile);
            }
        }
    };

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file to import');
            return;
        }

        try {
            const content = await file.text();
            let importedTasks;

            if (format === 'json') {
                importedTasks = JSON.parse(content);
            } else if (format === 'csv') {
                const lines = content.split('\n');
                const headers = lines[0].split(',');
                importedTasks = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const task = {};
                    headers.forEach((header, index) => {
                        task[header.trim()] = values[index]?.trim() || '';
                    });
                    return task;
                });
            }

            const newTasks = importedTasks
                .filter(task => task.title !== '')
                .map(task => ({
                    ...task,
                    id: uuidv4(),
                    createdAt: new Date().toISOString(),
                    completed: false
                }));

            dispatch(importTasks([...tasks, ...newTasks]));
            handleClose();
            setSnackbarMessage('Tasks imported successfully!');
            setTimeout(() => {
                setSnackbarMessage('');
            }, 3000);
        } catch (err) {
            setError(`Error importing file: ${err.message}`);
        }
    };

    return (
        <>
            {
                snackbarMessage && (
                    <div className="bg-green-500 text-white p-2 rounded-md fixed bottom-10 right-0 m-4">
                        {snackbarMessage}
                    </div>
                )
            }
            {isOpen ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className={`text-xl font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                <FontAwesomeIcon icon={faFileImport} className="mr-2" />
                                Import Tasks
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
                                <p className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Import Format</p>
                                <div className="space-y-2">
                                    <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <input
                                            type="radio"
                                            checked={format === 'json'}
                                            onChange={() => {
                                                setFormat('json');
                                                setFile(null);
                                                setError('');
                                            }}
                                            className="form-radio text-blue-600"
                                        />
                                        <span>JSON Format</span>
                                    </label>
                                    <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <input
                                            type="radio"
                                            checked={format === 'csv'}
                                            onChange={() => {
                                                setFormat('csv');
                                                setFile(null);
                                                setError('');
                                            }}
                                            className="form-radio text-blue-600"
                                        />
                                        <span>CSV Format</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select File</p>
                                <input
                                    type="file"
                                    accept={`.${format}`}
                                    onChange={handleFileChange}
                                    className={`w-full p-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
                                />
                                {error && (
                                    <p className="text-red-500 text-sm mt-2">{error}</p>
                                )}
                                <p className={`text-gray-500 text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Supported formats: JSON, CSV <br />
                                    <span className="text-gray-400"> example: <a href="/import_file/tasks-import.csv" className="text-blue-500 hover:underline" download> CSV file</a>
                                    </span>
                                    <span className="text-gray-400">
                                        , <a href="/import_file/tasks-import.json" className="text-blue-500 hover:underline" download> JSON file</a>
                                    </span>
                                </p>
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
                                onClick={handleImport}
                                disabled={!file}
                                className={`px-4 py-2 rounded-md transition-colors ${!file
                                    ? 'bg-blue-300 text-white cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            ) : null
            }
        </>
    )
}

export default ImportDialog;
