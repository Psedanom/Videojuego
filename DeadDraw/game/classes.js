/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the class definitions needed for the game.

*/
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
        ctx.font = "20px Ethnocentric";
        ctx.textAlign = "left";
        ctx.fillText("Time left " + Math.floor(this.tiempolim / 1000), canvasWidth - 200, 30);
    }
}
//Holds and renders all player stats: health bar, current health, and money
class Player {
    constructor(x, y, width, height, maxHealth, money = 100) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.money = money;
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect((this.x), (this.y), this.width, this.height);
        // healthli is the pixel width of the filled portion of the health bar,
        // proportional to (current health / max health)
        if(pantalla == "juego"){
            let healthli = (this.health / this.maxHealth) * this.width;
            ctx.fillStyle = "red";
            ctx.fillRect((this.x), (this.y + 1), healthli, this.height - 2);
            ctx.fillStyle = "white";
            ctx.font = "20px Ethnocentric";
            ctx.textAlign = "center";
            ctx.fillText(this.health, this.width - 35, this.height + 12);
        }
        if(pantalla == "juego" || pantalla == "lootboxes"){
            ctx.fillStyle = "yellow";
            ctx.font = "20px Ethnocentric";
            ctx.textAlign = "center";
            ctx.fillText(`Money: ${this.money}$`, canvasWidth / 2,canvasHeight-20);
        }
    }
}
//Clickable rectangular button, used for the weapon slot and the discard pile
class Botones {
    constructor(x, y, width, height,text,scale = 1, color = "red", buttonType = "normal") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale
        this.defaultScale = scale;
        this.text = text;
        this.xantes = x;
        this.yantes = y;
        this.color = color;
        this.audioplayed = false; // Tracks whether the hover sound has been played for the current hover state
        this.wasHovered = false;
        this.buttonType = buttonType; // Different type of buttons have different sound effects
        this.selectSound = playingSelect; // Sound effect played when the button is clicked; defaults to the generic playingSelect sound but is overridden for menu buttons in the constructor

