import { STORAGE_KEY } from '../context/auth-context';

const API = import.meta.env.VITE_API;

function getAuthMetadata() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const session = JSON.parse(raw);
    return {
      token: session?.token,
      tenantId: session?.tenant?.id,
    };
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const { token, tenantId } = getAuthMetadata();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    headers['X-Tenant-Id'] = String(tenantId);
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status} en ${path}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return null;
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
