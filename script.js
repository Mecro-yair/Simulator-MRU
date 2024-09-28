const positionCanvas = document.getElementById('positionCanvas');
const velocityCanvas = document.getElementById('velocityCanvas');
const ctxPosition = positionCanvas.getContext('2d');
const ctxVelocity = velocityCanvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const timerDisplay = document.getElementById('timer');
const velocitySlider = document.getElementById('velocity');
const velocityDisplay = document.getElementById('velocityDisplay');
const object = document.getElementById('object');
const distanceInput = document.getElementById('distance');

let time = 0; // Tiempo inicial
let interval;
let currentVelocity = 0; // Velocidad inicial
let position = 0; // Posición inicial
let maxPosition = 10; // Distancia máxima por defecto
const totalTime = 20; // Tiempo total de simulación
const positionData = [];
const velocityData = [];

// Función para dibujar los ejes de abscisas y ordenadas en el canvas
function drawAxes(ctx, labelX, labelY) {
    ctx.clearRect(0, 0, 600, 300); // Aumentar el espacio para las gráficas
    
    // Eje X
    ctx.beginPath();
    ctx.moveTo(50, 150); // Cambiar posición inicial
    ctx.lineTo(580, 150); // Cambiar posición final
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(50, 20); // Cambiar posición inicial
    ctx.lineTo(50, 280); // Cambiar posición final
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    // Etiquetas de los ejes
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(labelX, 550, 160);  // Label eje X
    ctx.fillText(labelY, 10, 30);    // Label eje Y

    // Divisiones en el eje X (tiempo)
    for (let i = 0; i <= totalTime; i++) {
        const x = (i / totalTime) * 530 + 50;
        ctx.fillText(i, x, 145);
        ctx.beginPath();
        ctx.moveTo(x, 135);
        ctx.lineTo(x, 155);
        ctx.stroke();
    }

    // Divisiones en el eje Y (distancia) de 2 en 2
    for (let i = 0; i <= maxPosition; i += 2) {
        const y = 150 - (i / maxPosition) * 130; // Ajustar la escala para que la distancia no supere el canvas
        ctx.fillText(i, 10, y + 5);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(60, y);
        ctx.stroke();
    }
}

// Función para dibujar los gráficos de posición y velocidad
function drawGraph(ctx, data, color) {
    ctx.beginPath();
    ctx.moveTo(50, 150); // Comienza en la base del gráfico

    for (let i = 0; i < data.length; i++) {
        const x = (i / totalTime) * 530 + 50;
        const y = 150 - (data[i] / maxPosition) * 130; // Asegurando que el gráfico se dibuje bien
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

// Actualizar la posición del objeto en el contenedor
function updateObjectPosition() {
    const sceneWidth = 600; // Ancho del contenedor aumentado
    const objectWidth = object.offsetWidth; // Ancho del objeto (cuadro rojo)
    const maxLeft = sceneWidth - objectWidth; // Límite a la derecha

    // Calcular la posición como una fracción del ancho máximo
    object.style.left = `${Math.min((position / maxPosition) * maxLeft, maxLeft)}px`;
}

function updateSimulation() {
    // Sincronización de tiempo y posición
    timerDisplay.textContent = `${time} segundos`;
    
    // Incremento de la posición basado en la velocidad, solo si el tiempo es mayor que 0
    if (time > 0) {
        position += currentVelocity; 
    }

    // Asegurar que la posición no supere la distancia máxima
    if (position >= maxPosition) {
        position = maxPosition; // Establecer posición en el máximo
        clearInterval(interval); // Detener el movimiento
    } else if (position < 0) {
        position = 0; // No permitir posiciones negativas
    }

    // Guarda los datos de posición y velocidad
    positionData.push(position);
    velocityData.push(currentVelocity);

    // Dibuja los ejes primero
    drawAxes(ctxPosition, 'Tiempo (s)', 'Distancia (m)');
    drawAxes(ctxVelocity, 'Tiempo (s)', 'Velocidad (m/s)');

    // Luego dibuja los datos
    drawGraph(ctxPosition, positionData, 'blue');
    drawGraph(ctxVelocity, velocityData, 'red');

    updateObjectPosition(); // Actualiza la posición del objeto

    time++; // Incrementa el tiempo
}

startButton.addEventListener('click', () => {
    maxPosition = parseFloat(distanceInput.value); // Actualiza la distancia máxima al inicio

    // Reiniciar variables al iniciar la simulación
    time = 0; // Reiniciar tiempo a 0
    position = 0; // Reiniciar posición a 0
    positionData.length = 0; // Limpiar datos de posición
    velocityData.length = 0; // Limpiar datos de velocidad

    if (interval) clearInterval(interval);
    
    interval = setInterval(() => {
        if (time < totalTime) {
            updateSimulation(); // Actualizar simulación
        } else {
            clearInterval(interval); // Detener al alcanzar el tiempo total
        }
    }, 1000);
});

resetButton.addEventListener('click', () => {
    clearInterval(interval);
    time = 0; // Reinicia el tiempo a 0
    position = 0; // Reinicia la posición a 0
    positionData.length = 0; // Limpia los datos de posición
    velocityData.length = 0; // Limpia los datos de velocidad
    timerDisplay.textContent = '0 segundos'; // Actualiza la visualización del temporizador
    updateObjectPosition(); // Actualiza la posición del objeto
    ctxPosition.clearRect(0, 0, 600, 300); // Limpia el canvas de posición
    ctxVelocity.clearRect(0, 0, 600, 300); // Limpia el canvas de velocidad
    drawAxes(ctxPosition, 'Tiempo (s)', 'Distancia (m)'); // Dibuja los ejes
    drawAxes(ctxVelocity, 'Tiempo (s)', 'Velocidad (m/s)'); // Dibuja los ejes
});

velocitySlider.addEventListener('input', (e) => {
    currentVelocity = parseInt(e.target.value); // Actualiza la velocidad
    velocityDisplay.textContent = `${currentVelocity} m/s`; // Muestra la velocidad actual
});

// Inicializa con los ejes dibujados
drawAxes(ctxPosition, 'Tiempo (s)', 'Distancia (m)');
drawAxes(ctxVelocity, 'Tiempo (s)', 'Velocidad (m/s)');
