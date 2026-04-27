/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the game logic, including the main Game class that manages
the game state, player interactions, win/loss conditions, and screen transitions.
*/


"use strict";



let font = "regular";

// "regular" for ethnocentric font
// "OpenDyslexic" for the OpenDyslexic font

// Canvas dimensions in pixels
const canvasWidth = 1200;
const canvasHeight = 700;

//Card dimensions in pixels
const cardWidth = 160;
const cardHeight = 190;

let oldTime = 0;
let ctx;
let user = JSON.parse(localStorage.getItem("player")); // convert the string data into an object
let baseHealth = user.baseHealth;
let game;
// Guards the board repopulation logic so it only runs once per empty-board event
let terminado = false;
// Controls which screen is currently rendered and which event handlers are active
let pantalla = 'start';

let playedMusic = false; // Flag to ensure the background music starts only once
/*
Possible values for `pantalla`:
- 'start'          : title screen; waits for the player to press Space to continue.
- 'juego'          : main gameplay screen; shows cards, player HUD, and the countdown timer.
- 'seleccion_carta': card-pick screen shown between levels; player chooses one of three offered cards.
- 'dialogo'        : pre-level dialogue screen; displays an NPC line before the round begins.
- 'gameLore'       : initial dialogues at start of each run.
*/

let lore = 0;
let loreDialogueGenerated = false;


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
        this.nivel = 0;
        this.boss = false;
        this.enemigosEliminados = 0;  // counts every enemy defeated with a weapon during this run
        this.danoRecibido = 0;        // tracks total damage taken from enemies this run
        this.dialogoArmaVisto = false;    // True after the weapon card dialogue has been shown once
        this.dialogoEnemieVisto = false;  // True after the enemy card dialogue has been shown once
        this.dialogoVidaVisto = false;    // True after the health card dialogue has been shown once
        this.skipebutton = true;
        this.mouseX=0;
        this.mouseY=0;
    }
    // checks the special ability of the currently selected card based on its habilidad tag
    poolAbilities(){
        // "enemieslos" reduce all enemies currently on the board by 1
        if (this.card_clicked.habilidad == "enemieslos") {
                for (let card of this.cartas) {
                    if (card.enemie() && card.inboard) {
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
                    if (card.enemie && card.inboard && this.ctab > 1) {
                        this.discardEnemy(card);
                        break;// Only skips one enemy per use
                    }
                }
            }
            //"healthpassEnemie" discard the first board enemy AND restore health equal to this card's full number
            else if (this.card_clicked.habilidad == "healthpassEnemie") {
                for (let card of this.cartas) {
                    if (card.enemie && card.inboard && this.ctab > 1) {
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
        this.xar = this.armas.xantes + pos;
        this.yar = this.armas.yantes;
        card_clicked.click(this.xar, this.yar);
        this.clicked = false;
        card_clicked.inboard = false;
        this.ctab -= 1; 
    }
    // Caches the discard pile's current position for reuse across discard operations
    giveUsadasPosition(){
        this.xus = this.usadas.xantes ;
        this.yus = this.usadas.yantes ; 
    }
    // Moves the selected card to the discard pile and decrements the board turn counter
    moveCartasUsadas(){
        this.giveUsadasPosition();  
        this.card_clicked.click(this.xus, this.yus);
        this.cartasUsadas.push(this.card_clicked);
        this.clicked = false;
        this.card_clicked.inboard = false;
        this.ctab -= 1;
    }
    //cheks wether there is an armas inside the array, then depending moves the card or cards to the corresponding position
    cardIntroductionInArmas(){
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
    }
    //Checks what type of card is beeing used
    checkingCardTypeUsed(){
        if (this.card_clicked.esVida()) {
            // Only one heal card may be played per board turn; curacionUsada blocks further heals
            if (!this.curacionUsada) {
               this.card_clicked.actionUse(this.playerHealth);
            }
            this.curacionUsada = true;
            // xus / yus: target coordinates where the card snaps to inside the discard pile zone
            this.moveCartasUsadas();
        }
        else if(this.card_clicked.enemie()){
            this.moveCartasUsadas();
            let vidaAntes = this.playerHealth.health;
            this.card_clicked.actionUse(this.playerHealth);
            this.danoRecibido += Math.max(0, vidaAntes - this.playerHealth.health);

            switch(this.card_clicked.habilidad) {
                case "cursedEnemy":
                    this.playerHealth.health -= 1;
                    this.danoRecibido += 1;
                    break;
                case "timeEater":
                    this.contador.tiempolim -= 15000;
                    break;
            }
        }
        else{
            this.moveCartasUsadas();
        }
    }
    //checks wether the player can play a card enemie in the weapon place or not
    //also if the player can play the enemie card this function is in charge of making the interaction correct like reducind the players health
    cardEnemiaCardWeaponInteraction(){
        if (this.numeroAnterior > this.card_clicked.number || this.cartasArma.length < 2) {

            //Sql data base API proof of concept.
            // $.post("http://127.0.0.1:3000/post").done(function (data) {

            //     alert("Data Loaded: " + data);

            // });
            this.card_clicked.used = true;
            this.card_clicked.scale = 1;
            this.cartasArma.push(this.card_clicked);
            // Find the weapon card inside cartasArma to read its damage value
            for (let cartasrma of this.cartasArma) { //CHECAR
                if (cartasrma.arma()) {
                    this.numberArma = cartasrma.number; // Weapon's attack value used to reduce incoming enemy damage
                }
            }
            let vidaAntes = this.playerHealth.health; // save health before the attack to measure actual damage taken
            this.card_clicked.actionWeapon(this.playerHealth, this.numberArma);
            this.enemigosEliminados += 1; // counts each enemy defeated with a weapon this run
            this.danoRecibido += Math.max(0, vidaAntes - this.playerHealth.health); // actual health lost this interaction
            switch(this.card_clicked.habilidad){
                case "absoluteDamage":
                    this.playerHealth.money = Math.floor(this.playerHealth.money / 2);
                    break;
                case "cursedEnemy":
                    this.playerHealth.money -= Math.floor(this.card_clicked.number / 2);
                    if (this.playerHealth.money < 0) this.playerHealth.money = 0;
                    break;
                case "goldStealer":
                    this.playerHealth.money += Math.floor(this.card_clicked.number / 2);
                    break;
            }
            // xar / yar: target coordinates where the card snaps to inside the weapon slot zone.
            // posicion offsets each successive card slightly to the right so they don't stack perfectly.
            this.moverCartasArma(this.card_clicked,this.posicion);
            //user.money += Math.floor(this.card_clicked.number / 2);
            this.playerHealth.money += Math.floor(this.card_clicked.number / 2);
            // Store this enemy's number so the next enemy played must be strictly lower
            this.numeroAnterior = this.card_clicked.number;
            this.posicion += 20; // Shift the next card slightly right within the weapon slot
        }
        else {
            this.clicked = false;
            this.card_clicked.inboard = true; // Return the card to the board if it's not a weapon or valid enemy play
            this.card_clicked.isHovered = false; // Ensure the card is no longer considered hovered after being released
            this.card_clicked.used = false; // Reset the card's used status so it can be interacted with again
            this.card_clicked.xantes2 = this.card_clicked.x;
            this.card_clicked.yantes2 = this.card_clicked.y;
            this.card_clicked.x = this.card_clicked.xantes;
            this.card_clicked.y = this.card_clicked.yantes;
            this.card_clicked.update();
        }
    }
    //For every card in the deck checks if this card is being clicked and returns whatever the card has to do
    cardsClickedIntercations(){
        for (let card of this.cartas) {
            if (card.isHovered && !card.used) {
                cardSelected.currentTime = 0; // Reset the sound to allow it to play again immediately if the player clicks multiple cards in quick succession
                cardSelected.play();
                this.clicked = true;
                this.card_clicked = card;
                this.card_clicked.used = true; // Mark the card as used immediately to prevent multiple interactions while dragging
                this.card_clicked.update(); // Update the card's position to reflect the click before any potential move
                // Only show card dialogue during level 0 and only once per card interaction.
                // cartaDialogueDone is flipped to true after the player dismisses the dialogue,
                // preventing it from triggering again for the rest of the run.
                if (this.nivel === 0) {
                    let frases;
                    let sprite;
                    let yaVisto;
                    if (card.arma()) { frases = cartaDialogueArma; sprite = imgRombos; yaVisto = this.dialogoArmaVisto; }
                    else if (card.esVida()) { frases = cartaDialogueVida; sprite = imgCorazon; yaVisto = this.dialogoVidaVisto; }
                    else { frases = cartaDialogueEnemie; sprite = imgPicas; yaVisto = this.dialogoEnemieVisto; }

                    if (!yaVisto) {
                        if (card.arma()) this.dialogoArmaVisto = true;
                        else if (card.esVida()) this.dialogoVidaVisto = true;
                        else this.dialogoEnemieVisto = true;

                        // Pass the card's sprite so the Dialogue box shows the correct image
                        this.dialogue_carta = new Dialogue(frases[Math.floor(Math.random() * frases.length)], sprite);
                        pantalla = 'dialogo_carta';
                        break;
                    }
                }
                break;  
            }           
        }
    }

    abilityObtention(card){
        this.probabilidadhabilidad = getRandomIntegerInclusive(0,10);
        if (this.probabilidadhabilidad >= 9) {
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
            else if (card.enemie()) {
                this.habilidadEnemieProb = getRandomIntegerInclusive(0,10);
                if (this.habilidadEnemieProb >= 9) {
                    this.habilidadEnemieProb = getRandomIntegerInclusive(0,10);
                    if (this.habilidadProb >= 0 && this.habilidadProb <= 3) {
                        card.habilidad = "absoluteDamage";
                    }
                    else if (this.habilidadProb >= 4 && this.habilidadProb <= 6) {
                        card.habilidad = "cursedEnemy";
                    }
                    else if (this.habilidadProb >= 7 && this.habilidadProb <= 8) {
                        card.habilidad = "timeEater";
                    }
                    else {
                        card.habilidad = "goldStealer";
                    }
                }
            }
        }
    }
    initObjects() {
        pantalla = 'start';
        for (let i = 1; i < 11; i++) {
            let card = new CardEspada(2000, 200, cardWidth, cardHeight, i, "diamantes", 1, false, false, true, "",imgRombos);
            this.cartas.push(card);
        }

        for (let i = 1; i < 10; i++) {
            let card = new CardEnemie(2000, 200, cardWidth, cardHeight, i, "treboles", 1, false, false, true, "",imgTreboles);
            this.cartas.push(card);
        }
        
        for (let i = 1; i < 10; i++) {
            let card = new CardEnemie(2000, 200, cardWidth, cardHeight, i, "picas", 1, false, false, true, "",imgPicas);
        }

    
        for (let i = 1; i < 11; i++) {
            let card = new CardVida(2000, 200, cardWidth, cardHeight, i, "corazones", 1, false, false, true, "",imgCorazon);
            this.cartas.push(card);
        }
        this.lootbox1 = new lootbox((canvasWidth - canvasWidth * 0.125) -75, canvasHeight - canvasHeight * 0.6, 150, 150,50);
        this.lootbox2 = new lootbox((canvasWidth - canvasWidth * 0.375) -75, canvasHeight - canvasHeight * 0.6, 150, 150,100);
        this.lootbox3 = new lootbox((canvasWidth - canvasWidth * 0.625) -75, canvasHeight - canvasHeight * 0.6, 150, 150,200);
        this.lootbox4 = new lootbox((canvasWidth - canvasWidth * 0.875) -75, canvasHeight - canvasHeight * 0.6, 150, 150,500);
        this.bossBar = new bossBar(canvasWidth -canvasWidth * 0.95, canvasHeight/2 - 200, 30, 400,20,20);
        this.contador = new Tiempo();
        this.armas = new Botones(canvasWidth * 0.125, canvasHeight * 0.671, cardWidth, cardHeight, " ",undefined, undefined,"cardPlace");
        this.usadas = new Botones(canvasWidth * 0.813, canvasHeight * 0.671, cardWidth, cardHeight, " ",undefined, undefined,"cardPlace");
        this.pasarRonda = new Botones(canvasWidth * 0.75, canvasHeight * 0.143, canvasWidth * 0.2, canvasHeight * 0.071, "Skip Round",undefined, undefined,"skipButton");
        this.play = new Botones(canvasWidth/2 - 100,0 + canvasHeight*0.1,200,100,"Play");
        this.logout = new Botones(canvasWidth/2 - 100, 0 + canvasHeight*0.3, 200, 100,"Logout");
        this.settings = new Botones(canvasWidth/2 - 100, 0 + canvasHeight*0.5, 200, 100,"Settings");
        this.statistics = new Botones(canvasWidth/2 - 100, 0 + canvasHeight*0.7, 200, 100,"Statistics");
        this.playerHealth = new Player(15, 15, canvasWidth * 0.125, 20, user.baseHealth,user.money);
        this.selectionlootboxes = new Botones(canvasWidth - canvasWidth* 0.9, canvasHeight - canvasHeight * 0.5, 300, 50, "Buy a lootbox");
        this.sleccioncard = new Botones(canvasWidth - canvasWidth* 0.3, canvasHeight - canvasHeight * 0.5, 300, 50, "Select a card");
        this.skipInitialDialogue = new Botones(canvasWidth * 0.1 - 70, canvasHeight * 0.84, 200, 50, "Skip", 0.7, "#62ecff");
        /*for (let card of this.cartas) {
        if (card instanceof CardEnemie) {
                this.habilidadProb = getRandomIntegerInclusive(0,10);
                this.habilidadEnemieProb = getRandomIntegerInclusive(0,10);
                if (this.habilidadEnemieProb >= 0) {
                    if (this.habilidadProb >= 0 && this.habilidadProb <= 3) {
                        card.habilidad = "absoluteDamage";
                    }
                    else if (this.habilidadProb >= 4 && this.habilidadProb <= 6) {
                        card.habilidad = "cursedEnemy";
                    }
                    else if (this.habilidadProb >= 7 && this.habilidadProb <= 8) {
                        card.habilidad = "timeEater";
                    }
                    else {
                        card.habilidad = "goldStealer";
                    }
                }
            }
        }*/ //only for debug, the abilityObtention is assigned at the start of the level (only enemies cards).
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
                    // First press after game over goes to the summary screen
                    if (pantalla !== 'resumen') {
                        pantalla = 'resumen';
                    }
                    // Second press on the summary screen proceeds to restart or card selection
                    else {
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
                                pantalla = 'seleccion_de_pantalla';
                                this.newLevel(true);
                                break;
                        }
                    }
                }
                else if (pantalla === 'start') {
                    pantalla = 'menu';
                }
            }
        });
        canvas.addEventListener('mouseup', (event) => {
            if (this.clicked && this.card_clicked) {
                if (this.armas.isHovered && this.clicked) {
                    this.armas.click();
                    if (this.card_clicked.arma()) {
                        this.cardIntroductionInArmas();
                        this.posicion = 20;
                    }
                    // A weapon card is already in the slot and the player is playing an enemy card against it.
                    // The enemy card must have a lower number than the previously played enemy (descending sequence rule),
                    // OR be the first enemy played against this weapon (cartasArma.length < 2).
                    else if (this.hayArma && this.card_clicked.enemie()) {
                        this.cardEnemiaCardWeaponInteraction();
                    }
                    else{
                        this.clicked = false;
                        this.card_clicked.inboard = true; // Return the card to the board if it's not a weapon or valid enemy play
                        this.card_clicked.isHovered = false; // Ensure the card is no longer considered hovered after being released
                        this.card_clicked.used = false; // Reset the card's used status so it can be interacted with again
                        this.card_clicked.xantes2 = this.card_clicked.x;
                        this.card_clicked.yantes2 = this.card_clicked.y;
                        this.card_clicked.x = this.card_clicked.xantes;
                        this.card_clicked.y = this.card_clicked.yantes;
                        this.card_clicked.update();
                    }
                     //break;
            }
            else if (this.usadas.isHovered && this.clicked) {
                this.usadas.click();
                this.checkingCardTypeUsed();
            }
            else{
                this.clicked = false;
                this.card_clicked.isHovered = false; // Ensure the card is no longer considered hovered after being released
                this.card_clicked.used = false; // Reset the card's used status so it can be interacted with again
                this.card_clicked.xantes2 = this.card_clicked.x;
                this.card_clicked.yantes2 = this.card_clicked.y;
                this.card_clicked.x = this.card_clicked.xantes;
                this.card_clicked.y = this.card_clicked.yantes;
                this.card_clicked.update();
            }
        }

        });
        canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = event.clientX - rect.left;
            this.mouseY = event.clientY - rect.top;
            if (pantalla === 'juego'){
                for (let card of this.cartas) {
                    if (!card.used)
                        card.isHovered = card.contains(this.mouseX, this.mouseY);
                }
                if(this.clicked && this.card_clicked){
                    this.card_clicked.x = this.mouseX - this.card_clicked.width/2;
                    this.card_clicked.y = this.mouseY - this.card_clicked.height/2;
                    this.card_clicked.xantes2 = this.card_clicked.xantes;
                    this.card_clicked.yantes2 = this.card_clicked.yantes;

                }
                this.armas.isHovered = this.armas.tocando(this.mouseX, this.mouseY);
                this.pasarRonda.isHovered = this.pasarRonda.tocando(this.mouseX, this.mouseY);
                this.usadas.isHovered = this.usadas.tocando(this.mouseX, this.mouseY);
                
            }
            else if (pantalla === 'menu') {
                this.settings.isHovered = this.settings.tocando(this.mouseX, this.mouseY);
                this.statistics.isHovered = this.statistics.tocando(this.mouseX, this.mouseY);
                this.logout.isHovered = this.logout.tocando(this.mouseX, this.mouseY);
                this.play.isHovered = this.play.tocando(this.mouseX, this.mouseY);
            }
            else if (pantalla === 'seleccion_carta') {
                if (this.arregloCartas) {
                    for (let card of this.arregloCartas) {
                        card.isHovered = card.contains(this.mouseX, this.mouseY);
                    }
                }
            }
            else if(pantalla === 'lootboxes'){
                this.lootbox1.isHovered = this.lootbox1.tocando(this.mouseX, this.mouseY);
                this.lootbox2.isHovered = this.lootbox2.tocando(this.mouseX, this.mouseY);
                this.lootbox3.isHovered = this.lootbox3.tocando(this.mouseX, this.mouseY);
                this.lootbox4.isHovered = this.lootbox4.tocando(this.mouseX, this.mouseY);
            }
            else if(pantalla === 'seleccion_de_pantalla'){
                this.sleccioncard.isHovered = this.sleccioncard.tocando(this.mouseX, this.mouseY);
                this.selectionlootboxes.isHovered = this.selectionlootboxes.tocando(this.mouseX, this.mouseY);
            }
            else if (pantalla === 'gameLore') {
                this.skipInitialDialogue.isHovered = this.skipInitialDialogue.tocando(this.mouseX, this.mouseY);
            }

        });
        canvas.addEventListener('mousedown', (event) => {
            // Card dialogue screen: any click dismisses the dialogue and returns to gameplay.
            // cartaDialogueDone is set to true so cardsClickedIntercations does not reopen it on the same click.
            if (pantalla === 'dialogo_carta') {
       
                dialogueSound.pause(); // Stop the scroll sound if the player clicks before the text finishes
                dialogueSound.currentTime = 0; // Reset playback position so the sound is ready for the next dialogue
                pantalla = 'juego';
                return; // Prevent any further click handling this frame
            }
            else if (pantalla === 'juego') {
                console.log(this.ctab);
                this.cardsClickedIntercations();
                if(this.pasarRonda.isHovered && this.ctab == 4){
                    if(this.skipebutton){
                        this.pasarRonda.click();
                        if(this.boss){
                            this.playerHealth.health -= this.playerHealth.maxHealth * 0.1
                        }
                        for(let i = 0; i<4; i++){
                            for(let card of this.cartas){
                                if (card.inboard){
                                    card.inboard = false;
                                    
                                    this.cartas.push(card);
                                    this.index = this.cartas.indexOf(card);
                                    break;
                                }
                            }
                            this.cartas.splice(this.index,1);
                        }
                        this.skipebutton = false;
                    }
                }
            }
            else if (pantalla === 'menu') {
                if (this.play.isHovered) {
                    this.play.click();
                    pantalla = 'gameLore';
                }
                if (this.logout.isHovered) {
                    this.logout.click();
                    localStorage.removeItem("player");
                    window.location.href = "../menu/inicioSesion_registro.html";
                }   
                if (this.settings.isHovered) {
                    this.settings.click();
                    this.pantalla = "settings";
                }
            }
            else if (pantalla === 'seleccion_de_pantalla') {
                if (this.sleccioncard.isHovered) {
                    this.sleccioncard.click();
                    pantalla = 'seleccion_carta';
                }
                else if (this.selectionlootboxes.isHovered) {
                    this.selectionlootboxes.click();
                    pantalla = "lootboxes";
                }
            }
            else if(pantalla === 'lootboxes'){
                if(this.lootbox1.isHovered){
                    this.lootbox1.click(this.playerHealth,this.contador,this.cartas);
                }
                else if(this.lootbox2.isHovered){
                    this.lootbox2.click(this.playerHealth,this.contador,this.cartas);
                }
                else if(this.lootbox3.isHovered){
                    this.lootbox3.click(this.playerHealth,this.contador ,this.cartas);
                }
                else if(this.lootbox4.isHovered){
                    this.lootbox4.click(this.playerHealth,this.contador,this.cartas);
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
                this.cardSelectionScreen();
                
            }

            else if (pantalla === 'gameLore') {
                if (this.skipInitialDialogue.isHovered) {
                    pantalla = 'juego';
                    dialogueSound.pause(); // Stop the scroll sound if the player clicks before the text finishes
                    dialogueSound.currentTime = 0; // Reset playback position so the sound is ready for the next dialogue
                }
                else {
                    
                    dialogueSound.pause(); // Stop the scroll sound if the player clicks before the text finishes
                    dialogueSound.currentTime = 0; // Reset playback position so the sound is ready for the next dialogue
                    lore += 1;
                    console.log("lore: " + lore);
                    loreDialogueGenerated = false; // Allow the next dialogue to be generated on the following frame
                    if (lore >= preRunDialogue.length) {
                        pantalla = 'juego';
                    }
                }
            }
          
        });

    }
    update(deltaTime) {
        this.fourth = 0;
        if(this.nivel%5 == 0 && this.nivel != 0){
            this.boss = true;
        }
        else{
            this.boss = false;
        }
        this.pasarRonda.update();
        this.usadas.update();
        this.armas.update();
        this.play.update();
        this.logout.update();
        this.settings.update();
        this.statistics.update();
        this.skipInitialDialogue.update();
        this.sleccioncard.update();
        this.selectionlootboxes.update();
        this.lootbox1.update();
        this.lootbox2.update();
        this.lootbox3.update();
        this.lootbox4.update();
        // When ctab reaches 1 or below, the player has used all allowed plays for this board turn.
        // Any card still on the board that is unused but marked inboard gets pushed back to position 100
        // and tablaVacia is set so the draw() method will refill the board next frame.
        if (this.ctab <= 1) {
            let todasEnPosicion = true;
            for (let card of this.cartas) {
                if (!card.used && card.inboard) {
                    if (card.x > canvasWidth * 0.125) {
                        card.x -= 1000 * (deltaTime / 1000);
                        card.xantes2 = card.x;
                        card.xantes = card.x;
                        todasEnPosicion = false;
                    }
                }
            }
            if(todasEnPosicion){
                this.tablaVacia = true; 
                terminado = false; // Allow the board-refill branch in draw() to run once
                this.ctab = 4;     // Reset the plays-per-turn counter
            }

            if(this.fourth %2 == 0){
                this.skipebutton = true;
            }
            this.fourth += 1;
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
        if(pantalla === 'menu' && !playedMusic){
            menuMusic.currentTime = 0; // Ensure the music starts from the beginning
            menuMusic.play();
            playedMusic = true; // Set the flag to prevent restarting the music on subsequent menu visits
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
        for (let card of this.cartas) {
            if (!card.used && card.enemie() && !card.inboard) {
                this.win = false;
                break;
            }
            else{
                this.win =  true;
            }
        }
        if(this.win){
            this.cartas.forEach(card => {
                if (!card.used) {
                    card.used = true;
                }
            });
        }
        return (this.win || this.cartas.every(card => card.used)) || this.playerHealth.health <= 0 || this.contador.tiempolim <= 0;
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
        else if (pantalla === 'seleccion_de_pantalla') {
            // Neon text style for the screen title
            neonText(30, '#00bfff', "SELECCIONA UN NIVEL", canvasWidth / 2, 40);
            this.sleccioncard.draw(ctx);
            this.selectionlootboxes.draw(ctx);

        }
        else if (pantalla === 'gameLore'){
            if (!loreDialogueGenerated) {
                this.loreDialogue = new Dialogue(preRunDialogue[lore]);
                this.loreDialogue.draw(ctx);
                loreDialogueGenerated = true;
            }
            else{
                this.skipInitialDialogue.draw(ctx);
                this.loreDialogue.update();
                this.loreDialogue.draw(ctx);
            }

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

        else if (pantalla === 'menu') {
            this.play.draw(ctx);
            this.logout.draw(ctx);
            this.settings.draw(ctx);
            this.statistics.draw(ctx);
        }
        else if (pantalla === 'lootboxes') {
            // Neon text style for the screen title
            neonText(30, '#00bfff', "LOOTBOXES", canvasWidth / 2, 40);      
            this.lootbox1.draw(ctx);
            this.lootbox2.draw(ctx);
            this.lootbox3.draw(ctx);
            this.lootbox4.draw(ctx);
            this.playerHealth.draw(ctx);
        }
        
        // Displays the card dialogue screen using the same Dialogue system as pre-level dialogues.
        // dialogue_carta is instantiated in cardsClickedIntercations() when a card is first clicked.
        else if (pantalla === 'dialogo_carta') {
            this.dialogue_carta.update();
            this.dialogue_carta.draw(ctx);
        }
        else if (pantalla === 'juego') {
            if(this.boss){
                ctx.fillStyle = "white";
                ctx.font = "20px Ethnocentric";
                ctx.textAlign = "left";
                ctx.fillText("El jefe ha llegado", canvasWidth/2,50);
            }
            //ROUND IN PROGRESS
            if (!this.gameover) {
                this.bossBar.draw(ctx);
                this.armas.draw(ctx);
                this.usadas.draw(ctx);
                this.playerHealth.draw(ctx);
                this.pasarRonda.draw(ctx);
                this.contador.draw(ctx);

                this.num = 0;
                let posicion = canvasWidth * 0.125;
                // tablaVacia is true at the start of a new board turn; expand the visible card count by 3
                // and shift the starting position right so the layout stays balanced
                if (this.tablaVacia && !terminado) {
                    this.cantidadCartasTablero += 3;
                    posicion = canvasWidth * 0.328;
                    this.curacionUsada = false;
                }

                for (let card of this.cartas) {
                    if (this.num < this.cantidadCartasTablero) {
                        if (!card.used && !card.inboard) {
                            card.x = posicion;
                            posicion += canvasWidth * 0.203; //DEBUGEAR DEFAULT 0.203
                            card.inboard = true;
                            card.xantes2 = card.x; // Cache the card's original coordinates to allow it to snap back if the play is invalid
                            card.yantes2 = card.y;
                            card.xantes = card.x; // Cache the card's original coordinates to allow it to snap back if the play is invalid
                            card.yantes = card.y;
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

            // Position and draw the three offered cards evenly spaced across the canvas
            const selMargin = (canvasWidth - 3 * cardWidth) / 4;
            this.cartaSeleccionada1.x = selMargin;
            this.cartaSeleccionada1.y = canvasHeight * 0.286;
            this.cartaSeleccionada1.xantes = this.cartaSeleccionada1.x; // Cache original coordinates for snap-back if the player clicks but doesn't select this card
            this.cartaSeleccionada1.yantes = this.cartaSeleccionada1.y;
            this.cartaSeleccionada1.xantes2 = this.cartaSeleccionada1.x; // Cache original coordinates for snap-back if the player clicks but doesn't select this card
            this.cartaSeleccionada1.yantes2 = this.cartaSeleccionada1.y;
            this.cartaSeleccionada1.draw(ctx);

            this.cartaSeleccionada2.x = selMargin * 2 + cardWidth;
            this.cartaSeleccionada2.y = canvasHeight * 0.286;
            this.cartaSeleccionada2.xantes = this.cartaSeleccionada2.x; // Cache original coordinates for snap-back if the player clicks but doesn't select this card
            this.cartaSeleccionada2.yantes = this.cartaSeleccionada2.y;
            this.cartaSeleccionada2.xantes2 = this.cartaSeleccionada2.x; // Cache original coordinates for snap-back if the player clicks but doesn't select this card
            this.cartaSeleccionada2.yantes2 = this.cartaSeleccionada2.y;
            this.cartaSeleccionada2.draw(ctx);

            this.cartaSeleccionada3.x = selMargin * 3 + cardWidth * 2;
            this.cartaSeleccionada3.y = canvasHeight * 0.286;
            this.cartaSeleccionada3.xantes = this.cartaSeleccionada3.x; // Cache original coordinates for snap-back if the player clicks but doesn't select this card
            this.cartaSeleccionada3.yantes = this.cartaSeleccionada3.y;
            this.cartaSeleccionada3.xantes2 = this.cartaSeleccionada3.x; // Cache original coordinates for snap-back if the player clicks but doesn't select this card
            this.cartaSeleccionada3.yantes2 = this.cartaSeleccionada3.y;
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
        else if (pantalla === 'resumen') {
            // Title color and text depend on how the run ended, reusing reason codes from gameOverReason()
            // reason 3 means victory (all cards used), anything else means loss
            let titleColor;
            let titleText;
            if (this.reason === 3) {
                titleColor = '#ffd700';
                titleText = "RUN COMPLETADA";
            }
            else {
                titleColor = '#ff0040';
                titleText = "GAME OVER";
            }

            // Title keeps a little glow so it stands out
            ctx.shadowBlur = 8;
            ctx.shadowColor = titleColor;
            ctx.fillStyle = titleColor;
            ctx.font = "50px Ethnocentric";
            ctx.textAlign = "center";
            ctx.fillText(titleText, canvasWidth / 2, 120);

            // All other text uses minimal glow for readability
            ctx.shadowBlur = 3;
            ctx.font = "25px Ethnocentric";
            ctx.shadowColor = '#00bfff';
            ctx.fillStyle = '#ffffff';
            ctx.fillText("RESUMEN DE LA RUN", canvasWidth / 2, 220);

            // What is lost: these values reset every run
            ctx.font = "18px Ethnocentric";
            ctx.shadowColor = '#ff0040';
            ctx.fillStyle = '#ff0040';
            ctx.fillText("SE PIERDE:", canvasWidth / 2, 290);

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = "16px Ethnocentric";
            ctx.fillText("Vida restante: "       + Math.floor(this.playerHealth.health), canvasWidth / 2, 325);
            ctx.fillText("Tiempo restante: " + Math.floor(this.contador.tiempolim / 1000), canvasWidth / 2, 350);

            // What is kept: money already survives via newLevel() as it is passed to the new Player()
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#00bfff';
            ctx.fillStyle = '#00bfff';
            ctx.font = "18px Ethnocentric";
            ctx.fillText("SE CONSERVA:", canvasWidth / 2, 410);

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = "16px Ethnocentric";
            ctx.fillText("Monedas: "             + Math.floor(this.playerHealth.money),  canvasWidth / 2, 445);

            // General stats accumulated during this run
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#ffd700';
            ctx.fillStyle = '#ffd700';
            ctx.font = "18px Ethnocentric";
            ctx.fillText("STATS DE LA RUN:", canvasWidth / 2, 505);

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = "16px Ethnocentric";
            ctx.fillText("Nivel alcanzado: "     + this.nivel,                           canvasWidth / 2, 540);
            ctx.fillText("Enemigos eliminados: " + this.enemigosEliminados,              canvasWidth / 2, 565);
            ctx.fillText("Dano recibido: "       + Math.floor(this.danoRecibido),        canvasWidth / 2, 590);

            ctx.shadowBlur = 3;
            ctx.shadowColor = '#00bfff';
            ctx.fillStyle = '#00bfff';
            ctx.font = "16px Ethnocentric";
            ctx.fillText("Presiona espacio para continuar", canvasWidth / 2, 650);
        }
    }

    // Resets the board for a new round. If the player won, scales up card numbers and assigns
    // random special abilities to weapon cards. If the player lost, the deck is rebuilt from scratch
    // at base values with no difficulty increase.
    // `victory` (boolean): true if the player cleared the level, false if they lost.
    newLevel(victory) {
        if (victory) {
            this.bossBar.roundsleft = 20 - this.nivel;
            this.dificultad = 1.1; // Compound difficulty increase of 10% per won level
            // Disable card dialogues permanently after level 0 is cleared
            this.cartaDialogueDone = true; // permanente desde nivel 1 en adelante
        }
        // Reset all cards to their unplayed state so they can re-enter the deck
     
        for (let i = 0; i < this.cartas.length; i++) {
            this.cartas[i].used = false;
            this.cartas[i].inboard = false;
            this.cartas[i].enMazo = true;
            this.cartas[i].scale = 1;
            this.cartas[i].xantes = 2000;
            this.cartas[i].yantes = 200;
            this.cartas[i].xantes2 = 2000;
            this.cartas[i].yantes2 = 200;
            this.cartas[i].isHovered = false;
            this.cartas[i].x =2000;
            this.cartas[i].y = 200;
            this.cartas[i].dialogueMostrado = true; // Prevent card dialogues from showing again after level 0
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
        this.clicked = false;
        this.curacionUsada = false;
        this.skipebutton = false;
        this.seleccionando = false; // Allow new card selection on the next visit to the card-selection screen

        if (!victory) { // On a loss, discard the current deck and rebuild it at base values (no scaling)
            this.cartas = [];
            this.nivel = 0;
            // Reset run stats on loss so they start fresh for the new run
            this.enemigosEliminados = 0;
            this.danoRecibido = 0;
            // Reset card dialogues for the new run starting at level 0
            this.cartaDialogueDone = false;
            // Reset card type dialogues for new run starting at level 0
            this.dialogoArmaVisto = false;
            this.dialogoEnemieVisto = false;
            this.dialogoVidaVisto = false;
            for (let i = 1; i < 11; i++) {
                let card = new CardEspada(2000, 200, cardWidth, cardHeight, i, "diamantes", 1, false, false, true, "",imgRombos);
                this.cartas.push(card);
            }
            for(let i = 1; i < 3; i++){
                for (let i = 1; i < 10; i++) {
                    let card = new CardEnemie(2000, 200, cardWidth, cardHeight, i, "treboles", 1, false, false, true, "",imgTreboles);
                    this.cartas.push(card);
                }
            }
            for (let i = 1; i < 11; i++) {
                let card = new CardVida(2000, 200, cardWidth, cardHeight, i, "corazones", 1, false, false, true, "",imgCorazon);
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
            this.nivel++;
            // Randomly assign a special ability to each weapon card.
            // probabilidadhabilidad is a 0-10 roll that acts as an ability-trigger gate
            // habilidadProb is a second 0-10 roll that selects which specific ability is assigned.
            for (let card of this.cartas) {
                this.abilityObtention(card);
            }
        }
        this.contador = new Tiempo();
        // this.armas = new Botones(canvasWidth * 0.125, canvasHeight * 0.671, cardWidth, cardHeight,"", undefined, undefined,"cardPlace");
        // this.usadas = new Botones(canvasWidth * 0.813, canvasHeight * 0.571, cardWidth, cardHeight,"",undefined, undefined,"cardPlace");
        // Preserve the player's money across levels; everything else resets to defaults
        this.playerHealth = new Player(15, 15, canvasWidth * 0.125, 20, 20, this.playerHealth.money);

        shuffle(this.cartas);
    }

    cardSelectionScreen() {
        for (let card of this.arregloCartas) {
            if (card.isHovered) {
                this.selectCard(card);
                
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

    selectCard(card){
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
    }

    buttonPressed()
    {

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
    console.log(user);    
    const canvas = document.getElementById('canvas');
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx = canvas.getContext('2d');

    // Load the custom font before starting the loop so the first frame renders correctly.    const ethnocentric = new FontFace('Ethnocentric', 'url(../assets/fonts/Ethnocentric-Regular.otf)');
    
    let ethnocentric;
    if (font === "regular"){
        ethnocentric = new FontFace('Ethnocentric', 'url(../game/assets/fonts/Ethnocentric-Regular.otf)');
    }
    else{
        ethnocentric = new FontFace('Ethnocentric', 'url(../game/assets/fonts/OpenDyslexic-Regular.otf)');
    }
    ethnocentric.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
        // Create the game object
        game = new Game(canvas);
        drawScene(0);
    });
    


}
