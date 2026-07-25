// FASES DEL CREADOR DE PONIS
const PHASES = [
    {
        id: 'raza',
        title: 'Selección de Raza',
        options: ['Terrestre', 'Unicornio', 'Pegaso', 'Alicornio', 'Changeling', 'Grifo', 'Dragón', 'Pony de Cristal', 'Zebra', 'Hippogriffo','Minotauro', 'Jack', 'Kirin'],
        elementId: 'attr-raza'
    },
    {
        id: 'genero',
        title: 'Selección de Género',
        options: ['Hembra', 'Macho'],
        elementId: 'attr-genero'
    },
    {
        id: 'cabello-tipo',
        title: 'Tipo de Melena',
        options: ['Lacio', 'Ondulado', 'Rizado','Recogido', 'Con Trenzas', 'Punk/Cresta', 'Afro'],
        elementId: 'attr-cabello-tipo'
    },
    {
        id: 'cabello-largo',
        title: 'Largo de Melena',
        options: ['Corto', 'Mediano', 'Largo', 'Muy Largo'],
        elementId: 'attr-cabello-largo'
    },
    {
        id: 'cuerpo-tipo',
        title: 'Tipo de Cuerpo',
        options: ['Estandar', 'Esbelto', 'Fuerte', 'Pequeño', 'Grande', 'Robusto','Gordo'],
        elementId: 'attr-cuerpo-tipo'
    },
    {
        id: 'cuerpo-color',
        title: 'Color de Cuerpo',
        options: ['Rosa', 'Azul', 'Verde', 'Celeste','Morado', 'Lavanda', 'Amarillo', 'Verde Menta', 'Blanco ', 'Melocotón','Naranja', 'Rojo', 'Negro', 'Gris', 'Marrón', 'Turquesa'],
        elementId: 'attr-cuerpo-color'
    },
    {
        id: 'cabello-color',
        title: 'Color de Melena',
        options: ['Fucsia', 'Rosa', 'Azul', 'Verde', 'Celeste','Morado', 'Lavanda', 'Amarillo', 'Verde Menta', 'Blanco ', 'Melocotón','Naranja', 'Rojo', 'Negro', 'Gris', 'Marrón', 'Turquesa'],
        elementId: 'attr-cabello-color'
    },
    {
        id: 'ojo-color',
        title: 'Color de Ojos',
        options: ['Fucsia', 'Rosa', 'Azul', 'Verde', 'Celeste','Morado', 'Lavanda', 'Amarillo', 'Verde Menta', 'Blanco ', 'Melocotón','Naranja', 'Rojo', 'Negro', 'Gris', 'Marrón', 'Turquesa'],
        elementId: 'attr-ojo-color'
    },
    {
        id: 'personalidad',
        title: 'Personalidad',
        options: ['Aventurero/a','Malo/a','Sarcastico/a','Creativo/a','Carismatico/a','Tierno/a', 'Tímido/a', 'Alegre', 'Intelectual', 'Generoso/a', 'Leal', 'Arrogante','Soñador/a'],
        elementId: 'attr-personalidad'
    }
];

// PALETA DE COLORES PASTEL PARA LA RULETA
const PASTEL_COLORS = [
    '#ffb3ba', // rosa
    '#ffdfba', // naranja
    '#ffffba', // amarillo
    '#baffc9', // verde
    '#bae1ff', // celeste
    '#e8c4ff', // lila
    '#ffd1dc', // rosa claro
    '#d0f4de',  // menta claro
    '#c5b9fc', // azul pastel
];

const UI_TEXT = {
    spinIdle: '¡Gira la Ruleta!',
    spinActive: 'Girando...',
    spinComplete: '¡Creado!',
    completeTitle: '¡Personaje Completo!',
    finalPhaseLabel: 'Fase Final',
    defaultTalentPlaceholder: 'Escribe aquí cuál es el talento especial de tu personaje...',
    completedTalentPlaceholder: '¡Tu personaje está listo! Describe aquí su talento o Cutie Mark...'
};

// VARIABLES DE ESTADO
let currentPhaseIndex = 0;
let isSpinning = false;
let wheelAngle = 0;
let spinSpeed = 0;
const friction = 0.991; // Desaceleración más lenta para que gire por más tiempo

// ELEMENTOS DEL DOM
const welcomeScreen = document.getElementById('welcome-screen');
const creatorScreen = document.getElementById('creator-screen');
const startBtn = document.getElementById('start-btn');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');
const phaseNumText = document.getElementById('current-phase-num');
const phaseTitleText = document.getElementById('current-phase-title');
const talentTextarea = document.getElementById('pony-talent');

// SINTETIZADOR DE AUDIO (Web Audio API)
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTickSound() {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {
        console.log("Audio play blocked/failed", e);
    }
}

function playWinSound() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const playNote = (freq, time, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            osc.start(time);
            osc.stop(time + duration);
        };
        // Acorde alegre de fantasía
        playNote(523.25, now, 0.15); // C5
        playNote(659.25, now + 0.1, 0.15); // E5
        playNote(783.99, now + 0.2, 0.15); // G5
        playNote(1046.50, now + 0.3, 0.4); // C6
    } catch (e) {
        console.log(e);
    }
}

// INICIAR EVENTOS
startBtn.addEventListener('click', () => {
    initAudio();
    welcomeScreen.classList.remove('active');
    creatorScreen.classList.add('active');
    loadPhase(0);
});

spinBtn.addEventListener('click', () => {
    initAudio();
    if (isSpinning) return;
    startSpin();
});

resetBtn.addEventListener('click', resetCreator);

