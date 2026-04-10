"use strict";






// Canvas dimensions in pixels
const canvasWidth = 800;
const canvasHeight = 700;

let oldTime = 0;


let ctx;

let game;

// Guards the board repopulation logic so it only runs once per empty-board event
let terminado = false;

// Controls which screen is currently rendered and which event handlers are active
let pantalla = 'start';

/*
Possible values for `pantalla`:
- 'start'          : title screen; waits for the player to press Space to continue.
- 'juego'          : main gameplay screen; shows cards, player HUD, and the countdown timer.
- 'seleccion_carta': card-pick screen shown between levels; player chooses one of three offered cards.
- 'dialogo'        : pre-level dialogue screen; displays an NPC line before the round begins.
*/

const imgCorazon = new Image();
imgCorazon.src = '../assets/corazon.png';

const imgRombos = new Image();
imgRombos.src = '../assets/rombos.png';

const imgPicas = new Image();
imgPicas.src = '../assets/picas.png';

const imgDialogue = new Image();
imgDialogue.src = '../assets/dialogue_box.png';

const imgMaton = new Image();
imgMaton.src = '../assets/maton.png';


// Looping audio element played while dialogue text is scrolling onto screen
const dialogueSound = document.createElement("audio");
dialogueSound.src = "../assets/sound/textscroll.wav";

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

//Countdown timer displayed during gameplay
class Tiempo {
    constructor(tiempoSegundos = 100) {
        this.tiempolim = tiempoSegundos * 1000; // Remaining time in milliseconds; converted from seconds
        this.time = 0;
    }
    // Subtracts the elapsed time since the last frame from the remaining limit
    contador(deltatime) {
        this.time = deltatime;
        this.tiempolim -= this.time;
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Tiempo restante " + Math.floor(this.tiempolim / 1000), canvasWidth - 200, 30);
    }
}
//Holds and renders all player stats: health bar, current health, and money
class Player {
    constructor(x, y, width, height, maxHealth, startingMoney = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.money = startingMoney;
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect((this.x), (this.y), this.width, this.height);
        // healthli is the pixel width of the filled portion of the health bar,
        // proportional to (current health / max health)
        let healthli = (this.health / this.maxHealth) * this.width;
        ctx.fillStyle = "red";
        ctx.fillRect((this.x), (this.y + 1), healthli, this.height - 2);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.health, this.width - 35, this.height + 12);
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.money, canvasWidth / 2, this.height + 12);
    }
}
//Clickable rectangular button, used for the weapon slot and the discard pile
class Botones {
    constructor(x, y, width, height,text = "") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }
    draw(ctx) {
        
        ctx.fillStyle = "white";
        ctx.fillRect((this.x), (this.y), this.width, this.height);

        neonText(20, '#fb45f2', this.text, this.x +100 , this.y +33);
        

    }
    // Returns true if the mouse cursor at (mx, my) is inside this button's bounds
    tocando(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
}

class Dialogue {
    constructor(texto, character = imgMaton) {
        this.x = canvasWidth / 2 - 400;
        this.y = canvasHeight - canvasHeight / 4;
        this.texto = texto;
        this.caracteresVisibles = 0; // How many characters are currently visible (grows each frame)
        this.velocidad = 0.2; // Characters revealed per frame (fractional to slow the scroll)
        this.done = false; // True once the full text has been revealed
        this.character = character; // Sprite to draw alongside the dialogue box defaults to the thug (imgMaton)
        this.characterx = canvasWidth - 400;
        this.charactery = canvasHeight - 420;

        // Prevents the scroll sound from being re-triggered every frame while text is scrolling
        this.soundDone = false; // True after the sound has been started for this dialogue instance

    }
    update() {
        // Advance the visible character counter by the scroll speed
        this.caracteresVisibles += this.velocidad;
        // Start the scroll sound on the first frame that text begins appearing,
        // then set soundDone so it isn't triggered again for this dialogue
        if (!this.soundDone && this.caracteresVisibles < this.texto.length) {
            dialogueSound.play();
            this.soundDone = true;


        }
        if (this.caracteresVisibles >= this.texto.length) {
            dialogueSound.pause();
            dialogueSound.currentTime = 0; // Reset playback position so the sound is ready for the next dialogue

        }

    }
    draw(ctx) {
        ctx.drawImage(imgMaton, this.characterx, this.charactery, 400, 300);
        ctx.drawImage(imgDialogue, this.x, this.y, 800, canvasHeight / 4);
        ctx.textAlign = "left";
        ctx.font = "15px Ethnocentric";
        ctx.fillStyle = "white";

        // Slice the full string down to however many characters have been revealed so far
        let textoMostrado = this.texto.substring(0, Math.floor(this.caracteresVisibles));

        // Vertical spacing in pixels between each wrapped line
        let lineheight = 20;
        // Split on '\n' to support manual line breaks in dialogue strings.
        // Technique sourced from https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
        let words = textoMostrado.split('\n');
        for (let i = 0; i < words.length; i++) {
            ctx.fillText(words[i], this.x + 226, this.y + 80 + (i * lineheight));

        }
    }


}

