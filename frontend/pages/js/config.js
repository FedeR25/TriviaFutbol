// frontend/js/config.js
const API_URL = 'http://localhost:3000/api';

// Función para obtener los headers con el Token
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}