// CARGAR FASE ACTUAL
function loadPhase(index) {
    currentPhaseIndex = index;
    const phase = PHASES[currentPhaseIndex];
    
    phaseNumText.textContent = `Paso ${currentPhaseIndex + 1} de ${PHASES.length}`;
    phaseTitleText.textContent = phase.title;
    
    // Configurar ruleta para esta fase
    wheelAngle = 0;
    drawWheel();
    
    spinBtn.disabled = false;
    spinBtn.textContent = UI_TEXT.spinIdle;
}

// DIBUJAR LA RULETA
function drawWheel() {
    const phase = PHASES[currentPhaseIndex];
    const options = phase.options;
    const segments = options.length;
    const arc = (Math.PI * 2) / segments;
    const radius = canvas.width / 2 - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Guardar contexto y rotar según el ángulo actual de la ruleta
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(wheelAngle);
    
    for (let i = 0; i < segments; i++) {
        const segmentAngle = i * arc;
        
        // Dibujar rebanada
        ctx.beginPath();
        ctx.fillStyle = PASTEL_COLORS[i % PASTEL_COLORS.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, segmentAngle, segmentAngle + arc);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Escribir texto
        ctx.save();
        ctx.fillStyle = '#5c4a52';
        ctx.font = 'bold 14px "Comfortaa", sans-serif';
        ctx.textAlign = 'right';
        ctx.translate(0, 0);
        ctx.rotate(segmentAngle + arc / 2);
        ctx.fillText(options[i], radius - 20, 5);
        ctx.restore();
    }
    
    // Círculo central decorativo (botón del medio)
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = varColor('--accent-pink');
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Estrella en el centro
    ctx.fillStyle = varColor('--accent-pink');
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', 0, 0);
    
    ctx.restore();
}

// OBTENER VARIABLE CSS
function varColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#ff8ebb';
}

// INICIAR EL GIRO
function startSpin() {
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = UI_TEXT.spinActive;
    
    // Velocidad inicial aleatoria más alta (más rápido)
    spinSpeed = Math.random() * 0.4 + 0.6; // Entre 0.6 y 1.0 rad por frame
    
    let lastSegment = -1;
    
    function animate() {
        if (!isSpinning) return;
        
        wheelAngle += spinSpeed;
        spinSpeed *= friction;
        
        // Sonar "tick" al pasar de segmento
        const phase = PHASES[currentPhaseIndex];
        const segments = phase.options.length;
        const arc = (Math.PI * 2) / segments;
        
        // Ángulo normalizado positivo
        const normalizedAngle = (wheelAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const currentSegment = Math.floor(normalizedAngle / arc);
        
        if (currentSegment !== lastSegment) {
            playTickSound();
            lastSegment = currentSegment;
        }
        
        drawWheel();
        
        // Detener cuando la velocidad es casi nula
        if (spinSpeed < 0.002) {
            stopSpin();
        } else {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// DETENER EL GIRO Y PROCESAR GANADOR
function stopSpin() {
    isSpinning = false;
    playWinSound();
    
    const phase = PHASES[currentPhaseIndex];
    const options = phase.options;
    const segments = options.length;
    const arc = (Math.PI * 2) / segments;
    
    // El puntero está en la parte superior (-Math.PI/2 o 3*Math.PI/2)
    // El ángulo de la rueda añade un desplazamiento.
    // La fórmula para determinar el segmento bajo el puntero (arriba):
    const pointerAngle = (Math.PI * 3) / 2; // 270 grados (arriba)
    const normalizedAngle = (wheelAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    
    // Distancia del puntero respecto al origen de la rueda girada
    let winningIndex = Math.floor((pointerAngle - normalizedAngle + Math.PI * 2) % (Math.PI * 2) / arc);
    if (winningIndex < 0) winningIndex += segments;
    winningIndex = winningIndex % segments;
    
    const winningOption = options[winningIndex];
    
    // Registrar en el diario
    const li = document.getElementById(phase.elementId);
    li.classList.remove('empty');
    const valSpan = li.querySelector('.attr-value');
    valSpan.textContent = winningOption;
    
    // Pequeño efecto visual en la lista
    li.style.transform = 'scale(1.1)';
    setTimeout(() => {
        li.style.transform = 'none';
    }, 300);

    // Avanzar de fase
    setTimeout(() => {
        if (currentPhaseIndex < PHASES.length - 1) {
            loadPhase(currentPhaseIndex + 1);
        } else {
            finishCreation();
        }
    }, 1500);
}

// FINALIZAR CREACIÓN
function finishCreation() {
    spinBtn.disabled = true;
    spinBtn.textContent = UI_TEXT.spinComplete;
    phaseTitleText.textContent = UI_TEXT.completeTitle;
    phaseNumText.textContent = UI_TEXT.finalPhaseLabel;
    
    // Habilitar escritura del talento
    talentTextarea.disabled = false;
    talentTextarea.placeholder = UI_TEXT.completedTalentPlaceholder;
    talentTextarea.focus();
    
    // Mostrar botón de reinicio
    resetBtn.classList.remove('is-hidden');
}

// REINICIAR CREADOR
function resetCreator() {
    // Limpiar campos del diario
    PHASES.forEach(phase => {
        const li = document.getElementById(phase.elementId);
        li.classList.add('empty');
        li.querySelector('.attr-value').textContent = '¿?';
    });
    
    document.getElementById('pony-name').value = '';
    talentTextarea.value = '';
    talentTextarea.placeholder = UI_TEXT.defaultTalentPlaceholder;
    talentTextarea.disabled = true;
    
    resetBtn.classList.add('is-hidden');
    
    // Volver al paso 1
    loadPhase(0);
}
