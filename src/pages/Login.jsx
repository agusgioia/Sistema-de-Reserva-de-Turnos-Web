import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { loginUsuario } from "../api/Api";
import { useAuth } from "../context/useAuth";
import "../css/Page.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setMensaje("Completá email y contraseña.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const res = await loginUsuario({ email, password });
      const user = res?.usuario || res?.user || res;
      const token = res?.token || res?.accessToken || "demo-token";
      const tenant = {
        id: user?.negocioId || user?.negocio?.id || 1,
        nombre: user?.negocioNombre || user?.negocio?.nombre || "Negocio",
      };

      login({ token, user, tenant });

      const fallback = user?.rol === "OWNER" || user?.rol === "ADMIN" ? "/admin" : "/agenda";
      const fromPath = location.state?.from?.pathname;
      const next = fromPath && fromPath !== "/login" ? fromPath : fallback;
      navigate(next, { replace: true });
    } catch (error) {
      setMensaje(`No se pudo iniciar sesión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Iniciar sesión</h1>
      <div className="page-content">
        <InputText
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          feedback={false}
          toggleMask
          style={{ width: "100%", marginBottom: "1rem" }}
          inputStyle={{ width: "100%" }}
        />

        <Button label={loading ? "Ingresando..." : "Ingresar"} onClick={handleSubmit} disabled={loading} />

        {mensaje && <p>{mensaje}</p>}
        <p>
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
