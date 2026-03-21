// Configuración global del Frontend
const API_URL = 'http://localhost:3000/api';

// Función útil para pegar el Token en cada pedido
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};