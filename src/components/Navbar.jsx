import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, session, logout } = useAuth();
  const role = session?.user?.rol;

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
      visible: isAuthenticated && ["OWNER", "ADMIN", "RECEPTIONIST"].includes(role),
    },
    {
      label: "Agenda",
      icon: "pi pi-calendar",
      command: () => navigate("/agenda"),
      visible: isAuthenticated,
    },
    {
      label: "Admin Panel",
      icon: "pi pi-cog",
      command: () => navigate("/admin"),
      visible: isAuthenticated && ["OWNER", "ADMIN"].includes(role),
    },
  ];

  const start = isAuthenticated ?(
    <div className="navbar-logo" onClick={()=>navigate('/agenda')}>
      TURNOS
    </div>
  ) : (
    <Button label="Ingresar" onClick={() => navigate('/login')} />
  );

  const end = isAuthenticated ? (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>{session?.user?.email} ({role})</span>
      <Button
        label="Salir"
        severity="secondary"
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      />
    </div>
  ) : (
    <Button label="Ingresar" onClick={() => navigate("/login")} />
  );

  return (
    <div className="navbar-wrapper">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}

export default Navbar;
