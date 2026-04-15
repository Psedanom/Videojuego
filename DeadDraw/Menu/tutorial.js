/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the matrix background effect for the tutorial page,
reusing the same logic as the rest of the game's menu screens.

*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Caracteres usados para el efecto matrix
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const lettersArray = letters.split("");

const fontSize = 16;
const columns = canvas.width / fontSize;

// Cada columna tiene su propio contador de posición vertical
const drops = [];
for (let i = 0; i < columns; i++) drops[i] = 1;

function draw() {
    // Relleno semitransparente para crear el efecto de rastro/desvanecimiento
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e8002d";  /* Color rojo del juego */
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        // Letra aleatoria en cada columna y posición
        const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reinicia la columna aleatoriamente cuando llega al fondo
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Actualiza el efecto cada 30ms (~33fps)
setInterval(draw, 30);

// Reajusta el canvas si se redimensiona la ventana
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});