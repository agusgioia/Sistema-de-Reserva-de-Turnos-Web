import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Agenda from './pages/Agenda';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Billing from './pages/Billing';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <ProtectedRoute>
                <Agenda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'RECEPTIONIST']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
