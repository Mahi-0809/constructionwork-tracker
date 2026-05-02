import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import DailyLogs from './pages/DailyLogs/DailyLogs';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import './App.css';
import SafetyChecks from './pages/SafetyChecks/SafetyChecks';
import Incidents from './pages/Incidents/Incidents';
import Equipment from './pages/Equipment/Equipment';
import Tasks from './pages/Tasks/Tasks';
import Reports from './pages/Reports/Reports';

function AppContent() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // Track which page is currently active
  const [activePage, setActivePage] = useState('Dashboard');

  if (!user) {
    return showSignup
      ? <Signup onSwitchToLogin={() => setShowSignup(false)} />
      : <Login onSwitchToSignup={() => setShowSignup(true)} />;
  }

  // Render the correct page based on activePage
const renderPage = () => {
  switch (activePage) {
    case 'Dashboard':      return <Dashboard />;
    case 'Daily Logs':     return <DailyLogs />;
    case 'Safety Checks':  return <SafetyChecks />;
    case 'Incidents':      return <Incidents />;
    case 'Equipment':      return <Equipment />;
    case 'Tasks':          return <Tasks />;
    case 'Reports':        return <Reports />;
    default:               return <Dashboard />;
  }
};

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app-body">
        {/* Pass setActivePage so Sidebar can update the active page */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;