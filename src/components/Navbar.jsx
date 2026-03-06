import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Home",
      icon: "pi pi-calendar",
      command: () => navigate("/"),
    },
    {
      label: "Agenda",
      icon: "pi pi-calendar",
      command: () => navigate("/agenda"),
    },
    {
      label: "Admin Panel",
      icon: "pi pi-cog",
      command: () => navigate("/admin"),
    },
  ];

  const start = (
    <div className="navbar-logo" onClick={() => navigate("/")}>
      TURNOS
    </div>
  );

  return (
    <div className="navbar-wrapper">
      <Menubar model={items} start={start} />
    </div>
  );
}

export default Navbar;
