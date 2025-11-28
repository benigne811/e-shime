import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { CrisisButton } from './components/layout/CrisisButton';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MoodTracking } from './pages/MoodTracking';
import { Chat } from './pages/Chat';
import { CreativeTherapy } from './pages/CreativeTherapy';
import { PeerStories } from './pages/PeerStories';
import { TherapistBooking } from './pages/TherapistBooking';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('eshime_user');
    const adminData = localStorage.getItem('eshime_admin');
    
    if (userData || adminData) {
      setIsAuthenticated(true);
      if (adminData) {
        setIsAdmin(true);
      }
    }

    const savedDarkMode = localStorage.getItem('eshime_dark_mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('eshime_dark_mode', newMode.toString());
  };

  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
    const userData = localStorage.getItem('eshime_user');
    const adminData = localStorage.getItem('eshime_admin');
    
    if (!userData && !adminData) {
      return <Navigate to="/login" />;
    }
    
    if (adminOnly && !adminData) {
      return <Navigate to="/dashboard" />;
    }
    
    return <>{children}</>;
  };

 
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const userData = localStorage.getItem('eshime_user');
    const adminData = localStorage.getItem('eshime_admin');
    
    if (userData || adminData) {
      return <Navigate to={adminData ? "/admin" : "/dashboard"} />;
    }
    
    return <>{children}</>;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen">
          <Navbar 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
          />
          
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing darkMode={darkMode} />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login darkMode={darkMode} />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register darkMode={darkMode} />
                  </PublicRoute>
                } 
              />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mood"
                element={
                  <ProtectedRoute>
                    <MoodTracking darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/creative"
                element={
                  <ProtectedRoute>
                    <CreativeTherapy darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stories"
                element={
                  <ProtectedRoute>
                    <PeerStories darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <TherapistBooking darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>

          {/* Fixed Crisis Help Button */}
          <CrisisButton darkMode={darkMode} />

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </div>
    </Router>
  );
}

export default App;
