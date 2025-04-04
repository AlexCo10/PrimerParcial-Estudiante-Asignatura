
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Estudiantes from "./pages/Estudiantes";
import EstudianteDetalle from "./pages/EstudianteDetalle";
import Asignaturas from "./pages/Asignaturas";
import NotFound from "./pages/NotFound";
import "./index.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/estudiantes" element={<Estudiantes />} />
      <Route path="/estudiante/:codigo" element={<EstudianteDetalle />} />
      <Route path="/asignaturas" element={<Asignaturas />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