        switch (this.buttonType) {
            case "normal":
                this.sound = hoverSound;
                if (this.text === "Play") 
                this.selectSound = menuSelect;
                break;
            case "skipButton":
                this.sound = skipRound;
                this.selectSound = playingSelect;
                break;
            case "cardPlace":
                this.sound = cardPlaces;
                this.selectSound = playingSelect;
                break;
        }


    }
    draw(ctx) {
        
        
        
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width * this.scale, this.height * this.scale, 10);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 100;
        ctx.stroke();
        ctx.shadowBlur = 0;


        ctx.fillStyle = this.color;
        ctx.font = "20px Ethnocentric";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.strokeText(this.text, this.x + (this.width * this.scale) / 2, this.y + (this.height * this.scale) / 2);
        ctx.fillText(this.text, this.x + (this.width * this.scale) / 2, this.y + (this.height * this.scale) / 2);
        ctx.textBaseline = "alphabetic";
        ctx.shadowBlur = 0;
    }
    // Returns true if the mouse cursor at (mx, my) is inside this button's bounds
    tocando(mx, my) {
        // return mx >= this.xantes && mx <= this.xantes + this.width && my >= this.yantes && my <= this.yantes + this.height;
        return mx >= this.x && mx <= this.x + this.width * this.scale && my >= this.y && my <= this.y + this.height * this.scale;
    }
    update(){

        //Sound playing fix provided by AI, the variable wasHovered is AI idea but the way to play the audio is ours
        if(this.isHovered){
            
            if (!this.wasHovered) {
                this.sound.currentTime = 0;
                this.sound.play();
                this.audioplayed = true;
                this.scale *= 1.2;
            }
            // this.scale = 1.2;
            this.x = this.xantes - (this.width * 0.2) / 2; // Adjust x to keep the button centered while scaling
            this.y = this.yantes - (this.height * 0.2) / 2; // Adjust y to keep the button centered while scaling
        }
        else{
            this.audioplayed = false;
            this.scale = this.defaultScale;
            this.x = this.xantes;
            this.y = this.yantes;
        }
        this.wasHovered = this.isHovered;
    }
    click() {
        this.selectSound.currentTime = 0;
        this.selectSound.play();
    }
}
class bossBar{
    constructor(x, y, width, height, roundsleft , totalRounds) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.roundsleft = roundsleft;
        this.totalRounds = totalRounds;
    }
    draw(ctx) {
        // Fondo negro
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Relleno rojo proporcional a rondas restantes
        ctx.fillStyle = "red";
        let fillWidth = this.height * (this.roundsleft / this.totalRounds);
        ctx.fillRect(this.x, this.y, this.width, fillWidth);

        ctx.strokeStyle = "red";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "red";
        ctx.shadowBlur = 15;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;

        // Etiqueta de rondas restantes
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "white";
        ctx.font = "12px Ethnocentric";
        ctx.textAlign = "center";
        ctx.fillText("BOSS " + this.roundsleft + "/" + this.totalRounds, 0, 4);
        ctx.restore();
    }
}
class lootbox {
    constructor(x, y, width, height, cost,scale = 1) {
        this.x = x;
        this.y = y;
        this.xantes = x;
        this.yantes = y;
        this.width = width;
        this.height = height;
        this.cost = cost;
        this.isHovered = false;
        this.scale = scale;
    }
    draw(ctx) {
        ctx.fillStyle = "purple";
        ctx.fillRect((this.x), (this.y), (this.width * this.scale), (this.height * this.scale));
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.cost, this.x + (this.width *this.scale) / 2, this.y + (this.height * this.scale) / 2);
    }
    tocando(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }

    update() {
            if(this.isHovered){
                this.scale = 1.2;
                this.x = this.xantes - (this.width * 0.2) / 2; // Adjust x to keep the lootbox centered while scaling
                this.y = this.yantes - (this.height * 0.2) / 2; // Adjust y to keep the lootbox centered while scaling
            }
            else{
                this.scale = 1;
                this.x = this.xantes;
                this.y = this.yantes;   
            }
    }
    click(player,contador,cartas) {
        if (player.money >= this.cost) {
            if(this.cost == 50){
                player.money -= this.cost;
                this.prob = getRandomIntegerInclusive(1,100);
                if(this.prob <= 10){
                    player.maxHealth += 5;
                    console.log("max health increased to " + player.maxHealth);
                }
                else if(this.prob <= 20){
                    player.money += 50;
                    console.log("money increased to " + player.money);
                }
                else if(this.prob <= 30){
                    contador.tiempoSegundos += 5;
                    console.log("time increased to " + contador.tiempoSegundos);
                }
                else if(this.prob <= 50){
                    for(let card of cartas){
                        if(card.enemie()){
                            card.number = Math.max(card.number + card.number * 0.5);
                            console.log("enemy number increased to " + card.number);
                            break;
                        }
                    }
                }
                else if(this.prob <= 75){
                    for(let card of cartas){
                        if(card.arma()){
                            card.number = Math.max(card.number + 1);
                            console.log("weapon damage increased to " + card.number);
                            break;
                        }
                    }
                }
                else{
                    for(let card of cartas){
                        if(card.esVida()){
                            card.number = Math.max(card.number + 1);
                            console.log("health card increased to " + card.number);
                            break;
                        }
                    }
                }
            }
        }
        else {
            player.money = 0;
        } 
    }
}

class Dialogue {
   // sprite parameter allows overriding the default imgMaton character image.
    // If no sprite is passed, falls back to imgMaton to preserve existing behaviour.
    constructor(texto, sprite = imgMaton) {
        this.sprite = sprite;   
        this.x = canvasWidth / 2 - 400;
        this.y = canvasHeight - canvasHeight / 4;
        this.texto = texto;
        this.caracteresVisibles = 0; // How many characters are currently visible (grows each frame)
        this.velocidad = 0.40; // Characters revealed per frame (fractional to slow the scroll)
        this.done = false; // True once the full text has been revealed
        //this.character = character; // Sprite to draw alongside the dialogue box defaults to the thug (imgMaton)
        this.characterx = canvasWidth - 600;
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
        // Draw the character sprite; defaults to imgMaton if no override was provided
        ctx.drawImage(this.sprite, this.characterx, this.charactery, 400, 300);
        ctx.drawImage(imgDialogue, this.x, this.y, 850, canvasHeight / 4);
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
            ctx.fillText(words[i], this.x + 240, this.y + 70 + (i * lineheight));

        }
    }


}

