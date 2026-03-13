import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  getServicios,
  getEmpleados,
  getDisponibles,
  crearTurno,
} from "../api/Api";
import { useAuth } from "../context/useAuth";
import "../css/Page.css";

function formatDate(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}

function AgendaPage() {
  const { session } = useAuth();
  const role = session?.user?.rol;
  const canReserve = ["OWNER", "ADMIN", "RECEPTIONIST", "CLIENT"].includes(role);

  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const [servicio, setServicio] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [fecha, setFecha] = useState(null);

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");

  const fechaStr = useMemo(() => formatDate(fecha), [fecha]);

  useEffect(() => {
    const negocioId = session?.tenant?.id || session?.user?.negocioId;
    if (!negocioId) return;

    Promise.all([getServicios(negocioId), getEmpleados(negocioId)])
      .then(([serviciosRes, empleadosRes]) => {
        setServicios(serviciosRes || []);
        setEmpleados(empleadosRes || []);
      })
      .catch((error) => {
        setMensaje(`No se pudieron cargar servicios/empleados: ${error.message}`);
      });
  }, [session?.tenant?.id, session?.user?.negocioId]);

  const buscarHorarios = async () => {
    if (!servicio || !empleado || !fechaStr) {
      setMensaje("Seleccioná servicio, empleado y fecha antes de buscar horarios.");
      return;
    }

    setLoading(true);
    setMensaje("");
    try {
      const res = await getDisponibles(empleado.id, servicio.id, fechaStr);
      setHorarios(res || []);
      if (!res?.length) {
        setMensaje("No hay horarios disponibles para esta selección.");
      }
    } catch (error) {
      setMensaje(`No se pudieron obtener horarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reservar = async (horaInicio) => {
    if (!canReserve) {
      setMensaje("Tu rol no puede generar reservas.");
      return;
    }

    if (!clienteNombre.trim() || !clienteTelefono.trim()) {
      setMensaje("Completá nombre y teléfono del cliente para reservar.");
      return;
    }

    const turno = {
      fecha: fechaStr,
      horaInicio,
      horaFin: addMinutes(horaInicio, servicio?.duracionMinutos || 0),
      clienteNombre,
      clienteTelefono,
      servicioId: servicio.id,
      empleadoId: empleado.id,
      estado: "RESERVADO",
    };

    setLoading(true);
    setMensaje("");
    try {
      await crearTurno(turno);
      setMensaje("Turno reservado correctamente.");
      await buscarHorarios();
    } catch (error) {
      setMensaje(`No se pudo reservar el turno: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Agenda</h1>
      <p>Rol: {role}</p>

      <div className="page-content">
        <Dropdown value={servicio} options={servicios} optionLabel="nombre" placeholder="Seleccionar servicio" onChange={(e) => setServicio(e.value)} style={{ width: "100%", marginBottom: "1rem" }} />
        <Dropdown value={empleado} options={empleados} optionLabel="nombre" placeholder="Seleccionar empleado" onChange={(e) => setEmpleado(e.value)} style={{ width: "100%", marginBottom: "1rem" }} />

        <Calendar value={fecha} onChange={(e) => setFecha(e.value)} dateFormat="yy-mm-dd" showIcon style={{ width: "100%", marginBottom: "1rem" }} />

        {canReserve && (
          <>
            <InputText value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} placeholder="Nombre del cliente" style={{ width: "100%", marginBottom: "1rem" }} />
            <InputText value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} placeholder="Teléfono del cliente" style={{ width: "100%", marginBottom: "1rem" }} />
          </>
        )}

        <Button label={loading ? "Buscando..." : "Buscar horarios"} onClick={buscarHorarios} disabled={loading} style={{ marginBottom: "1rem" }} />

        {mensaje && <p>{mensaje}</p>}

        <div>
          {horarios.map((h, i) => {
            const hora = typeof h === "string" ? h : h.horaInicio || h.hora;
            return (
              <Button
                key={`${hora}-${i}`}
                label={hora}
                style={{ margin: "0.5rem" }}
                onClick={() => reservar(hora)}
                disabled={loading || !canReserve}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AgendaPage;