class Cards {
    constructor(x, y, width, height, number, type, scale, used, inboard, enMazo, habilidad,img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.number = number;  // The face value of the card (damage dealt, health restored)
        this.type = type;      // Suit string "diamantes", "treboles", or "corazones"
        this.scale = scale;    // Render scale multiplier, set to 1.2 on hover for a growth effect
        this.used = used;      // True once the card has been played and removed from the board
        this.inboard = inboard; // True while the card is currently visible on the game board
        this.enMazo = enMazo;  // True while the card is still in the deck, waiting to be drawn
        this.habilidad = habilidad; // Special ability string (e.g. "enemieslos", "killhealth"). Empty string means no ability.
        this.img = img;        // The suit image asset drawn on the card face
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.drawImage(this.img, this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.number, this.x + 90, this.y + 30);
        ctx.font = "10px Arial";
        ctx.fillText(this.habilidad,this.x + 50, this.y+100);
        
    }
    contains(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }

    // Repositions the card to (x, y) without changing any other state 
    // used when forcing a card to a specific slot (weapon zone, discard pile)
    defx(x) {
        this.x = x;
    }
    update() {
        if (this.isHovered) {
            this.scale = 1.2;
        } else {
            this.scale = 1;
        }
    }
    click(x, y) {
        this.x = x;
        this.y = y;
        this.used = true;

    }

}

class CardEnemie extends Cards {
    // Applies this enemy card's full damage directly to the player's health (no weapon reduction)
    actionUse(player) {
        player.health -= this.number;    
    }
    // Applies this enemy card's damage reduced by the weapon card's value (num).
    // If the weapon is stronger than the enemy, no damage is taken.
    actionWeapon(player, num) {
        this.daño = this.number - num; // Net damage after weapon mitigation
        if (this.daño < 0) {
            return player.health;
        }
        player.health -= this.daño;
    }
    arma() {
        return false;
    }
    enemie() {
        return true;
    }
    esVida() {
        return false;
    }
}
class CardVida extends Cards {
    // Restores health by this card's number, capping at maxHealth (20).
    // Has no effect if the player is already at full health.
    actionUse(player) {
        if (player.health < 20) {
            if (player.health + this.number > 20) {
                player.health = 20;
            }
            else {
                player.health += this.number;
            }
        }
    }
    arma() {
        return false;
    }
    esVida() {
        return true;
    }
}

class CardEspada extends Cards {
    recallNum() {
        return this.number;
    }
    arma() {
        return true;
    }
    esVida() {
        return false;
    }
    enemie(){
        return false;
    }
}

