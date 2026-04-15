import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!user) {
    return showSignup
      ? <Signup onSwitchToLogin={() => setShowSignup(false)} />
      : <Login onSwitchToSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Dashboard />
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