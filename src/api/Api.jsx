import { STORAGE_KEY } from "../context/auth-context";

const API = import.meta.env.VITE_API || "http://localhost:8080";

function readAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token,
      negocioId: parsed?.tenant?.id,
    };
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const { token, negocioId } = readAuth();
  const headers = {
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (negocioId) headers["X-Negocio-Id"] = String(negocioId);

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return null;
}

export async function loginUsuario(payload) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function registrarUsuario(payload) {
  const normalized = {
    nombre: payload.nombre,
    apellido: payload.apellido,
    email: payload.email,
    telefono: payload.telefono,
    password: payload.password,
    rol: payload.rol,
    negocioId: Number(payload.negocioId),
  };

  try {
    return await request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });
  } catch {
    return request("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });
  }
}

export async function getNegocios() {
  return request("/negocios");
}

export async function getEmpleados(negocioId) {
  const query = negocioId ? `?negocioId=${negocioId}` : "";
  return request(`/empleados${query}`);
}

export async function getServicios(negocioId) {
  const query = negocioId ? `?negocioId=${negocioId}` : "";
  return request(`/servicios${query}`);
}

export async function getTurnos() {
  return request("/turnos");
}

export async function crearTurno(turno) {
  return request("/turnos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