class Cards {
    constructor(x, y, width, height, number, type, scale, used, inboard, enMazo, habilidad,img , xantes = x, yantes = y) {
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
        this.audioplayed = false; // Tracks whether the hover sound has been played for the current hover state
        this.wasHovered = false;
        this.xantes = xantes; // Cache the card's original coordinates to allow it to snap back if the play is invalid
        this.yantes = yantes;
        this.xantes2 = xantes; // Cache the card's original coordinates to allow it to snap back if the play is invalid
        this.yantes2 = yantes;
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.drawImage(this.img, this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale);
            ctx.fillStyle = "white";
            ctx.font = `${20*this.scale}px Ethnocentric`;
            ctx.textAlign = "right";
            ctx.fillText(this.number, this.x + 125*this.scale, this.y + 52*this.scale);
            ctx.font = `${10*this.scale}px Arial`;
            ctx.fillText(this.habilidad, this.x + 50*this.scale, this.y + 100*this.scale);
            if (this.habilidad && this.habilidad !== "" && this.enemie && this.enemie()) {
                const colores = {
                    "absoluteDamage": "#ffd700",
                    "cursedEnemy":    "#ff0040",
                    "timeEater":      "#9b00ff",
                    "goldStealer":    "#00ff99"
                };
                ctx.shadowBlur = 6;
                ctx.shadowColor = colores[this.habilidad] || "#ffffff";
                ctx.fillStyle   = colores[this.habilidad] || "#ffffff";
                ctx.font = `${8*this.scale}px Ethnocentric`;
                ctx.textAlign = "right";
                ctx.fillText("★", (this.x + this.width / 2)*this.scale, (this.y + this.height - 8)*this.scale);
                ctx.shadowBlur = 0;
            }
            
    }
    contains(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
    update() {
        if (this.isHovered && !this.used) {
            if (!this.wasHovered) {
                console.log(this.type + " is hovered"); // Debug log to verify hover detection
                cardSound.playbackRate = 1.5 + getRandomIntegerInclusive(0,0.5); // Randomize pitch for variety
                cardSound.currentTime = 0;
                cardSound.play();
                this.audioplayed = true;
            }
            this.scale = 1.2;
            this.x = this.xantes2 - (this.width * 0.2) / 2; // Adjust x to keep the card centered while scaling
            this.y = this.yantes2 - (this.height * 0.2) / 2; // Adjust y to keep the card centered while scaling
        } else if(!this.isHovered && this.inboard) {
            // cardSound.playbackRate = 1; // Reset pitch to normal for the next hover
            this.audioplayed = false;
            this.scale = 1;
            this.xantes2 = this.xantes; // Update the backup coordinates in case the card was moved while hovered
            this.yantes2 = this.yantes;
            this.x = this.xantes2; // Snap back to original coordinates when not hovered
            this.y = this.yantes2;
        }else if(!this.inboard && this.used){
            this.x = this.xantes2; // Move off-screen to the right when removed from the board  
            this.y = this.yantes2; // Move off-screen downwards when removed from the board
            this.scale = 1; // Shrink to invisible when removed from the board
        }
        if(this.used && this.inboard){
            this.xantes2 = this.x;  // Update backup coordinates to the card's current position when it's played, in case it needs to snap back before being removed from the board
            this.yantes2 = this.y;
        }
        this.wasHovered = this.isHovered;
    }
    click(x, y) {
        this.x = x;
        this.y = y;
        this.xantes2 = x; // Update backup coordinates to the card's new position when it's clicked, in case it needs to snap back
        this.yantes2 = y;
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
    enemie() {
        return false;
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
