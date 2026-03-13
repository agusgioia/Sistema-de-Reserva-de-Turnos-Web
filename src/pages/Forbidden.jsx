import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "../css/Page.css";

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1 className="page-title">Acceso denegado</h1>
      <div className="page-content">
        <p>Tu rol no tiene permisos para ver esta sección.</p>
        <Button label="Ir al inicio" onClick={() => navigate("/")} />
      </div>
    </div>
  );
}

export default ForbiddenPage;
