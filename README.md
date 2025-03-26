# Task Manager

A modern, feature-rich task management application built with React and Redux Toolkit. This application helps users organize their tasks efficiently with a beautiful, responsive UI and powerful features.

## Features

### Core Task Management
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Drag and drop task reordering
- Task prioritization (High, Medium, Low)
- Due date tracking
- Task categorization

### Advanced Features
- Dark/Light mode support
- Task filtering and sorting
  - By status (All, Active, Completed)
  - By priority
  - By category
  - By search query
- Task statistics and analytics
  - Task completion rate
  - Priority distribution
  - Category distribution
- Task sharing functionality
- Data export capabilities

### User Interface
- Responsive design
- Modern gradient backgrounds
- Interactive task cards
- Drag-and-drop interface
- Modal dialogs for forms and sharing
- Snackbar notifications

## Tech Stack

- **Frontend Framework**: React
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Drag and Drop**: dnd-kit
- **Charts**: Chart.js
- **Local Storage**: Browser's localStorage API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd task-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Project Structure

```
src/
├── component/         # Reusable UI components
├── store/            # Redux store configuration
│   └── slices/       # Redux slices for state management
├── chars/            # Charts and statistics components
├── shareTask/        # Task sharing functionality
├── exportData/       # Data export functionality
└── App.js            # Main application component
```

## State Management

The application uses Redux Toolkit for state management with three main slices:

1. **tasksSlice**: Manages task data and operations
2. **filtersSlice**: Handles filtering and sorting preferences
3. **uiSlice**: Controls UI state (dark mode, modals, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Create React App for the initial project setup
- Redux Toolkit for state management
- Tailwind CSS for styling
- dnd-kit for drag and drop functionality
- Chart.js for data visualization
