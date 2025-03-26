import { useSelector } from 'react-redux';
import TaskItem from './TaskItem';
import { useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reorderTasks } from '../store/slices/tasksSlice';

function TaskList() {
    const tasks = useSelector((state) => state.tasks.tasks);
    const filters = useSelector((state) => state.filters);
    const [items, setItems] = useState(tasks);
    const dispatch = useDispatch();
    const filterTasks = () => {
        return tasks.filter((task) => {
            // Status filter
            if (filters.status !== 'all' && ((filters.status === 'completed' && !task.completed) || (filters.status === 'active' && task.completed))) {
                return false;
            }
            // Priority filter
            if (filters.priorityFilter !== 'all' &&
                task.priority !== filters.priorityFilter) {
                return false;
            }
            // Category filter
            if (filters.selectedCategory !== 'all' &&
                task.category !== filters.selectedCategory) {
                return false;
            }
            // Date filter
            if (filters.taskDate &&
                new Date(task.dueDate).toDateString() !== new Date(filters.taskDate).toDateString()) {
                return false;
            }   
            // Search query
            if (filters.searchQuery &&
                !task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
                !task.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
                !task.category.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
                return false;
            }
            return true;
        })
            .sort((a, b) => {
                const order = filters.sortOrder === 'asc' ? 1 : -1;
                switch (filters.sortBy) {
                    case 'priority':
                        const priorityOrder = { high: 3, medium: 2, low: 1 };
                        return (priorityOrder[b.priority] - priorityOrder[a.priority]) * order;
                    case 'dueDate':
                        return (new Date(b.dueDate) - new Date(a.dueDate)) * order;
                    // default: // createdAt
                    //     return (new Date(b.createdAt) - new Date(a.createdAt)) * order;
                }
            });
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const filteredTasks = filterTasks();
        setItems(filteredTasks);
    }, [tasks, filters]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex((item) => item.id === active.id);
            const newIndex = tasks.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(tasks, oldIndex, newIndex);
            dispatch(reorderTasks(newItems));
            setItems(newItems);
        }
    };

    return (
        <div className="min-h-[100px] py-4 flex flex-wrap md:gap-[20px] ">
            {items.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No tasks found</p>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((task, index) => (
                            <TaskItem
                                key={task.id || index}
                                task={task}
                                index={index}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}

export default TaskList;
