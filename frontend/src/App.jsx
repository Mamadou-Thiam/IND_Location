import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Reservations from './pages/Reservations';
import AdminCars from './pages/AdminCars';

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/connexion"
        element={user ? <Navigate to="/tableau-de-bord" /> : <Login />}
      />
      <Route
        path="/inscription"
        element={user ? <Navigate to="/tableau-de-bord" /> : <Register />}
      />

      <Route
        path="/tableau-de-bord"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/voitures"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Cars />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Reservations />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/voitures"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <AdminCars />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/connexion" />} />
      <Route path="*" element={<Navigate to="/connexion" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
