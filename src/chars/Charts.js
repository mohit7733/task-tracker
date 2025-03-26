import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartBar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { toggleStatsDialog } from '../store/slices/uiSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function StatsDialog() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isStatsDialogOpen);
    const tasks = useSelector((state) => state.tasks.tasks);
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);

    const handleClose = () => {
        dispatch(toggleStatsDialog());
    };

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

    // Priority distribution
    const priorityStats = {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length,
    };

    // Category distribution
    const categoryStats = tasks.reduce((acc, task) => {
        if (task.category) {
            acc[task.category] = (acc[task.category] || 0) + 1;
        }
        return acc;
    }, {});

    // Chart data
    const statusData = {
        labels: ['Active', 'Completed'],
        datasets: [
            {
                data: [activeTasks, completedTasks],
                backgroundColor: ['#ff9800', '#4caf50'],
            },
        ],
    };

    const priorityData = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                label: 'Tasks by Priority',
                data: [priorityStats.high, priorityStats.medium, priorityStats.low],
                backgroundColor: ['#f44336', '#ff9800', '#4caf50'],
            },
        ],
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-[100vh] !mt-0">
            <div className={`w-full max-w-4xl mx-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-xl h-[90vh] overflow-y-scroll`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-semibold">Task Charts & Statistics </h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-3 md:gap-4 gap-1 mb-6">
                        {/* Summary Cards */}
                        <div className={`md:p-4 px-2 py-4 md:text-lg text-sm rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                            <div className="md:text-2xl text-xl font-bold">{totalTasks}</div>
                            <div className="text-gray-500">Total Tasks</div>
                        </div>

                        <div className={`md:p-4 px-2 py-4 md:text-lg text-sm rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                            <div className="md:text-2xl text-xl font-bold">{completionRate}%</div>
                            <div className="text-gray-500">Completion Rate</div>
                        </div>

                        <div className={`md:p-4 px-2 py-4 md:text-lg text-sm rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                            <div className="md:text-2xl text-xl font-bold">{activeTasks}</div>
                            <div className="text-gray-500">Active Tasks</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Charts */}
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                                Status Distribution
                            </h3>
                            <div className="h-[300px]">
                                <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                                Priority Distribution
                            </h3>
                            <div className="h-[300px]">
                                <Bar
                                    data={priorityData}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Stats */}
                    {Object.keys(categoryStats).length > 0 && (
                        <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <h3 className="text-lg font-semibold mb-4">Categories</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {Object.entries(categoryStats).map(([category, count]) => (
                                    <div key={category} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} text-center shadow`}>
                                        <div className="font-medium">{category}</div>
                                        <div className="text-gray-500">{count} tasks</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StatsDialog;