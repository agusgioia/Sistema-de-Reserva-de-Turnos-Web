const API = import.meta.env.VITE_API;

async function request(path, options) {
  const res = await fetch(`${API}${path}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status} en ${path}`);
  }

  return res.json();
}

export async function getNegocios() {
  return request('/negocios');
}

export async function getEmpleados(negocioId) {
  const query = negocioId ? `?negocioId=${negocioId}` : '';
  return request(`/empleados${query}`);
}

export async function getServicios(negocioId) {
  const query = negocioId ? `?negocioId=${negocioId}` : '';
  return request(`/servicios${query}`);
}

export async function getTurnos() {
  return request('/turnos');
}

export async function crearTurno(turno) {
  return request('/turnos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(turno),
  });
}

export async function getDisponibles(empleadoId, servicioId, fecha) {
  const params = new URLSearchParams({
    empleadoId: String(empleadoId),
    servicioId: String(servicioId),
    fecha,
  });

  return request(`/agenda/disponibles?${params.toString()}`);
}
