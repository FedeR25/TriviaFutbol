// 1. Al cargar la página, iniciamos la sesión de juego
document.addEventListener('DOMContentLoaded', async () => {
    // Llamamos a startGame ('teams' para escudos)
    const data = await api.startGame('teams'); 

    if (data.error) {
        alert("Error al iniciar el juego: " + data.error);
        return;
    }

    // 2. Mostramos la primera pregunta que nos mandó el Backend
    renderQuestion(data.questions[0], data.sessionId);
});

function renderQuestion(question, sessionId) {
    // Seleccionamos los elementos usando los IDs de tu game.html
    const imgElement = document.getElementById('questionImage'); 
    const optionsContainer = document.getElementById('optionsGrid');
    const textElement = document.getElementById('questionText');

    // Seteamos la imagen del escudo y el texto
    textElement.innerText = "¿A qué equipo pertenece este escudo?";
    imgElement.src = question.imageUrl;

    // Limpiamos el contenedor de opciones y creamos los botones
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option.name;
        btn.className = 'btn-option'; // Clase que asumo tenés en tu CSS
        
        // Al hacer clic, enviamos la respuesta al backend
        btn.onclick = () => handleAnswer(sessionId, question.questionRefId, option.id);
        
        optionsContainer.appendChild(btn);
    });
}

async function handleAnswer(sessionId, questionRefId, answerId) {
    // Enviamos la respuesta (hardcodeamos 1000ms de tiempo por ahora)
    const res = await api.submitAnswer(sessionId, questionRefId, 'teams', answerId, 1000);
    
    if (res.isCorrect) {
        alert("¡GOOOL! Correcto ✅");
    } else {
        alert("Le erraste... ❌");
    }

    // Por ahora, recargamos para que traiga una pregunta nueva
    // (En el próximo paso lo hacemos más fluido sin recargar)
    location.reload(); 
}