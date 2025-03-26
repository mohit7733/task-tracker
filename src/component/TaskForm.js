import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faTimes, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addTask, updateTask } from "../store/slices/tasksSlice";
import { toggleTaskForm } from "../store/slices/uiSlice";

const initialFormState = {
    title: "",
    description: "",
    priority: "medium",
    category: "",
    dueDate: new Date().toISOString().split('T')[0],
};

function TaskForm() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isTaskFormOpen);
    const selectedTask = useSelector((state) => state.ui.selectedTask);
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);
    const [formData, setFormData] = useState(initialFormState);
    const [error, seterror] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    useEffect(() => {
        if (selectedTask) {
            setFormData({
                title: selectedTask.title,
                description: selectedTask.description,
                priority: selectedTask.priority,
                category: selectedTask.category || "",
                dueDate: selectedTask.dueDate || new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData(initialFormState);
        }
        
    }, [selectedTask]);

    const handleClose = () => {
        dispatch(toggleTaskForm());
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || formData.title.trim() === '' || formData.description.trim() === '' || formData.priority === '' || formData.category.trim() === '' || formData.dueDate.trim() === '') {
            seterror('Please fill all the fields');
            return;
        }
        if (selectedTask) {
            dispatch(updateTask({ id: selectedTask.id, ...formData }));
        } else {
            dispatch(addTask(formData));
        }
        setSnackbarMessage('Task added successfully!');
        setTimeout(() => {
            setSnackbarMessage('');
        }, 3000);
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        seterror(null);
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4`}>
                    <div className={` p-6 rounded-lg shadow-lg w-full max-w-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {selectedTask ? "Edit Task" : "Add New Task"}
                            </h2>
                            <button onClick={handleClose} className="text-gray-600 hover:text-red-500">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 form-control">
                            <div>
                                <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Task Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                                ></textarea>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                                />
                            </div>
                            {error && (
                                <div className="bg-red-500 text-white p-2 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-100' : ''}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                                >
                                    <FontAwesomeIcon icon={selectedTask ? faEdit : faPlus} />
                                    <span>{selectedTask ? "Update" : "Add"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null
            }
        </>
    );
}

export default TaskForm;
