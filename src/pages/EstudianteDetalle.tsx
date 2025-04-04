
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, createData, deleteData } from '../services/api';
import { toast } from '../components/Toast';

const EstudianteDetalle = () => {
  const { codigo } = useParams();
  const [estudiante, setEstudiante] = useState(null);
  const [asignaturasMatriculadas, setAsignaturasMatriculadas] = useState([]);
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAsignatura, setSelectedAsignatura] = useState('');
  const [totalCreditos, setTotalCreditos] = useState(0);
  const LIMITE_CREDITOS = 14;

  useEffect(() => {
    if (codigo) {
      loadEstudiante();
      loadAsignaturasMatriculadas();
      loadAsignaturasDisponibles();
    }
  }, [codigo]);

  const loadEstudiante = async () => {
    try {
      setLoading(true);
      const data = await fetchData(`alumno?codigo=eq.${codigo}`);
      if (data && data.length > 0) {
        setEstudiante(data[0]);
      }
    } catch (error) {
      toast('Error al cargar información del estudiante', 'error');
      console.error(error);
    }
  };

  const loadAsignaturasMatriculadas = async () => {
    try {
      const data = await fetchData(`matricula?codigo_alumno=eq.${codigo}&select=asignatura(*)`);
      const asignaturas = data.map(item => item.asignatura);
      setAsignaturasMatriculadas(asignaturas);
      
      // Calcular el total de créditos
      const creditos = asignaturas.reduce((total, asignatura) => total + asignatura.creditos, 0);
      setTotalCreditos(creditos);
    } catch (error) {
      toast('Error al cargar asignaturas matriculadas', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAsignaturasDisponibles = async () => {
    try {
      // Obtener todas las asignaturas
      const todasAsignaturas = await fetchData('asignatura');
      
      // Obtener las asignaturas matriculadas
      const matriculadas = await fetchData(`matricula?codigo_alumno=eq.${codigo}&select=codigo_asignatura`);
      const codigosMatriculados = matriculadas.map(item => item.codigo_asignatura);
      
      // Filtrar asignaturas disponibles (no matriculadas)
      const disponibles = todasAsignaturas.filter(
        asignatura => !codigosMatriculados.includes(asignatura.codigo)
      );
      
      setAsignaturasDisponibles(disponibles);
    } catch (error) {
      toast('Error al cargar asignaturas disponibles', 'error');
      console.error(error);
    }
  };

  const handleMatricular = async (e) => {
    e.preventDefault();
    
    if (!selectedAsignatura) {
      toast('Debe seleccionar una asignatura', 'error');
      return;
    }
    
    try {
      // Verificar si ya está matriculado en la asignatura
      const yaMatriculado = asignaturasMatriculadas.some(
        asignatura => asignatura.codigo === selectedAsignatura
      );
      
      if (yaMatriculado) {
        toast('El estudiante ya está matriculado en esta asignatura', 'error');
        return;
      }
      
      // Obtener la información de la asignatura seleccionada
      const asignaturaSeleccionada = asignaturasDisponibles.find(
        asignatura => asignatura.codigo === selectedAsignatura
      );
      
      // Verificar límite de créditos
      if (totalCreditos + asignaturaSeleccionada.creditos > LIMITE_CREDITOS) {
        toast(`No se puede matricular. Excede el límite de ${LIMITE_CREDITOS} créditos permitidos`, 'error');
        return;
      }
      
      await createData('matricula', {
        codigo_alumno: codigo,
        codigo_asignatura: selectedAsignatura
      });
      
      toast('Asignatura matriculada correctamente', 'success');
      setShowModal(false);
      
      // Recargar listas de asignaturas
      loadAsignaturasMatriculadas();
      loadAsignaturasDisponibles();
    } catch (error) {
      toast('Error al matricular asignatura', 'error');
      console.error(error);
    }
  };

  const handleDesmatricular = async (codigoAsignatura) => {
    if (window.confirm('¿Está seguro que desea eliminar esta matrícula?')) {
      try {
        await deleteData('matricula', {
          codigo_alumno: codigo,
          codigo_asignatura: codigoAsignatura
        });
        
        toast('Matrícula eliminada correctamente', 'success');
        
        // Recargar listas de asignaturas
        loadAsignaturasMatriculadas();
        loadAsignaturasDisponibles();
      } catch (error) {
        toast('Error al eliminar matrícula', 'error');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  if (!estudiante) {
    return (
      <div className="container">
        <header className="header">
          <h1>Estudiante no encontrado</h1>
        </header>
        <a href="/estudiantes" className="back-link">← Volver a Estudiantes</a>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Detalle de Estudiante</h1>
      </header>
      
      <a href="/estudiantes" className="back-link">← Volver a Estudiantes</a>
      
      <div className="student-detail">
        <h2>{estudiante.nombre} {estudiante.apellido}</h2>
        
        <div className="student-info">
          <p><strong>Código:</strong> {estudiante.codigo}</p>
          <p><strong>Email:</strong> {estudiante.email}</p>
          <p><strong>Teléfono:</strong> {estudiante.telefono || 'No registrado'}</p>
          <p><strong>Dirección:</strong> {estudiante.direccion || 'No registrada'}</p>
          <p><strong>Fecha de Nacimiento:</strong> {estudiante.fecha_nacimiento ? new Date(estudiante.fecha_nacimiento).toLocaleDateString() : 'No registrada'}</p>
          <p><strong>Género:</strong> {estudiante.genero || 'No registrado'}</p>
          <p><strong>Programa Académico:</strong> {estudiante.programa || 'No registrado'}</p>
          <p><strong>Semestre:</strong> {estudiante.semestre || 'No registrado'}</p>
        </div>
        
        <div className="subjects-list">
          <div className="list-header">
            <h3>Asignaturas Matriculadas</h3>
            <div className="credit-counter">
              <span className={totalCreditos > LIMITE_CREDITOS ? 'exceeded' : ''}>
                Créditos Matriculados: {totalCreditos}/{LIMITE_CREDITOS}
              </span>
            </div>
            <button className="btn" onClick={() => setShowModal(true)}>Agregar Asignatura</button>
          </div>
          
          {asignaturasMatriculadas.length > 0 ? (
            <div className="list-body">
              {asignaturasMatriculadas.map(asignatura => (
                <div className="list-item" key={asignatura.codigo}>
                  <div className="list-item-info">
                    <h3>{asignatura.nombre}</h3>
                    <p>Código: {asignatura.codigo} | Créditos: {asignatura.creditos}</p>
                  </div>
                  <div className="list-item-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleDesmatricular(asignatura.codigo)}
                    >
                      Eliminar Matrícula
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay asignaturas matriculadas</p>
              <button className="btn" onClick={() => setShowModal(true)}>Agregar Asignatura</button>
            </div>
          )}
        </div>
      </div>
      
      {showModal && (
        <div className={`modal ${showModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Matricular Asignatura</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            {asignaturasDisponibles.length > 0 ? (
              <form onSubmit={handleMatricular}>
                <div className="form-group">
                  <label htmlFor="asignatura">Seleccione una asignatura:</label>
                  <select
                    id="asignatura"
                    name="asignatura"
                    value={selectedAsignatura}
                    onChange={(e) => setSelectedAsignatura(e.target.value)}
                    required
                  >
                    <option value="">-- Seleccione --</option>
                    {asignaturasDisponibles.map(asignatura => {
                      // Verificar si matricular esta asignatura excedería el límite de créditos
                      const excederiaLimite = totalCreditos + asignatura.creditos > LIMITE_CREDITOS;
                      return (
                        <option 
                          key={asignatura.codigo} 
                          value={asignatura.codigo}
                          disabled={excederiaLimite}
                        >
                          {asignatura.nombre} ({asignatura.codigo}) - {asignatura.creditos} créditos
                          {excederiaLimite ? ' - Excede límite de créditos' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div className="credit-info">
                  <p>Total de créditos actuales: {totalCreditos}</p>
                  <p>Límite máximo: {LIMITE_CREDITOS} créditos</p>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn">Matricular</button>
                </div>
              </form>
            ) : (
              <div className="empty-state">
                <p>No hay asignaturas disponibles para matricular</p>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteDetalle;
