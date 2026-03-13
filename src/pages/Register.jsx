import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { registrarUsuario } from "../api/Api";
import "../css/Page.css";

const roles = [
  { label: "Dueño", value: "OWNER" },
  { label: "Recepción", value: "RECEPTIONIST" },
  { label: "Empleado", value: "EMPLOYEE" },
  { label: "Cliente", value: "CLIENT" },
];

function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    rol: "CLIENT",
    negocioId: "1",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const required = ["nombre", "apellido", "email", "telefono", "password", "rol", "negocioId"];
    const missing = required.some((key) => !String(form[key]).trim());

    if (missing) {
      setMensaje("Completá todos los campos obligatorios para registrar el usuario.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      await registrarUsuario(form);
      setMensaje("Registro exitoso. Ahora podés iniciar sesión.");
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (error) {
      setMensaje(`No se pudo registrar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Registro de usuario</h1>
      <div className="page-content">
        <InputText value={form.nombre} onChange={(e) => updateField("nombre", e.target.value)} placeholder="Nombre" style={{ width: "100%", marginBottom: "1rem" }} />
        <InputText value={form.apellido} onChange={(e) => updateField("apellido", e.target.value)} placeholder="Apellido" style={{ width: "100%", marginBottom: "1rem" }} />
        <InputText value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" style={{ width: "100%", marginBottom: "1rem" }} />
        <InputText value={form.telefono} onChange={(e) => updateField("telefono", e.target.value)} placeholder="Teléfono" style={{ width: "100%", marginBottom: "1rem" }} />
        <Password value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Contraseña" feedback={false} toggleMask style={{ width: "100%", marginBottom: "1rem" }} inputStyle={{ width: "100%" }} />
        <Dropdown value={form.rol} options={roles} onChange={(e) => updateField("rol", e.value)} placeholder="Rol" style={{ width: "100%", marginBottom: "1rem" }} />
        <InputText value={form.negocioId} onChange={(e) => updateField("negocioId", e.target.value)} placeholder="Negocio ID" style={{ width: "100%", marginBottom: "1rem" }} />

        <Button label={loading ? "Registrando..." : "Registrarse"} onClick={handleSubmit} disabled={loading} />

        {mensaje && <p>{mensaje}</p>}
        <p>
          ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
