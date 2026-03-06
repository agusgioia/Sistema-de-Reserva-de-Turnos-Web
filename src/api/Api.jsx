const API = import.meta.env.VITE_API;

export async function getNegocios() {
  const res = await fetch(`${API}/negocios`);
  return res.json();
}

export async function getEmpleados() {
  const res = await fetch(`${API}/empleados`);
  return res.json();
}

export async function getServicios() {
  const res = await fetch(`${API}/servicios`);
  return res.json();
}

export async function getTurnos() {
  const res = await fetch(`${API}/turnos`);
  return res.json();
}

export async function crearTurno(turno) {
  const res = await fetch(`${API}/turnos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(turno),
  });

  return res.json();
}

export async function getDisponibles(empleadoId, servicioId, fecha) {
  const res = await fetch(
    `${API}/agenda/disponibles`,
    empleadoId,
    servicioId,
    fecha,
  );
  return res.json();
}
