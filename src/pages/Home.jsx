import { Card } from "primereact/card";
import { useState, useEffect } from "react";
import { getServicios } from "../api/Api";
import { useAuth } from "../context/useAuth";

export default function HomePage() {
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
    <div className="grid p-4 gap-4">
      <h2>{session?.tenant?.nombre || "Panel del negocio"}</h2>
      {mensaje && <p>{mensaje}</p>}
      {servicios.map((servicio) => (
        <Card
          key={servicio.id}
          title={`${servicio.nombre} - ${servicio.duracionMinutos} min - $${servicio.precio}`}
        >
          <p>Empleados disponibles:</p>
          <ul>
            {servicio.empleados?.map((emp) => (
              <li key={emp.id}>{emp.nombre}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
