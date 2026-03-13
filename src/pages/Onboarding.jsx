import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAuth } from '../context/useAuth';
import '../css/Page.css';

function OnboardingPage() {
  const [businessName, setBusinessName] = useState('');
  const [tenantId, setTenantId] = useState('1');
  const [error, setError] = useState('');
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleComplete = () => {
    if (!businessName.trim()) {
      setError('Completá el nombre del negocio.');
      return;
    }

    completeOnboarding({
      businessName,
      tenantId: Number(tenantId) || 1,
    });

    navigate('/admin', { replace: true });
  };

  return (
    <div className="page">
      <h1 className="page-title">Onboarding de negocio</h1>
      <div className="page-content">
        <InputText
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Nombre comercial"
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <InputText
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          placeholder="Tenant ID"
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <Button label="Finalizar onboarding" onClick={handleComplete} />

        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default OnboardingPage;
