
const API_URL = 'https://dvkvmjdefaytycdbsntd.supabase.co/rest/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2a3ZtamRlZmF5dHljZGJzbnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjE1MjAsImV4cCI6MjA1OTI5NzUyMH0.wYHbfTAJyIp2CLfU4LcIJfJAMrVq41zUK6kw5GZ01ts';

// Opciones por defecto para fetch
const getDefaultOptions = (method = 'GET') => ({
  method,
  headers: {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
});

// Función para construir la URL con los parámetros
const buildUrl = (resource, params = {}) => {
  let url = `${API_URL}/${resource}`;
  
  // Añadir parámetros a la URL si existen
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  if (queryParams) {
    url += `?${queryParams}`;
  }
  
  return url;
};

// Obtener datos
export const fetchData = async (resource, params = {}) => {
  const url = buildUrl(resource, params);
  const options = getDefaultOptions('GET');
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

// Crear datos
export const createData = async (resource, data) => {
  const url = buildUrl(resource);
  const options = {
    ...getDefaultOptions('POST'),
    body: JSON.stringify(data)
  };
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Error al crear datos: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

// Actualizar datos
export const updateData = async (resource, params, data) => {
  const url = buildUrl(resource, params);
  const options = {
    ...getDefaultOptions('PATCH'),
    body: JSON.stringify(data)
  };
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Error al actualizar datos: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

// Eliminar datos
export const deleteData = async (resource, params) => {
  const url = buildUrl(resource, params);
  const options = getDefaultOptions('DELETE');
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Error al eliminar datos: ${response.status} ${response.statusText}`);
  }
  
  // Para DELETE, la respuesta puede estar vacía
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};
