/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

Matrix background with occasional red card-suit columns.
*/

function matrixBackground() {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");

    canvas2.width  = window.innerWidth;
    canvas2.height = window.innerHeight;

    const letters     = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const lettersArray = letters.split("");
    const suits       = ['♠', '♥', '♦', '♣'];

    const fontSize = 16;
    const columns  = Math.floor(canvas2.width / fontSize);

    const drops     = [];
    const suitCol   = [];   // si la columna está en modo "palo"
    const suitTimer = [];   // cuántos frames le quedan en modo palo

    for (let i = 0; i < columns; i++) {
        drops[i]     = Math.floor(Math.random() * canvas2.height / fontSize);
        suitCol[i]   = null;   // null = columna normal
        suitTimer[i] = 0;
    }

    function draw() {
        ctx2.fillStyle = "rgba(0,0,0,0.05)";
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
        ctx2.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {

            // ~0.3% de probabilidad por frame de activar modo palo en esta columna
            if (!suitCol[i] && Math.random() < 0.003) {
                suitCol[i]   = suits[Math.floor(Math.random() * suits.length)];
                suitTimer[i] = 40 + Math.floor(Math.random() * 60); // 40-100 frames
            }

            let char, color;

            if (suitCol[i]) {
                // cabeza: dibuja el palo en blanco brillante
                char  = suitCol[i];
                const isRed = suitCol[i] === '♥' || suitCol[i] === '♦';
                color = isRed ? '#ff4455' : '#ffffff';
                suitTimer[i]--;
                if (suitTimer[i] <= 0) suitCol[i] = null;
            } else {
                char  = lettersArray[Math.floor(Math.random() * lettersArray.length)];
                color = "#277401";
            }

            ctx2.fillStyle = color;
            ctx2.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas2.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 30);

    window.addEventListener("resize", () => {
        canvas2.width  = window.innerWidth;
        canvas2.height = window.innerHeight;
    });
}