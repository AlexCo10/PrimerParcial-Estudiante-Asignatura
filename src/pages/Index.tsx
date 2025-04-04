
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <header className="header">
        <h1>Sistema de Gestión de Matrículas</h1>
      </header>
      
      <div className="main-menu">
        <div className="menu-card">
          <h2>Estudiantes</h2>
          <p>Gestione la información de los estudiantes, vea sus detalles y asigne asignaturas.</p>
          <button className="btn" onClick={() => navigate('/estudiantes')}>Ir a Estudiantes</button>
        </div>
        
        <div className="menu-card">
          <h2>Asignaturas</h2>
          <p>Administre el catálogo de asignaturas, cree nuevas y vea los estudiantes matriculados.</p>
          <button className="btn" onClick={() => navigate('/asignaturas')}>Ir a Asignaturas</button>
        </div>
      </div>
    </div>
  );
};

export default Index;
