import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import {
  getServicios,
  getEmpleados,
  getDisponibles,
  crearTurno,
} from "../api/Api";
import "../css/page.css";

function AgendaPage() {
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [servicio, setServicio] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [fecha, setFecha] = useState(null);

  useEffect(() => {
    getServicios(1).then(setServicios);
    getEmpleados(1).then(setEmpleados);
  }, []);

  const buscarHorarios = async () => {
    if (!servicio || !empleado || !fecha) return;

    const fechaStr = fecha.toISOString().split("T")[0];

    const res = await getDisponibles(empleado.id, servicio.id, fechaStr);

    setHorarios(res);
  };

  const reservar = async (hora) => {
    const fechaStr = fecha.toISOString().split("T")[0];

    const turno = {
      fecha: fechaStr,
      horaInicio: hora,
      horaFin: hora,
      clienteNombre: "Cliente Demo",
      clienteTelefono: "123456",
      servicioId: servicio.id,
      empleadoId: empleado.id,
    };

    await crearTurno(turno);

    buscarHorarios();
  };

  return (
    <div className="page">
      <h1 className="page-title">Reservar turno</h1>

      <div className="page-content">
        <Dropdown
          value={servicio}
          options={servicios}
          optionLabel="nombre"
          placeholder="Seleccionar servicio"
          onChange={(e) => setServicio(e.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <Dropdown
          value={empleado}
          options={empleados}
          optionLabel="nombre"
          placeholder="Seleccionar empleado"
          onChange={(e) => setEmpleado(e.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <Calendar
          value={fecha}
          onChange={(e) => setFecha(e.value)}
          dateFormat="yy-mm-dd"
          style={{ marginBottom: "1rem" }}
        />

        <Button
          label="Buscar horarios"
          onClick={buscarHorarios}
          style={{ marginBottom: "1rem" }}
        />

        <div>
          {horarios.map((h, i) => (
            <Button
              key={i}
              label={h}
              style={{ margin: "0.5rem" }}
              onClick={() => reservar(h)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgendaPage;
