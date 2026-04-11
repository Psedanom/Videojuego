// Utility function to draw neon-styled text with a colored glow.
function neonText(size, color, text, x, y, line = 2, blur = 30, align = "center",) {
    // Texto con color neon
    ctx.textAlign = align;
    ctx.font = `${size}px Ethnocentric`;
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.strokeStyle = color;
    ctx.lineWidth = line;
    ctx.fillStyle = '#ffffff';
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;


}
// In-place Fisher-Yates shuffle taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

// Returns a random integer in [min, max] (both endpoints inclusive).
// Taken from https://coreui.io/blog/how-to-generate-a-random-number-in-javascript/#:~:text=Remember,%20while%20JavaScript%27s%20random%20numbers,Yes,%20while%20Math.
const getRandomIntegerInclusive = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
}