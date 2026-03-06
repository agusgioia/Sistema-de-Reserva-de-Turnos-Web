const Footer = () => {
  return (
    <div className="page-container">
      <footer className="footer">
        <p className="copyright">
          © {new Date().getFullYear()} Desarrollado por Agustín Gioia. Todos los
          derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
