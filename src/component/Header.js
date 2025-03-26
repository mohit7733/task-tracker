import { useDispatch, useSelector } from "react-redux";
import { faPlus, faChartBar, faShareAlt, faDownload, faSun, faMoon, faUpload, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleDarkMode, toggleTaskForm, toggleStatsDialog, toggleSharingDialog, toggleExportDialog, toggleImportDialog, toggleHistoryDialog } from "../store/slices/uiSlice";

function Header() {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);
    return (
        <header className="bg-blue-600  text-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-lg font-semibold  md:block hidden">Tracker</h1>

                <div className="flex items-center space-x-4">
                    <button
                        className="bg-white text-blue-600 px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-blue-100"
                        onClick={() => dispatch(toggleTaskForm())}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Task</span>
                    </button>

                    <button className="hover:text-gray-300" onClick={() => dispatch(toggleStatsDialog())}>
                        <FontAwesomeIcon icon={faChartBar} size="lg" title="Statistics" />
                    </button>

                    <button className="hover:text-gray-300" onClick={() => dispatch(toggleSharingDialog())}>
                        <FontAwesomeIcon icon={faShareAlt} size="lg" title="Share Task" />
                    </button>

                    <button className="hover:text-gray-300" onClick={() => dispatch(toggleExportDialog())}>
                        <FontAwesomeIcon icon={faDownload} size="lg" title="Export Task" />
                    </button>

                    <button className="hover:text-gray-300" onClick={() => dispatch(toggleImportDialog())}>
                        <FontAwesomeIcon icon={faUpload} size="lg" title="Import Task" />
                    </button>

                    <button className="hover:text-gray-300" onClick={() => dispatch(toggleDarkMode())}>
                        <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="lg" title="Toggle Dark Mode" />
                    </button>
                    <button className="hover:text-gray-300" onClick={() => dispatch(toggleHistoryDialog())}>
                        <FontAwesomeIcon icon={faHistory} size="lg" title="History" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
