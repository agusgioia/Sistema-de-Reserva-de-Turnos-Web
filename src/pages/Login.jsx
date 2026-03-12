import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useAuth } from '../context/useAuth';
import '../css/Page.css';

const roleOptions = [
  { label: 'Dueño', value: 'OWNER' },
  { label: 'Recepción', value: 'RECEPTIONIST' },
  { label: 'Profesional', value: 'EMPLOYEE' },
];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('OWNER');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Ingresá un email válido.');
      return;
    }

    login({ email, role });
    const fallback = role === 'OWNER' ? '/onboarding' : '/agenda';
    const redirectTo = location.state?.from?.pathname || fallback;
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="page">
      <h1 className="page-title">Acceso SaaS</h1>
      <div className="page-content">
        <InputText
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <Dropdown
          value={role}
          options={roleOptions}
          onChange={(e) => setRole(e.value)}
          placeholder="Seleccioná rol"
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <Button label="Ingresar" onClick={handleSubmit} />

        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