class Game {
    constructor(canvas) {
        this.cartas = [];  // Master array of all card objects in the current deck

        this.dificultad = 1.1 // Difficulty multiplier applied to card numbers each time the player wins a level (10% increase per level)
        this.createEventListeners();
        this.initObjects();
        this.canvas = canvas;
        this.clicked = false;       // True when a card has been selected but not yet placed in a slot
        this.tablaVacia = false;    // True when all board slots have been used, triggering a board refill
        this.ctab = 4;              // Remaining card plays allowed in the current board turn (counts down from cantidadCartasTablero)
        this.cantidadCartasTablero = 4; // How many cards are placed on the board each turn
        this.cartasArma = [];       // Cards currently in the weapon slot (one weapon card plus any enemies defeated with it)
        this.hayArma = false;       // True while a weapon card is occupying the weapon slot
        this.gameover = false;
        this.curacionUsada = false; // Prevents the player from using more than one heal card per board turn
        this.cartasUsadas = [];     // Cards that have been discarded (played to the discard pile)
        this.seleccionando = false; // True while the card selection screen is showing a new set of cards to pick from
        this.preDialogueGenerated = false; // Guards against regenerating the pre-level dialogue object every frame
        this.dialogueDone = false;  // True after the player dismisses the pre-level dialogue
    }
    // checks the special ability of the currently selected card based on its habilidad tag
    poolAbilities(){
        // "enemieslos" reduce all enemies currently on the board by 1
        if (this.card_clicked.habilidad == "enemieslos") {
                for (let card of this.cartas) {
                    if (card.enemie && card.inboard) {
                        card.number -= 1;
                    }
                }
            }
            // "killhealth" restore half this card's number as health, capped at maxhealth
            else if (this.card_clicked.habilidad == "killhealth") {
                if (this.playerHealth.health < 20) {
                    if (this.playerHealth.health + Math.floor(this.card_clicked.number / 2) > 20) {
                        health = this.player.maxHealth;
                    }
                    else {
                        this.playerHealth.health += this.card_clicked.number / 2;
                    }
                }
            }
            // "passEnemie" discard the first enemy found on the board without dealing damage
            else if (this.card_clicked.habilidad == "passEnemie") {
                for (let card of this.cartas) {
                    if (card.enemie && card.inboard) {
                        this.discardEnemy(card);
                        break;// Only skips one enemy per use
                    }
                }
            }
            //"healthpassEnemie" discard the first board enemy AND restore health equal to this card's full number
            else if (this.card_clicked.habilidad == "healthpassEnemie") {
                for (let card of this.cartas) {
                    if (card.enemie && card.inboard) {
                        this.discardEnemy(card);
                        break;
                    }
                }
                if (this.playerHealth.health < 20) {
                    if (this.playerHealth.health + Math.floor(this.card_clicked.number / 2) > 20) {
                        health = this.playerHealth.maxHealth;
                    }
                    else {
                        this.playerHealth.health += this.card_clicked.number;
                    }
                }
            }
    }
     // Marks an enemy card as used, moves it to the discard pile, and decrements the board turn counter
    discardEnemy(card){
        card.used = true;
        this.cartasUsadas.push(card);
        this.giveUsadasPosition();
        card.click(this.xus, this.yus);
        card.inboard = false;
        this.ctab -= 1;
    }
    // Places the selected card into the weapon slot array and flags the weapon slot as occupied
    insertCardsIntoArmasArray(){
        this.hayArma = true;
        this.card_clicked.used = true;
        this.cartasArma.push(this.card_clicked);
    }
    // moves the selected card to the weapon slot at the given horizontal (pos),
    // then marks it as played and decrements the board turn counter    
    moverCartasArma(card_clicked,pos){
        this.xar = this.armas.x + pos;
        this.yar = this.armas.y;
        card_clicked.click(this.xar, this.yar);
        this.clicked = false;
        card_clicked.inboard = false;
        this.ctab -= 1; 
    }
    // Caches the discard pile's current position for reuse across discard operations
    giveUsadasPosition(){
        this.xus = this.usadas.x;
        this.yus = this.usadas.y;
    }
    // Moves the selected card to the discard pile and decrements the board turn counter
    moveCartasUsadas(){
        this.giveUsadasPosition();
        this.card_clicked.click(this.xus, this.yus);
        this.clicked = false;
        this.card_clicked.inboard = false;
        this.ctab -= 1;
        this.cartasUsadas.push(this.card_clicked);
    }
    initObjects() {

        for (let i = 1; i < 11; i++) {
            let card = new CardEspada(0, 200, 112.5, 150, i, "diamantes", 1, false, false, true, "",imgRombos);
            this.cartas.push(card);
        }
        for(let i = 1; i < 3; i++){
            for (let i = 1; i < 10; i++) {
                let card = new CardEnemie(0, 200, 112.5, 150, i, "treboles", 1, false, false, true, "",imgPicas);
                this.cartas.push(card);
            }
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardVida(0, 200, 112.5, 150, i, "corazones", 1, false, false, true, "",imgCorazon);
            this.cartas.push(card);
        }
        this.contador = new Tiempo();
        this.armas = new Botones(100, 470, 120, 170,"");
        this.usadas = new Botones(650, 400, 120, 170,"");
        this.pasarRonda = new Botones(600,100,240,50,"Skip round");
        this.playerHealth = new Player(15, 15, 100, 20, 20);
        shuffle(this.cartas);

    }
    createEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                //makes all cards used to test new level victory
                for (let card of this.cartas) {
                    card.used = true;
                }
                console.log("new level victory");
            }
        });


        window.addEventListener('keydown', (event) => {

            if (event.key == ' ') {
                // If the round has ended, decide what to do next based on how it ended
                if (this.gameover) {
                    switch (this.reason) {
                        case 1:
                            console.log("Restarting game after losing due to health");
                            
                            pantalla = 'juego';
                            this.newLevel(false);
                            break;
                        case 2:
                            console.log("Restarting game after losing due to time");
                            
                            pantalla = 'juego';
                            this.newLevel(false);
                            break;
                        case 3:
                            console.log("Restarting game after winning by using all cards");
                            this.dialogueDone = false;
                            this.preDialogueGenerated = false;
                            this.dialogue_pregame = false;
                            pantalla = 'seleccion_carta';
                            this.newLevel(true);
                            break;
                    }
                }



                else if (pantalla === 'start') {
                    pantalla = 'dialogo';
                }
            }
        });
        canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (pantalla === 'juego') {
                for (let card of this.cartas) {
                    if (!card.used)
                        card.isHovered = card.contains(mouseX, mouseY);
                }
                this.armas.isHovered = this.armas.tocando(mouseX, mouseY);
                this.usadas.isHovered = this.usadas.tocando(mouseX, mouseY);
            }
            else if (pantalla === 'seleccion_carta') {
                if (this.arregloCartas) {
                    for (let card of this.arregloCartas) {
                        card.isHovered = card.contains(mouseX, mouseY);
                    }
                }
            }
        });
        canvas.addEventListener('click', (event) => {
            if (pantalla === 'juego') {
                for (let card of this.cartas) {
                    if (card.isHovered && !card.used) {
                        this.clicked = true;
                        this.card_clicked = card;
                        break;
                    }
                    else if (this.armas.isHovered && this.clicked) {
                        if (this.card_clicked.arma()) {
                            if (this.hayArma) {
                                this.giveUsadasPosition();
                                for (let cartas of this.cartasArma) { 
                                    cartas.click(this.xus, this.yus);
                                    this.cartasUsadas.push(cartas);
                                }
                                this.cartasArma = [];
                                this.insertCardsIntoArmasArray()
                                this.moverCartasArma(this.card_clicked,0);
                                this.poolAbilities();
                                
                            }

                            else if(!this.hayArma){ 
                                this.insertCardsIntoArmasArray();
                                console.log(this.cartasArma);
                                this.moverCartasArma(this.card_clicked,0)
                                this.card_arma = this.card_clicked;
                                this.poolAbilities();
                            }
                            this.posicion = 20;
                        }
                        // A weapon card is already in the slot and the player is playing an enemy card against it.
                        // The enemy card must have a lower number than the previously played enemy (descending sequence rule),
                        // OR be the first enemy played against this weapon (cartasArma.length < 2).
                        else if (this.hayArma && this.card_clicked.enemie()) {
                            if (this.numeroAnterior > this.card_clicked.number || this.cartasArma.length < 2) {
                                this.card_clicked.used = true;
                                this.cartasArma.push(this.card_clicked);
                                // Find the weapon card inside cartasArma to read its damage value
                                for (let cartasrma of this.cartasArma) { //CHECAR
                                    if (cartasrma.arma()) {
                                        this.numberArma = cartasrma.number; // Weapon's attack value used to reduce incoming enemy damage
                                    }
                                }
                                this.card_clicked.actionWeapon(this.playerHealth, this.numberArma);
                                // xar / yar: target coordinates where the card snaps to inside the weapon slot zone.
                                // posicion offsets each successive card slightly to the right so they don't stack perfectly.
                                this.moverCartasArma(this.card_clicked,this.posicion);
                                this.playerHealth.money += Math.floor(this.card_clicked.number / 2);
                                // Store this enemy's number so the next enemy played must be strictly lower
                                this.numeroAnterior = this.card_clicked.number;
                                this.posicion += 20; // Shift the next card slightly right within the weapon slot
                            }
                            else {
                                this.clicked = false;
                            }
                        }
                        break;
                    }
                    else if (this.usadas.isHovered && this.clicked) {
                        if (this.card_clicked.esVida()) {
                            // Only one heal card may be played per board turn; curacionUsada blocks further heals
                            if (!this.curacionUsada) {
                               this.card_clicked.actionUse(this.playerHealth);
                            }
                            this.curacionUsada = true;
                            // xus / yus: target coordinates where the card snaps to inside the discard pile zone
                            this.moveCartasUsadas();
                            break;
                        }
                        else if(this.card_clicked.enemie()){
                            // Non-heal card played directly to discard: apply its effect and send it to the pile
                            this.moveCartasUsadas();
                            this.card_clicked.actionUse(this.playerHealth);
                            break;
                        }
                        else{
                            this.moveCartasUsadas();
                            break;
                        }
                    }

                }
            }
            else if (pantalla === 'dialogo' && !this.dialogueDone) {
                this.dialogueDone = !this.dialogueDone;     // Any click skips the rest of the dialogue and jumps straight to gameplay
                dialogueSound.pause(); // Stop the scroll sound if the player clicks before the text finishes
                dialogueSound.currentTime = 0; // Reset playback position so the sound is ready for the next dialogue
                pantalla = 'juego';
            }

            // Card-selection screen detect which offered card the player clicked and add it to the deck
            else if (pantalla === 'seleccion_carta') {
                for (let card of this.arregloCartas) {
                    if (card.isHovered) {
                        console.log("[Selection] Deck size before adding card:", this.cartas.length);
                        this.cartas.push(card); // Add the chosen card to the player's deck
                        console.log("[Selection] Deck size after adding chosen card:", this.cartas.length);

                        // Determine which cardPool entry corresponds to the selected card
                        // so we can retrieve its side effects
                        let cardIndex;
                        if (card === this.cartaSeleccionada1) cardIndex = this.card1;
                        else if (card === this.cartaSeleccionada2) cardIndex = this.card2;
                        else cardIndex = this.card3;

                        // Each card in the pool may come with penalty cards (side effects) added to the deck
                        for (let sideCard of cardPool[cardIndex].sideEffects()) {
                            this.cartas.push(sideCard);
                        }
                        console.log("[Selection] Deck size after side effects:", this.cartas.length);

                        shuffle(this.cartas); // Shuffle the deck after adding the new cards
                        console.log("[Selection] Deck size before newLevel(true):", this.cartas.length);
                        this.newLevel(true); // Start next level with the updated deck
                        console.log("[Selection] Deck size after newLevel(true):", this.cartas.length);
                        this.dialogueDone = false; // Reset so the next pre-level dialogue is shown
                        this.preDialogueGenerated = false;
                        this.dialogue_pregame = false;
                        pantalla = 'dialogo'; // Go to the dialogue screen before gameplay begins
                        break;

                    }
                }
            }
        });

    }
    update(deltaTime) {


        // When ctab reaches 1 or below, the player has used all allowed plays for this board turn.
        // Any card still on the board that is unused but marked inboard gets pushed back to position 100
        // and tablaVacia is set so the draw() method will refill the board next frame.
        if (this.ctab <= 1) {
            for (let card of this.cartas) {
                if (!card.used && card.inboard) {
                    card.x = 100;
                    this.tablaVacia = true;
                }
            }
            terminado = false; // Allow the board-refill branch in draw() to run once
            this.ctab = 4;     // Reset the plays-per-turn counter
        }
        for (let card of this.cartas) {
            card.update();
        }

        // Card-selection screen also needs per-frame updates so hover detection works on the offered cards
        if (pantalla === 'seleccion_carta' && this.arregloCartas) {
            for (let card of this.arregloCartas) {
                card.update();
            }
        }

        // Check win/loss condition every frame
        this.gameover = this.isGameOver();

        // Only tick the countdown while the player is actively in a round (not in menus or dialogue)
        if (!this.gameover && pantalla === 'juego') {
            this.contador.contador(deltaTime);
        }


    }
    // The round ends when: every card in the deck has been played (victory),
    // the player's health drops to 0 or below (loss), or the timer runs out (loss)
    isGameOver() {
        return (this.cartas.length > 0 && this.cartas.every(card => card.used)) || this.playerHealth.health <= 0 || this.contador.tiempolim <= 0;
    }
    gameOverReason() {
        if (this.playerHealth.health <= 0) {
            return 1; // Player ran out of health
        }
        else if (this.contador.tiempolim <= 0) {
            return 2; // Player ran out of time
        }
        else if (this.cartas.every(card => card.used)) {
            return 3; // Player won by using all cards
        }
    }

    draw(ctx) {
        ctx.shadowBlur = 0; // Reset glow to zero to prevent it from leaking into subsequent draw calls
        if (pantalla === 'start') {
            
            // Neon blue glow
            neonText(65, '#00bfff', "DEAD DRAW", canvasWidth / 2, canvasHeight / 2 - 20);
           

            neonText(20, '#00bfff', "Presiona espacio para empezar", canvasWidth / 2, canvasHeight / 2 + 30);
            
        }
        else if (pantalla === 'dialogo') {
            //Antes de jugar el nivel
            if (!this.preDialogueGenerated) {
                this.dialogue_pregame = new Dialogue(preGameDialogue[Math.floor(Math.random() * preGameDialogue.length)]);
                this.preDialogueGenerated = true;
            }
            if (!this.dialogueDone) {
                this.dialogue_pregame.update();
                this.dialogue_pregame.draw(ctx);
            }
        }
        else if (pantalla === 'juego') {

            //ROUND IN PROGRESS
            if (!this.gameover) {
                this.armas.draw(ctx);
                this.usadas.draw(ctx);
                this.playerHealth.draw(ctx);
                this.pasarRonda.draw(ctx);
                this.contador.draw(ctx);

                this.num = 0;
                let posicion = 100; // X coordinate where the first card of this batch is placed
                // tablaVacia is true at the start of a new board turn; expand the visible card count by 3
                // and shift the starting position right so the layout stays balanced
                if (this.tablaVacia && !terminado) {
                    this.cantidadCartasTablero += 3
                    posicion = 262.5
                    this.curacionUsada = false; // Allow healing again at the start of each new board turn
                }

                // Place cards onto the board up to the current cantidadCartasTablero limit.
                // Cards that are already used or already placed (inboard) are skipped.
                for (let card of this.cartas) {
                    if (this.num < this.cantidadCartasTablero) {
                        if (!card.used && !card.inboard) {
                            card.x = posicion;
                            posicion += 162.5; // Horizontal gap between adjacent cards
                            card.inboard = true;
                        }
                        card.draw(ctx);
                        this.num += 1;
                    }
                }
                this.tablaVacia = false;
                terminado = true; // Prevent the board-refill branch from running again until ctab resets
                for (let cartas of this.cartasArma) {
                    cartas.draw(ctx);
                }
                for (let cartas of this.cartasUsadas) {
                    cartas.draw(ctx);
                }
            }
            else {
                console.log("Round ended");
                this.reason = this.gameOverReason();
                switch (this.reason) {
                    case 1:
                        console.log("Round ended with code: " + this.reason);
                        console.log("You lost by running out of health.");

                        neonText(65, '#ff0040', "GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
                        
                        neonText(40, '#ff0040', "Te quedaste sin vida", canvasWidth / 2, canvasHeight / 2 + 30);
                        
                        neonText(20, '#ff0040', "Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                        
                        

                        break;
                    case 2:
                        console.log("Round ended with code: " + this.reason);
                        console.log("You lost by running out of time.");

                        neonText(65, '#ff0040', "GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
                        
                        neonText(40, '#ff0040', "Te quedaste sin tiempo", canvasWidth / 2, canvasHeight / 2 + 30);
                        
                        neonText(20, '#ff0040', "Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                        

                        break;
                    case 3:
                        console.log("Round ended with code: " + this.reason);
                        console.log("You won by using all cards.");
                        neonText(65, '#ffd700', "LEVEL PASSED", canvasWidth / 2, canvasHeight / 2 - 20);
                        
                        neonText(35, '#ffd700', "Derrotaste a los enemigos", canvasWidth / 2, canvasHeight / 2 + 30);
                        
                        neonText(20, '#ffd700', "Presiona espacio para continuar", canvasWidth / 2, canvasHeight / 2 + 70);
                        
                        break;
                }
            }

        }
        else if (pantalla === 'seleccion_carta') {



            // Neon text style for the screen title
            neonText(30, '#00bfff', "SELECCIONA UNA CARTA", canvasWidth / 2, 40);
        
            this.arregloCartas = [this.cartaSeleccionada1, this.cartaSeleccionada2, this.cartaSeleccionada3];

            // Only pick new random cards once per visit to this screen.
            // seleccionando is flipped to true immediately so this block doesn't re-run every frame.
            if (!this.seleccionando) {

                // Pick three random indices into cardPool (with replacement -- duplicates are possible)
                this.card1 = getRandomIntegerInclusive(0, cardPool.length - 1);
                this.card2 = getRandomIntegerInclusive(0, cardPool.length - 1);
                this.card3 = getRandomIntegerInclusive(0, cardPool.length - 1);

                // Instantiate the actual card objects from the pool templates
                this.cartaSeleccionada1 = cardPool[this.card1].makeCard();
                this.cartaSeleccionada2 = cardPool[this.card2].makeCard();
                this.cartaSeleccionada3 = cardPool[this.card3].makeCard();

                // Array holding the three offered cards, used for hover/click detection
                this.arregloCartas = [this.cartaSeleccionada1, this.cartaSeleccionada2, this.cartaSeleccionada3];
                this.seleccionando = true;
            }
            // Turn off glow before drawing card sprites to avoid unintended bleed
            ctx.shadowBlur = 0;

            // Position and draw the three offered cards at fixed horizontal slots
            this.cartaSeleccionada1.x = 150;
            this.cartaSeleccionada1.y = 200;
            this.cartaSeleccionada1.draw(ctx);

            this.cartaSeleccionada2.x = 325;
            this.cartaSeleccionada2.y = 200;
            this.cartaSeleccionada2.draw(ctx);

            this.cartaSeleccionada3.x = 500;
            this.cartaSeleccionada3.y = 200;
            this.cartaSeleccionada3.draw(ctx);


            //Neon style for card info labels
            
            ctx.textAlign = "left";
            ctx.font = "10px Ethnocentric";

            ctx.shadowBlur = 3;

            ctx.lineWidth = 1;
            ctx.fillStyle = '#ffffff';

            // Blue for the card name
            ctx.shadowColor = '#00bfff';
            ctx.strokeStyle = '#00bfff';
            // Names
            ctx.strokeText(cardPool[this.card1].nombre, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 200);
            ctx.fillText(cardPool[this.card1].nombre, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 200);

            ctx.strokeText(cardPool[this.card2].nombre, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 200);
            ctx.fillText(cardPool[this.card2].nombre, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 200);

            ctx.strokeText(cardPool[this.card3].nombre, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 200);
            ctx.fillText(cardPool[this.card3].nombre, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 200);

            // Green for the card advantage
            ctx.shadowColor = '#15ff00';
            ctx.strokeStyle = '#15ff00';
            // Card advantage
            ctx.strokeText(cardPool[this.card1].ventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 220);
            ctx.fillText(cardPool[this.card1].ventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 220);
            ctx.strokeText(cardPool[this.card2].ventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 220);
            ctx.fillText(cardPool[this.card2].ventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 220);
            ctx.strokeText(cardPool[this.card3].ventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 220);
            ctx.fillText(cardPool[this.card3].ventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 220);

            // Red for the card disadvantage (side effect warning)
            ctx.shadowColor = '#ff0040';
            ctx.strokeStyle = '#ff0040';
            // Card disadvantage
            ctx.strokeText(cardPool[this.card1].desventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 240);
            ctx.fillText(cardPool[this.card1].desventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 240);
            ctx.strokeText(cardPool[this.card2].desventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 240);
            ctx.fillText(cardPool[this.card2].desventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 240);
            ctx.strokeText(cardPool[this.card3].desventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 240);
            ctx.fillText(cardPool[this.card3].desventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 240);
        }

    }

    // Resets the board for a new round. If the player won, scales up card numbers and assigns
    // random special abilities to weapon cards. If the player lost, the deck is rebuilt from scratch
    // at base values with no difficulty increase.
    // `victory` (boolean): true if the player cleared the level, false if they lost.
    newLevel(victory) {
        if (victory) {
            this.dificultad = 1.1; // Compound difficulty increase of 10% per won level
        }
        // Reset all cards to their unplayed state so they can re-enter the deck
        for (let card of this.cartas) {
            card.used = false;
            card.inboard = false;
            card.enMazo = true;
            card.x = 0;
            card.y = 200;
        }
        this.posicion = 0;       // Reset the weapon-slot stacking offset
        this.cartasArma = [];
        this.cartasUsadas = [];
        this.hayArma = false;
        this.clicked = false;
        this.ctab = 4;
        this.cantidadCartasTablero = 4;
        this.tablaVacia = false;
        this.gameover = false;

        if (!victory) { // On a loss, discard the current deck and rebuild it at base values (no scaling)
            this.cartas = [];
            for (let i = 1; i < 11; i++) {
                let card = new CardEspada(0, 200, 112.5, 150, i, "diamantes", 1, false, false, true, "",imgRombos);
                this.cartas.push(card);
            }
            for(let i = 1; i < 3; i++){
                for (let i = 1; i < 10; i++) {
                    let card = new CardEnemie(0, 200, 112.5, 150, i, "treboles", 1, false, false, true, "",imgPicas);
                    this.cartas.push(card);
                }
            }
            for (let i = 1; i < 11; i++) {
                let card = new CardVida(0, 200, 112.5, 150, i, "corazones", 1, false, false, true, "",imgCorazon);
                this.cartas.push(card);
            }
        }
        else {
            // Scale weapon and enemy card values by the current difficulty multiplier
            for (let card of this.cartas) {
                if (card.arma || card.enemie) {
                    card.number = Math.floor(card.number *= this.dificultad);
                }
            }
            // Randomly assign a special ability to each weapon card.
            // probabilidadhabilidad is a 0-10 roll that acts as an ability-trigger gate
            // habilidadProb is a second 0-10 roll that selects which specific ability is assigned.
            for (let card of this.cartas) {
                this.probabilidadhabilidad = getRandomIntegerInclusive(0,1);
                if (this.probabilidadhabilidad >= 9) { // to debug weapons abilities flip >= into a <=
                    this.habilidadProb = getRandomIntegerInclusive(0,1);
                    if (card.arma()) {
                        // habilidadProb 0-4  (50%): reduce all board enemies by 1
                        if (this.habilidadProb >= 0 && this.habilidadProb <= 4) {
                            card.habilidad = "enemieslos";
                        }
                        // habilidadProb 5-7  (30%): heal the player for half the weapon's value
                        else if (this.habilidadProb >= 5 && this.habilidadProb <= 7) {
                            card.habilidad = "killhealth";
                        }
                        // habilidadProb 8-9  (20%): automatically discard one enemy from the board
                        else if (this.habilidadProb >= 8 && this.habilidadProb <= 9) {
                            card.habilidad = "passEnemie";
                        }
                        // habilidadProb > 9  (unreachable with current 0-10 range; dead branch)
                        else {
                            card.habilidad = "healthpassEnemie";
                        }
                    }
                }
            }
        }
        this.contador = new Tiempo();
        this.armas = new Botones(100, 470, 120, 170);
        this.usadas = new Botones(650, 400, 120, 170);
        // Preserve the player's money across levels; everything else resets to defaults
        this.playerHealth = new Player(15, 15, 100, 20, 20, this.playerHealth.money);

        shuffle(this.cartas);
    }
}


function drawScene(newTime) {
    let deltaTime = newTime - oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.draw(ctx);
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

function main() {

    const canvas = document.getElementById('canvas');
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx = canvas.getContext('2d');

    // Load the custom font before starting the loop so the first frame renders correctly.    const ethnocentric = new FontFace('Ethnocentric', 'url(../assets/fonts/Ethnocentric-Regular.otf)');
     const ethnocentric = new FontFace('Ethnocentric', 'url(../assets/fonts/Ethnocentric-Regular.otf)');
    ethnocentric.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
        // Create the game object
        game = new Game(canvas);
        drawScene(0);
    });
    // Create the game object
    game = new Game(canvas);

    drawScene(0);
}

function neonText(size, color, text, x, y,line=2,blur=30, align="center",) {
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