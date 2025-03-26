import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { undoDelete } from '../store/slices/tasksSlice';
import { toggleHistoryDialog } from '../store/slices/uiSlice';
import { useEffect } from 'react';
function History() {
    const history = useSelector((state) => state.tasks.history);
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);
    const dispatch = useDispatch();

    const handleUndo = (task) => {
        dispatch(undoDelete(task));
    };
    useEffect(() => {
        if (history.length === 0) {
            dispatch(toggleHistoryDialog());
        }
    }, [history]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Deleted Tasks History
                </h2>

                <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2" onClick={() => dispatch(toggleHistoryDialog())}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                </button>
            </div>

            {history.length === 0 ? (
                <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No deleted tasks in history
                </p>
            ) : (
                <div className="space-y-4 flex flex-wrap md:gap-[20px]">
                    {history.map((task) => (
                        <div
                            key={task.id}
                            className={`
                                flex items-center justify-between p-4 rounded-lg shadow
                                ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
                                md:w-[calc(50%-10px)] w-full
                            `}
                        >
                            <div>
                                <h3 className="font-semibold">{task.title}</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {task.description}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <span className={`
                                        px-2 py-1 rounded-full text-xs
                                        ${task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} 
                                        text-white
                                    `}>
                                        {task.priority}
                                    </span>
                                    {task.category && (
                                        <span className={`
                                            px-2 py-1 rounded-full text-xs border
                                            ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}
                                        `}>
                                            {task.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleUndo(task)}
                                className={`
                                    p-2 rounded-full transition-colors
                                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                `}
                                title="Undo delete"
                            >
                                <FontAwesomeIcon
                                    icon={faUndo}
                                    className="text-blue-500"
                                    size="lg"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;
