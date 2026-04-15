/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the game logic, including the main Game class that manages
the game state, player interactions, win/loss conditions, and screen transitions.
*/


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

        // Tracks stats accumulated during the current run; resets on death
        this.runStats = {
            nivelAlcanzado: 1,
            cartasEspecialesGanadas: [],
            enemigosEliminados: 0
        };
    }

    // checks the special ability of the currently selected card based on its habilidad tag
    poolAbilities(){
        if (this.card_clicked.habilidad == "enemieslos") {
            for (let card of this.cartas) {
                if (card.enemie && card.inboard) {
                    card.number -= 1;
                }
            }
        }
        else if (this.card_clicked.habilidad == "killhealth") {
            if (this.playerHealth.health < 20) {
                if (this.playerHealth.health + Math.floor(this.card_clicked.number / 2) > 20) {
                    this.playerHealth.health = 20;
                }
                else {
                    this.playerHealth.health += this.card_clicked.number / 2;
                }
            }
        }
        else if (this.card_clicked.habilidad == "passEnemie") {
            for (let card of this.cartas) {
                if (card.enemie && card.inboard) {
                    this.discardEnemy(card);
                    break;
                }
            }
        }
        else if (this.card_clicked.habilidad == "healthpassEnemie") {
            for (let card of this.cartas) {
                if (card.enemie && card.inboard) {
                    this.discardEnemy(card);
                    break;
                }
            }
            if (this.playerHealth.health < 20) {
                if (this.playerHealth.health + this.card_clicked.number > 20) {
                    this.playerHealth.health = 20;
                }
                else {
                    this.playerHealth.health += this.card_clicked.number;
                }
            }
        }
    }

    // Persists the player's best run data to localStorage
    saveProgress() {
        const mejorNivelPrevio = parseInt(localStorage.getItem('mejorNivel') || 0);
        const dineroPrevio     = parseInt(localStorage.getItem('totalDinero') || 0);

        localStorage.setItem('mejorNivel', Math.max(this.runStats.nivelAlcanzado, mejorNivelPrevio));
        localStorage.setItem('totalDinero', dineroPrevio + this.playerHealth.money);
    }

    // Marks an enemy card as used, moves it to the discard pile, and decrements the board turn counter
    discardEnemy(card){
        card.used = true;
        this.cartasUsadas.push(card);
        this.giveUsadasPosition();
        card.click(this.xus, this.yus);
        card.inboard = false;
        this.ctab -= 1;
        this.runStats.enemigosEliminados += 1;
    }

    insertCardsIntoArmasArray(){
        this.hayArma = true;
        this.card_clicked.used = true;
        this.cartasArma.push(this.card_clicked);
    }

    moverCartasArma(card_clicked, pos){
        this.xar = this.armas.x + pos;
        this.yar = this.armas.y;
        card_clicked.click(this.xar, this.yar);
        this.clicked = false;
        card_clicked.inboard = false;
        this.ctab -= 1;
    }

    giveUsadasPosition(){
        this.xus = this.usadas.x;
        this.yus = this.usadas.y;
    }

    moveCartasUsadas(){
        this.giveUsadasPosition();
        this.card_clicked.click(this.xus, this.yus);
        this.clicked = false;
        this.card_clicked.inboard = false;
        this.ctab -= 1;
        this.cartasUsadas.push(this.card_clicked);
    }

    cardIntroductionInArmas(){
        if (this.hayArma) {
            this.giveUsadasPosition();
            for (let cartas of this.cartasArma) {
                cartas.click(this.xus, this.yus);
                this.cartasUsadas.push(cartas);
            }
            this.cartasArma = [];
            this.insertCardsIntoArmasArray();
            this.moverCartasArma(this.card_clicked, 0);
            this.poolAbilities();
        }
        else if(!this.hayArma){
            this.insertCardsIntoArmasArray();
            this.moverCartasArma(this.card_clicked, 0);
            this.card_arma = this.card_clicked;
            this.poolAbilities();
        }
    }

    checkingCardTypeUsed(){
        if (this.card_clicked.esVida()) {
            if (!this.curacionUsada) {
               this.card_clicked.actionUse(this.playerHealth);
            }
            this.curacionUsada = true;
            this.moveCartasUsadas();
        }
        else if(this.card_clicked.enemie()){
            this.moveCartasUsadas();
            this.card_clicked.actionUse(this.playerHealth);
            this.runStats.enemigosEliminados += 1;
        }
        else{
            this.moveCartasUsadas();
        }
    }

    cardEnemiaCardWeaponInteraction(){
        if (this.numeroAnterior > this.card_clicked.number || this.cartasArma.length < 2) {
            this.card_clicked.used = true;
            this.cartasArma.push(this.card_clicked);
            for (let cartasrma of this.cartasArma) {
                if (cartasrma.arma()) {
                    this.numberArma = cartasrma.number;
                }
            }
            this.card_clicked.actionWeapon(this.playerHealth, this.numberArma);
            this.moverCartasArma(this.card_clicked, this.posicion);
            this.playerHealth.money += Math.floor(this.card_clicked.number / 2);
            this.numeroAnterior = this.card_clicked.number;
            this.posicion += 20;
        }
        else {
            this.clicked = false;
        }
    }

    cardsClickedIntercations(){
        for (let card of this.cartas) {
            if (card.isHovered && !card.used) {
                this.clicked = true;
                this.card_clicked = card;
                break;
            }
        }

        if (this.armas.isHovered && this.clicked) {
            if (this.card_clicked.arma()) {
                this.cardIntroductionInArmas();
                this.posicion = 20;
            }
            else if (this.hayArma && this.card_clicked.enemie()) {
                this.cardEnemiaCardWeaponInteraction();
            }
        }
        else if (this.usadas.isHovered && this.clicked) {
            this.checkingCardTypeUsed();
        }
    }

    abilityObtention(card){
        this.probabilidadhabilidad = getRandomIntegerInclusive(0,10);
        if (this.probabilidadhabilidad <= 9) {
            this.habilidadProb = getRandomIntegerInclusive(0,10);
            if (card.arma()) {
                if (this.habilidadProb >= 0 && this.habilidadProb <= 4) {
                    card.habilidad = "enemieslos";
                }
                else if (this.habilidadProb >= 5 && this.habilidadProb <= 7) {
                    card.habilidad = "killhealth";
                }
                else if (this.habilidadProb >= 8 && this.habilidadProb <= 9) {
                    card.habilidad = "passEnemie";
                }
                else {
                    card.habilidad = "healthpassEnemie";
                }
            }
        }
    }

    initObjects() {
        for (let i = 1; i < 11; i++) {
            let card = new CardEspada(0, 200, 112.5, 150, i, "diamantes", 1, false, false, true, "", imgRombos);
            this.cartas.push(card);
        }
        for(let i = 1; i < 3; i++){
            for (let i = 1; i < 10; i++) {
                let card = new CardEnemie(0, 200, 112.5, 150, i, "treboles", 1, false, false, true, "", imgPicas);
                this.cartas.push(card);
            }
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardVida(0, 200, 112.5, 150, i, "corazones", 1, false, false, true, "", imgCorazon);
            this.cartas.push(card);
        }
        this.contador = new Tiempo();
        this.armas = new Botones(100, 470, 120, 170, "");
        this.usadas = new Botones(650, 400, 120, 170, "");
        this.pasarRonda = new Botones(600, 100, 240, 50, "Skip round");
        this.playerHealth = new Player(15, 15, 100, 20, 20);
        shuffle(this.cartas);
    }

    createEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                for (let card of this.cartas) {
                    card.used = true;
                }
                console.log("new level victory");
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key == ' ') {
                if (this.gameover) {
                    switch (this.reason) {
                        case 1:
                        case 2:
                            if (pantalla === 'juego') {
                                this.saveProgress();
                                pantalla = 'resumen';
                            } else if (pantalla === 'resumen') {
                                this.runStats = { nivelAlcanzado: 1, cartasEspecialesGanadas: [], enemigosEliminados: 0 };
                                pantalla = 'juego';
                                this.newLevel(false);
                            }
                            break;
                        case 3:
                            this.runStats.nivelAlcanzado += 1;
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
            const scaleX = canvasWidth / rect.width;
            const scaleY = canvasHeight / rect.height;
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;

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
                this.cardsClickedIntercations();
            }
            else if (pantalla === 'dialogo' && !this.dialogueDone) {
                this.dialogueDone = !this.dialogueDone;
                dialogueSound.pause();
                dialogueSound.currentTime = 0;
                pantalla = 'juego';
            }
            else if (pantalla === 'seleccion_carta') {
                for (let card of this.arregloCartas) {
                    if (card.isHovered) {
                        this.cartas.push(card);

                        let cardIndex;
                        if (card === this.cartaSeleccionada1) cardIndex = this.card1;
                        else if (card === this.cartaSeleccionada2) cardIndex = this.card2;
                        else cardIndex = this.card3;

                        for (let sideCard of cardPool[cardIndex].sideEffects()) {
                            this.cartas.push(sideCard);
                        }

                        this.runStats.cartasEspecialesGanadas.push(cardPool[cardIndex].nombre);

                        shuffle(this.cartas);
                        this.newLevel(true);
                        this.dialogueDone = false;
                        this.preDialogueGenerated = false;
                        this.dialogue_pregame = false;
                        pantalla = 'dialogo';
                        break;
                    }
                }
            }
        });
    }

    update(deltaTime) {
        if (this.ctab <= 1) {
            for (let card of this.cartas) {
                if (!card.used && card.inboard) {
                    card.x = 100;
                    this.tablaVacia = true;
                }
            }
            terminado = false;
            this.ctab = 4;
        }
        for (let card of this.cartas) {
            card.update();
        }

        if (pantalla === 'seleccion_carta' && this.arregloCartas) {
            for (let card of this.arregloCartas) {
                card.update();
            }
        }

        this.gameover = this.isGameOver();

        if (!this.gameover && pantalla === 'juego') {
            this.contador.contador(deltaTime);
        }
    }

    isGameOver() {
        return (this.cartas.length > 0 && this.cartas.every(card => card.used)) || this.playerHealth.health <= 0 || this.contador.tiempolim <= 0;
    }

    gameOverReason() {
        if (this.playerHealth.health <= 0) return 1;
        else if (this.contador.tiempolim <= 0) return 2;
        else if (this.cartas.every(card => card.used)) return 3;
    }

    draw(ctx) {
        ctx.shadowBlur = 0;

        if (pantalla === 'start') {
            neonText(65, '#00bfff', "DEAD DRAW", canvasWidth / 2, canvasHeight / 2 - 20);
            neonText(20, '#00bfff', "Presiona espacio para empezar", canvasWidth / 2, canvasHeight / 2 + 30);
        }
        else if (pantalla === 'dialogo') {
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
            if (!this.gameover) {
                this.armas.draw(ctx);
                this.usadas.draw(ctx);
                this.playerHealth.draw(ctx);
                this.pasarRonda.draw(ctx);
                this.contador.draw(ctx);

                this.num = 0;
                let posicion = 100;
                if (this.tablaVacia && !terminado) {
                    this.cantidadCartasTablero += 3;
                    posicion = 262.5;
                    this.curacionUsada = false;
                }

                for (let card of this.cartas) {
                    if (this.num < this.cantidadCartasTablero) {
                        if (!card.used && !card.inboard) {
                            card.x = posicion;
                            posicion += 162.5;
                            card.inboard = true;
                        }
                        card.draw(ctx);
                        this.num += 1;
                    }
                }
                this.tablaVacia = false;
                terminado = true;

                for (let cartas of this.cartasArma) cartas.draw(ctx);
                for (let cartas of this.cartasUsadas) cartas.draw(ctx);
            }
            else {
                this.reason = this.gameOverReason();
                switch (this.reason) {
                    case 1:
                        neonText(65, '#ff0040', "GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
                        neonText(40, '#ff0040', "Te quedaste sin vida", canvasWidth / 2, canvasHeight / 2 + 30);
                        neonText(20, '#ff0040', "Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                        break;
                    case 2:
                        neonText(65, '#ff0040', "GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
                        neonText(40, '#ff0040', "Te quedaste sin tiempo", canvasWidth / 2, canvasHeight / 2 + 30);
                        neonText(20, '#ff0040', "Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                        break;
                    case 3:
                        neonText(65, '#ffd700', "LEVEL PASSED", canvasWidth / 2, canvasHeight / 2 - 20);
                        neonText(35, '#ffd700', "Derrotaste a los enemigos", canvasWidth / 2, canvasHeight / 2 + 30);
                        neonText(20, '#ffd700', "Presiona espacio para continuar", canvasWidth / 2, canvasHeight / 2 + 70);
                        break;
                }
            }
        }
        else if (pantalla === 'seleccion_carta') {
            neonText(30, '#00bfff', "SELECCIONA UNA CARTA", canvasWidth / 2, 40);

            this.arregloCartas = [this.cartaSeleccionada1, this.cartaSeleccionada2, this.cartaSeleccionada3];

            if (!this.seleccionando) {
                this.card1 = getRandomIntegerInclusive(0, cardPool.length - 1);
                this.card2 = getRandomIntegerInclusive(0, cardPool.length - 1);
                this.card3 = getRandomIntegerInclusive(0, cardPool.length - 1);

                this.cartaSeleccionada1 = cardPool[this.card1].makeCard();
                this.cartaSeleccionada2 = cardPool[this.card2].makeCard();
                this.cartaSeleccionada3 = cardPool[this.card3].makeCard();

                this.arregloCartas = [this.cartaSeleccionada1, this.cartaSeleccionada2, this.cartaSeleccionada3];
                this.seleccionando = true;
            }

            ctx.shadowBlur = 0;

            this.cartaSeleccionada1.x = 150; this.cartaSeleccionada1.y = 200; this.cartaSeleccionada1.draw(ctx);
            this.cartaSeleccionada2.x = 325; this.cartaSeleccionada2.y = 200; this.cartaSeleccionada2.draw(ctx);
            this.cartaSeleccionada3.x = 500; this.cartaSeleccionada3.y = 200; this.cartaSeleccionada3.draw(ctx);
        }
        else if (pantalla === 'resumen') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // === SIN GLOW ===
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.textAlign = "center";

            // Título
            ctx.font = "bold 40px Ethnocentric";
            ctx.fillStyle = (this.reason === 3) ? '#ffd700' : '#ff0040';
            ctx.fillText((this.reason === 3) ? "RUN COMPLETADA" : "RUN TERMINADA", canvasWidth / 2, 80);

            // SE PIERDE
            ctx.font = "bold 22px Ethnocentric";
            ctx.fillStyle = '#ff0040';
            ctx.fillText("SE PIERDE:", canvasWidth / 2, 145);

            ctx.font = "16px Ethnocentric";
            ctx.fillStyle = '#ff6666';
            ctx.fillText("Tu mazo de cartas especiales", canvasWidth / 2, 178);
            ctx.fillText("Tu vida actual", canvasWidth / 2, 200);
            ctx.fillText("El multiplicador de dificultad", canvasWidth / 2, 222);

            // SE CONSERVA
            ctx.font = "bold 22px Ethnocentric";
            ctx.fillStyle = '#15ff00';
            ctx.fillText("SE CONSERVA:", canvasWidth / 2, 272);

            ctx.font = "16px Ethnocentric";
            ctx.fillStyle = '#66ff66';
            const mejorNivel  = localStorage.getItem('mejorNivel')  || this.runStats.nivelAlcanzado;
            const totalDinero = localStorage.getItem('totalDinero') || this.playerHealth.money;
            ctx.fillText("Dinero: " + this.playerHealth.money + " monedas", canvasWidth / 2, 305);
            ctx.fillText("Mejor nivel historico: " + mejorNivel, canvasWidth / 2, 327);
            ctx.fillText("Dinero total acumulado: " + totalDinero, canvasWidth / 2, 349);

            // ESTA RUN
            ctx.font = "bold 22px Ethnocentric";
            ctx.fillStyle = '#00bfff';
            ctx.fillText("ESTA RUN:", canvasWidth / 2, 399);

            ctx.font = "16px Ethnocentric";
            ctx.fillStyle = '#aaddff';
            ctx.fillText("Niveles completados: " + (this.runStats.nivelAlcanzado - 1), canvasWidth / 2, 432);
            ctx.fillText("Enemigos eliminados: " + this.runStats.enemigosEliminados, canvasWidth / 2, 454);

            const cartasTexto = this.runStats.cartasEspecialesGanadas.length > 0
                ? this.runStats.cartasEspecialesGanadas.join(', ')
                : 'ninguna';
            ctx.fillText("Cartas especiales: " + cartasTexto, canvasWidth / 2, 476);

            ctx.font = "18px Ethnocentric";
            ctx.fillStyle = '#ffffff';
            ctx.fillText("Presiona espacio para continuar", canvasWidth / 2, 560);
        }
    }

    newLevel(victory) {
        if (victory) {
            this.dificultad = 1.1;
        }
        for (let card of this.cartas) {
            card.used = false;
            card.inboard = false;
            card.enMazo = true;
            card.x = 0;
            card.y = 200;
        }
        this.posicion = 0;
        this.cartasArma = [];
        this.cartasUsadas = [];
        this.hayArma = false;
        this.clicked = false;
        this.ctab = 4;
        this.cantidadCartasTablero = 4;
        this.tablaVacia = false;
        this.gameover = false;

        if (!victory) {
            this.cartas = [];
            for (let i = 1; i < 11; i++) {
                let card = new CardEspada(0, 200, 112.5, 150, i, "diamantes", 1, false, false, true, "", imgRombos);
                this.cartas.push(card);
            }
            for(let i = 1; i < 3; i++){
                for (let i = 1; i < 10; i++) {
                    let card = new CardEnemie(0, 200, 112.5, 150, i, "treboles", 1, false, false, true, "", imgPicas);
                    this.cartas.push(card);
                }
            }
            for (let i = 1; i < 11; i++) {
                let card = new CardVida(0, 200, 112.5, 150, i, "corazones", 1, false, false, true, "", imgCorazon);
                this.cartas.push(card);
            }
        }
        else {
            for (let card of this.cartas) {
                if (card.arma || card.enemie) {
                    card.number = Math.floor(card.number *= this.dificultad);
                }
            }
            for (let card of this.cartas) {
                this.abilityObtention(card);
            }
        }
        this.contador = new Tiempo();
        this.armas = new Botones(100, 470, 120, 170);
        this.usadas = new Botones(650, 400, 120, 170);
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

    const ethnocentric = new FontFace('Ethnocentric', 'url(../assets/fonts/Ethnocentric-Regular.otf)');
    ethnocentric.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
        game = new Game(canvas);
        drawScene(0);
    });
}