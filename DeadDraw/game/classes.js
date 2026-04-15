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
    constructor(x, y, width, height,scale = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect((this.x), (this.y), this.width *this.scale, this.height * this.scale);
    }
    // Returns true if the mouse cursor at (mx, my) is inside this button's bounds
    tocando(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
    update(){
        if(this.isHovered){
            this.scale = 1.2;
        }
        else{
            this.scale = 1;
        }
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
