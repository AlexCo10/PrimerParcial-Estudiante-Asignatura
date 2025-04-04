
let activeToast = null;
let activeTimeout = null;

export const toast = (message, type = 'success', duration = 3000) => {
  // Eliminar toast anterior si existe
  if (activeToast) {
    document.body.removeChild(activeToast);
    clearTimeout(activeTimeout);
  }
  
  // Crear nuevo elemento toast
  const toastElement = document.createElement('div');
  toastElement.className = `toast ${type}`;
  toastElement.textContent = message;
  
  // Agregar al DOM
  document.body.appendChild(toastElement);
  
  // Mostrar el toast (esperar un momento para que la transición funcione)
  setTimeout(() => {
    toastElement.classList.add('show');
  }, 10);
  
  // Guardar referencia al toast actual
  activeToast = toastElement;
  
  // Ocultar después de la duración especificada
  activeTimeout = setTimeout(() => {
    toastElement.classList.remove('show');
    
    // Eliminar del DOM después de la transición
    setTimeout(() => {
      document.body.removeChild(toastElement);
      activeToast = null;
    }, 300);
  }, duration);
};
