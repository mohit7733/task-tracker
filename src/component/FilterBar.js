import { useDispatch, useSelector } from "react-redux";
import { faSearch, faRedo, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  setStatusFilter,
  setSearchQuery,
  setPriorityFilter,
  setSortBy,
  setSortOrder,
  resetFilters,
  setSelectedCategory,
  setTaskDate,
} from "../store/slices/filtersSlice";

function FilterBar() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const filters = useSelector((state) => state.filters);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const categories = [...new Set(tasks.map(task => task.category))];
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className={`p-4 shadow-md rounded-lg mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full px-4 py-2 border rounded-md border-[#2196f3] text-[#2196f3] hover:bg-[#2196f3] hover:text-white flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className={`flex flex-wrap gap-2 form-control ${!isFilterOpen ? 'hidden md:flex' : 'flex'}`}>
        <div className="relative flex-grow min-w-[200px]">
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Search tasks</label>
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search tasks"
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className={`pl-10 pr-3 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''} h-[38.4px]`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Category</label>
          <select
            value={filters.selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'} cursor-pointer h-[40px]  `}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Status</label>
          <select
            value={filters.status}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'} cursor-pointer h-[40px]`}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Priority</label>
          <select
            value={filters.priorityFilter}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
            className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'} cursor-pointer h-[40px]`}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Sort by</label>
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'} cursor-pointer h-[40px]`}
          >
            <option value="createdAt">Created Date</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
        <div>
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Sort order</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => dispatch(setSortOrder(e.target.value))}
            className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'} cursor-pointer h-[40px]`}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium px-2 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'}`}>Date</label>
          <input
            type="date"
            name="dueDate"
            value={filters.taskDate}
            onChange={(e) => dispatch(setTaskDate(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'} h-[40px]`}
          />
        </div>

        <button
          onClick={() => dispatch(resetFilters())}
          className="px-4 py-2 border rounded-md border-[#2196f3] text-[#2196f3] hover:bg-[#2196f3] hover:text-white flex items-center space-x-2 transition-all duration-200 h-[38.4px]"
        >
          <FontAwesomeIcon icon={faRedo} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
