import { useEffect, useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getServicios } from '../api/Api';
import { useAuth } from '../context/useAuth';
import '../css/Page.css';

function AdminPage() {
  const { session } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const serviceLimit = session?.plan?.limits?.services ?? 0;
  const exceededServices = useMemo(
    () => serviceLimit > 0 && servicios.length > serviceLimit,
    [serviceLimit, servicios.length],
  );

  useEffect(() => {
    const tenantId = session?.tenant?.id;
    if (!tenantId) return;

    getServicios(tenantId)
      .then((data) => setServicios(data || []))
      .catch((error) => setMensaje(`No se pudieron cargar servicios: ${error.message}`));
  }, [session?.tenant?.id]);

  return (
    <div className="page">
      <h1 className="page-title">Panel Admin SaaS</h1>
      <p>Plan activo: {session?.plan?.code}</p>
      <p>
        Límite de servicios: {serviceLimit} | Cargados: {servicios.length}
      </p>

      {exceededServices && (
        <p>
          Alcanzaste el límite del plan actual. Actualizá el plan para seguir agregando servicios.
        </p>
      )}

      {mensaje && <p>{mensaje}</p>}

      <div className="page-content">
        <DataTable value={servicios}>
          <Column field="id" header="ID" />
          <Column field="nombre" header="Servicio" />
          <Column field="duracionMinutos" header="Duración" />
          <Column field="precio" header="Precio" />
        </DataTable>
      </div>
    </div>
  );
}

export default AdminPage;
