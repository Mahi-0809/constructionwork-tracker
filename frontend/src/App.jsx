// Import React (needed in every component file)
import React from 'react';

// Import our layout components
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

// Import the Dashboard page
import Dashboard from './pages/Dashboard/Dashboard';

// Import App-level styles
import './App.css';

function App() {
  return (
    // Outermost wrapper for the whole app
    <div className="app-wrapper">

      {/* Top navigation bar — spans full width */}
      <Navbar />

      {/* Below navbar: sidebar + main content side by side */}
      <div className="app-body">
        <Sidebar />

        {/* Main content area — this is where pages will load */}
        <main className="main-content">
          <Dashboard />
        </main>
      </div>

    </div>
  );
}

export default App;