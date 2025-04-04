
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, createData, updateData, deleteData } from '../services/api';
import { toast } from '../components/Toast';

const Estudiantes = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState({
    codigo: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      setLoading(true);
      const data = await fetchData('alumno');
      setEstudiantes(data);
    } catch (error) {
      toast('Error al cargar estudiantes', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentEstudiante({
      codigo: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
    });
    setFormMode('create');
    setShowModal(true);
  };

  const openEditModal = (estudiante) => {
    setCurrentEstudiante({...estudiante});
    setFormMode('edit');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEstudiante({
      ...currentEstudiante,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formMode === 'create') {
        await createData('alumno', currentEstudiante);
        toast('Estudiante creado correctamente', 'success');
      } else {
        await updateData('alumno', { codigo: currentEstudiante.codigo }, currentEstudiante);
        toast('Estudiante actualizado correctamente', 'success');
      }
      
      setShowModal(false);
      loadEstudiantes();
    } catch (error) {
      toast('Error al guardar el estudiante', 'error');
      console.error(error);
    }
  };

  const handleDelete = async (codigo) => {
    if (window.confirm('¿Está seguro que desea eliminar este estudiante?')) {
      try {
        await deleteData('alumno', { codigo });
        toast('Estudiante eliminado correctamente', 'success');
        loadEstudiantes();
      } catch (error) {
        toast('Error al eliminar el estudiante', 'error');
        console.error(error);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gestión de Estudiantes</h1>
      </header>
      
      <a href="/" className="back-link">← Volver al inicio</a>
      
      <div className="list">
        <div className="list-header">
          <h2>Lista de Estudiantes</h2>
          <button className="btn" onClick={openCreateModal}>Nuevo Estudiante</button>
        </div>
        
        <div className="list-body">
          {loading ? (
            <div className="empty-state">
              <p>Cargando estudiantes...</p>
            </div>
          ) : estudiantes.length > 0 ? (
            estudiantes.map(estudiante => (
              <div className="list-item" key={estudiante.codigo}>
                <div className="list-item-info">
                  <h3>{estudiante.nombre} {estudiante.apellido}</h3>
                  <p>Código: {estudiante.codigo} | Email: {estudiante.email} | Teléfono: {estudiante.telefono}</p>
                </div>
                <div className="list-item-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate(`/estudiante/${estudiante.codigo}`)}
                  >
                    Ver
                  </button>
                  <button className="btn" onClick={() => openEditModal(estudiante)}>Editar</button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleDelete(estudiante.codigo)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No hay estudiantes registrados</p>
              <button className="btn" onClick={openCreateModal}>Agregar Estudiante</button>
            </div>
          )}
        </div>
      </div>
      
      {showModal && (
        <div className={`modal ${showModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formMode === 'create' ? 'Nuevo Estudiante' : 'Editar Estudiante'}</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={currentEstudiante.codigo}
                  onChange={handleInputChange}
                  disabled={formMode === 'edit'}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={currentEstudiante.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={currentEstudiante.apellido}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={currentEstudiante.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={currentEstudiante.telefono}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estudiantes;
