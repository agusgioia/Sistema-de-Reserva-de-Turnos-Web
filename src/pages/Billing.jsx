import { Button } from 'primereact/button';
import { useAuth } from '../context/useAuth';
import '../css/Page.css';

function BillingPage() {
  const { session, updatePlan } = useAuth();

  const plans = [
    { code: 'STARTER', price: 'USD 12/mes', description: 'Hasta 2 empleados' },
    { code: 'PRO', price: 'USD 29/mes', description: 'Hasta 10 empleados' },
    { code: 'SCALE', price: 'USD 79/mes', description: 'Escala ilimitada' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Planes y Facturación</h1>
      <div className="page-content">
        <p>Plan actual: {session?.plan?.code || 'N/D'}</p>
        {plans.map((plan) => (
          <div key={plan.code} style={{ marginBottom: '1rem' }}>
            <strong>{plan.code}</strong> - {plan.price}
            <p>{plan.description}</p>
            <Button
              label={session?.plan?.code === plan.code ? 'Activo' : `Cambiar a ${plan.code}`}
              disabled={session?.plan?.code === plan.code}
              onClick={() => updatePlan(plan.code)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BillingPage;
