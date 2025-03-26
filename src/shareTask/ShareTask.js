import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toggleSharingDialog } from '../store/slices/uiSlice';

const priorityColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
};

function SharingDialog() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isSharingDialogOpen);
    const tasks = useSelector((state) => state.tasks.tasks);
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);

    const [selectedTasks, setSelectedTasks] = useState([]);
    const [email, setEmail] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleClose = () => {
        dispatch(toggleSharingDialog());
        setSelectedTasks([]);
        setEmail('');
    };

    const handleToggleTask = (taskId) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const handleShare = () => {
        const tasksToShare = tasks.filter(task => selectedTasks.includes(task.id));
        console.log('Sharing tasks:', {
            tasks: tasksToShare,
            recipientEmail: email,
            timestamp: new Date().toISOString()
        });
        setShowSnackbar(true);
        handleClose();
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const canShare = selectedTasks.length > 0 && isValidEmail(email);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Share Tasks</h2>
                            <button
                                onClick={handleClose}
                                className={`p-1 rounded-full  ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Recipient Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        } ${email && !isValidEmail(email) ? 'border-red-500' : ''}`}
                                />
                                {email && !isValidEmail(email) && (
                                    <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
                                )}
                            </div>

                            <div className="max-h-60 overflow-y-auto">
                                {tasks.length === 0 ? (
                                    <p className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        No tasks available to share
                                    </p>
                                ) : (
                                    tasks.map((task) => (
                                        <div key={task.id} className={`flex items-center p-2 rounded-md mb-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.includes(task.id)}
                                                onChange={() => handleToggleTask(task.id)}
                                                className="w-3 h-3 mr-3 cursor-pointer accent-blue-500"
                                            />
                                            <div className="flex-grow">
                                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{task.title}</p>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Priority: <span className={`${priorityColors[task.priority]} font-medium`}>{task.priority}</span>
                                                    <span className="mx-2">•</span>
                                                    Status: <span className={`${task.completed ? 'text-green-500' : 'text-red-500'} font-medium`}>
                                                        {task.completed ? 'Completed' : 'Pending'}
                                                    </span>
                                                </p>
                                            </div>
                                            {task.category && (
                                                <span className={`px-2 py-1 text-sm rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                                    {task.category}
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )}
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
                                onClick={handleShare}
                                disabled={!canShare}
                                className={`px-4 py-2 rounded-md transition-colors ${canShare
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-300 text-white cursor-not-allowed'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faShare} className="mr-2" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSnackbar && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Tasks shared successfully!
                    <button
                        onClick={() => setShowSnackbar(false)}
                        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}
        </>
    );
}

export default SharingDialog;