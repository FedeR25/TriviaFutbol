async function startNewGame() {
    try {
        const response = await fetch(`${API_URL}/game/start`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ mode: 'teams' })
        });

        const data = await response.json();
        
        if (response.ok) {
            renderQuestion(data.questions[0], data.sessionId);
        } else {
            alert("Error al iniciar: " + data.error.message);
        }
    } catch (err) {
        console.error("Falla de conexión:", err);
    }
}

function renderQuestion(question, sessionId) {
    const imgElement = document.getElementById('team-badge');
    const optionsContainer = document.getElementById('options-container');

    // 1. Ponemos el escudo (el que vimos de Nice, Marsella, etc)
    imgElement.src = question.imageUrl;

    // 2. Limpiamos botones viejos y creamos los nuevos
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option.name;
        btn.onclick = () => sendAnswer(sessionId, question.questionRefId, option.id);
        optionsContainer.appendChild(btn);
    });
}