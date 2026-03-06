import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getServicios } from "../api/Api";
import "../css/Page.css";

function AdminPage() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    getServicios(1).then(setServicios);
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Panel Admin</h1>

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

