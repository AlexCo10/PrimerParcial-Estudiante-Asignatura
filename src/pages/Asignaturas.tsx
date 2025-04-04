
import React, { useState, useEffect } from 'react';
import { fetchData, createData, updateData, deleteData } from '../services/api';
import { toast } from '../components/Toast';

const Asignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAsignatura, setCurrentAsignatura] = useState({
    codigo: '',
    nombre: '',
    creditos: 0,
    descripcion: ''
  });
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    loadAsignaturas();
  }, []);

  const loadAsignaturas = async () => {
    try {
      setLoading(true);
      const data = await fetchData('asignatura');
      setAsignaturas(data);
    } catch (error) {
      toast('Error al cargar asignaturas', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentAsignatura({
      codigo: '',
      nombre: '',
      creditos: 0,
      descripcion: ''
    });
    setFormMode('create');
    setShowModal(true);
  };

  const openEditModal = (asignatura) => {
    setCurrentAsignatura({...asignatura});
    setFormMode('edit');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Convertir a número para el campo 'creditos'
    if (name === 'creditos') {
      newValue = parseInt(value) || 0;
    }
    
    setCurrentAsignatura({
      ...currentAsignatura,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formMode === 'create') {
        await createData('asignatura', currentAsignatura);
        toast('Asignatura creada correctamente', 'success');
      } else {
        await updateData('asignatura', { codigo: currentAsignatura.codigo }, currentAsignatura);
        toast('Asignatura actualizada correctamente', 'success');
      }
      
      setShowModal(false);
      loadAsignaturas();
    } catch (error) {
      toast('Error al guardar la asignatura', 'error');
      console.error(error);
    }
  };

  const handleDelete = async (codigo) => {
    if (window.confirm('¿Está seguro que desea eliminar esta asignatura?')) {
      try {
        await deleteData('asignatura', { codigo });
        toast('Asignatura eliminada correctamente', 'success');
        loadAsignaturas();
      } catch (error) {
        toast('Error al eliminar la asignatura. Asegúrese de que no tenga estudiantes matriculados.', 'error');
        console.error(error);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gestión de Asignaturas</h1>
      </header>
      
      <a href="/" className="back-link">← Volver al inicio</a>
      
      <div className="list">
        <div className="list-header">
          <h2>Lista de Asignaturas</h2>
          <button className="btn" onClick={openCreateModal}>Nueva Asignatura</button>
        </div>
        
        <div className="list-body">
          {loading ? (
            <div className="empty-state">
              <p>Cargando asignaturas...</p>
            </div>
          ) : asignaturas.length > 0 ? (
            asignaturas.map(asignatura => (
              <div className="list-item" key={asignatura.codigo}>
                <div className="list-item-info">
                  <h3>{asignatura.nombre}</h3>
                  <p>Código: {asignatura.codigo} | Créditos: {asignatura.creditos}</p>
                  {asignatura.descripcion && <p>{asignatura.descripcion}</p>}
                </div>
                <div className="list-item-actions">
                  <button className="btn" onClick={() => openEditModal(asignatura)}>Editar</button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleDelete(asignatura.codigo)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No hay asignaturas registradas</p>
              <button className="btn" onClick={openCreateModal}>Agregar Asignatura</button>
            </div>
          )}
        </div>
      </div>
      
      {showModal && (
        <div className={`modal ${showModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{formMode === 'create' ? 'Nueva Asignatura' : 'Editar Asignatura'}</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={currentAsignatura.codigo}
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
                  value={currentAsignatura.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="creditos">Créditos</label>
                <input
                  type="number"
                  id="creditos"
                  name="creditos"
                  min="0"
                  value={currentAsignatura.creditos}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="descripcion">Descripción (opcional)</label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={currentAsignatura.descripcion || ''}
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

export default Asignaturas;
