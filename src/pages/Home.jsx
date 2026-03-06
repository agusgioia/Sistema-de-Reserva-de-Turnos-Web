import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { getServicios } from "../api/Api";

export default function HomePage({ onReservar }) {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    getServicios().then((data) => setServicios(data));
  }, []);

  return (
    <div className="grid p-4 gap-4">
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
          <Button
            label="Reservar"
            onClick={() => onReservar(servicio)}
            className="p-button-success"
          />
        </Card>
      ))}
    </div>
  );
}
