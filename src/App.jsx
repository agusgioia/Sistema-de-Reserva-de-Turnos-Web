import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Agenda from "./pages/Agenda";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forbidden" element={<Forbidden />} />

          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "ADMIN", "RECEPTIONIST"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "ADMIN", "RECEPTIONIST", "EMPLOYEE", "CLIENT"]}>
                <Agenda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                <Admin />
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
