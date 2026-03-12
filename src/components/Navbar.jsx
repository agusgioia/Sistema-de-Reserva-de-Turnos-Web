import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../css/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useAuth();

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/'),
      visible: isAuthenticated,
    },
    {
      label: 'Agenda',
      icon: 'pi pi-calendar',
      command: () => navigate('/agenda'),
      visible: isAuthenticated,
    },
    {
      label: 'Admin Panel',
      icon: 'pi pi-cog',
      command: () => navigate('/admin'),
      visible: isAuthenticated && session?.user?.role === 'OWNER',
    },
    {
      label: 'Facturación',
      icon: 'pi pi-credit-card',
      command: () => navigate('/billing'),
      visible: isAuthenticated && session?.user?.role === 'OWNER',
    },
  ];

  const start = (
    <div className="navbar-logo" onClick={() => navigate(isAuthenticated ? '/' : '/login')}>
      TURNOS SaaS
    </div>
  );

  const end = isAuthenticated ? (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <span>{session?.user?.email}</span>
      <Button label="Salir" severity="secondary" onClick={logout} />
    </div>
  ) : (
    <Button label="Ingresar" onClick={() => navigate('/login')} />
  );

  return (
    <div className="navbar-wrapper">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}

export default Navbar;
