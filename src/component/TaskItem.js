import { useDispatch, useSelector } from 'react-redux';
import { toggleTask, deleteTask } from '../store/slices/tasksSlice';
import { setSelectedTask } from '../store/slices/uiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from 'react';

const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
};

function TaskItem({ task, index }) {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
    const [showConfirm, setShowConfirm] = useState(false);
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,

    };

    const handleToggle = () => {
        dispatch(toggleTask(task.id));
    };

    const handleEdit = () => {
        dispatch(setSelectedTask(task));
    };

    const handleDelete = () => {
        dispatch(deleteTask(task.id));
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                flex items-center p-4 mb-4 border rounded-lg 
                shadow-md hover:shadow-lg transition-all duration-200 
                ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}
                relative flex-row flex-wrap md:flex-nowrap md:flex-row md:gap-4  md:w-[calc(50%-10px)] w-full
            `}
        >

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md rounded-lg shadow-xl p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this task? if you do, it will be moved to the history.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowConfirm(false);
                                }}
                                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="text-gray-500 mr-2 cursor-grab"
                role="button"
                {...attributes}
                {...listeners}
            >
                <FontAwesomeIcon
                    icon={faGripVertical}
                    focusable={true}
                    aria-label="Drag to reorder task"
                />
            </div>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggle}
                className="
                    h-4 w-4 min-w-4 rounded border-2 border-gray-300 mr-4 
                    cursor-pointer checked:bg-blue-500 checked:border-blue-500
                    focus:ring-2 focus:ring-blue-200 focus:outline-none
                    transition-colors duration-200 ease-in-out
                "
            />

            <div className={`
                flex-grow item-content
                ${task.completed ? 'line-through text-gray-500 opacity-50' : ''}
            `}>
                <h2 className={`
                    text-lg font-semibold
                    ${task.completed
                        ? 'line-through text-gray-500'
                        : isDarkMode ? 'text-white' : 'text-black'
                    }
                `}>
                    {task.title}
                </h2>

                <p className={`
                    text-gray-600 mb-2 font-weight-100 text-sm
                    ${isDarkMode ? 'text-white' : 'text-gray-600'}
                `}>
                    {task.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                    <span className={`
                        px-2 pt-0.5 rounded-full text-xs text-white
                        ${priorityColors[task.priority]}
                    `}>
                        {task.priority}
                    </span>

                    {task.category && (
                        <span className={`
                            px-2 pt-0.5 rounded-full text-xs border border-gray-300
                            ${isDarkMode ? 'text-white' : 'text-gray-700'}
                        `}>
                            {task.category}
                        </span>
                    )}

                    {task.dueDate && (
                        <span className={`
                            px-2 pt-0.5 rounded-full text-xs
                            ${isOverdue
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 text-gray-700'
                            }
                        `}>
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex ">
                <button
                    onClick={handleEdit}
                    className={`
                            md:p-1 ${!isDarkMode ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} rounded-full transition-colors
                        md:w-8 md:h-8 w-6 h-6
                    `}
                    title="Edit task"
                >
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="text-blue-500"
                        size="sm"
                        focusable={false}
                        aria-hidden="true"
                    />
                </button>

                <button
                    onClick={() => setShowConfirm(true)}
                    className={`
                        md:p-1 ${!isDarkMode ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} rounded-full transition-colors
                        md:w-8 md:h-8 w-6 h-6
                    `}
                    title="Delete task"
                >
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="text-red-500"
                        size="sm"
                        focusable={false}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div >
    );
}

export default TaskItem;
