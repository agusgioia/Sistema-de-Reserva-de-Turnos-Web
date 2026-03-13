import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getServicios } from "../api/Api";
import { useAuth } from "../context/useAuth";
import "../css/Page.css";

function AdminPage() {
  const { session } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const negocioId = session?.tenant?.id || session?.user?.negocioId;
    if (!negocioId) return;

    getServicios(negocioId)
      .then((data) => setServicios(data || []))
      .catch((error) => setMensaje(`No se pudieron cargar servicios: ${error.message}`));
  }, [session?.tenant?.id, session?.user?.negocioId]);

  return (
    <div className="page">
      <h1 className="page-title">Panel Admin</h1>
      <p>Rol activo: {session?.user?.rol}</p>

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
