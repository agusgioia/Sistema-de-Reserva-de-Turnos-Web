import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Agenda from "./pages/Agenda";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <PrimeReactProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </Router>
      </PrimeReactProvider>
    </>
  );
}

export default App;
