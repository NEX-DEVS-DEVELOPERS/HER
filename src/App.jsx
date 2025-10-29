import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
 
import Home from './pages/Home.jsx';
import ComfortSpace from './pages/ComfortSpace.jsx';
import Favorites from './pages/Favorites.jsx';
import Layout from './components/Layout.jsx';
import Clipboard from './pages/Clipboard.jsx';
import Admin from './pages/Admin.jsx';
import Calendar from './pages/Calendar.jsx';
import Music from './pages/Music.jsx';
import MeetingInvitation from './components/MeetingInvitation.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated, login } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <LoginScreen onLoginSuccess={login} />
          )
        }
      />
      
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="comfort" element={<ComfortSpace />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="clipboard" element={<Clipboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="music" element={<Music />} />
        <Route path="invitations" element={<MeetingInvitation />} />
        <Route path="admin" element={<Admin />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

