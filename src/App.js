import Header from './component/Header';
import TaskForm from './component/TaskForm';
import FilterBar from './component/FilterBar';
import TaskList from './component/TaskList';
import { useSelector } from 'react-redux';
import Charts from './chars/Charts';
import SharingDialog from './shareTask/ShareTask';
import ExportDialog from './exportData/ExportData';
import ImportDialog from './exportData/ImportData';
import History from './component/History';
function App() {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const isHistoryDialogOpen = useSelector((state) => state.ui.isHistoryDialogOpen);
  return (
    <div className={`min-h-screen bg-gradient-to-b ${isDarkMode ? 'bg-gray-900' : 'from-white to-gray-50'
      }`}>
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-104px)]">
        {isHistoryDialogOpen ? <History /> : <div className="space-y-8">
          <FilterBar />
          <TaskList />
          <TaskForm />
          <Charts />
        </div>}
        <SharingDialog />
        <ExportDialog />
        <ImportDialog />
      </main>
      <footer className={`mt-auto py-2 text-center text-gray-600 ${!isDarkMode ? 'bg-gray-900' : 'bg-white'} sticky bottom-0 z-10`}>
        <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
