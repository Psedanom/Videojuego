"use strict";




const canvasWidth = 800;
const canvasHeight = 700;

let oldTime = 0;

let ctx;
let game;
let terminado = false;
let pantalla = 'seleccion_carta';

/*
Estados de variable pantalla:
- 'juego': el juego principal, donde se muestran las cartas, el jugador, el tiempo, etc.
- 'seleccion_carta': pantalla de selección de carta, donde el jugador puede elegir una carta para usar en el siguiente nivel.
*/

const imgCorazon = new Image();
imgCorazon.src = 'assets/corazon.png';

const imgRombos = new Image();
imgRombos.src = 'assets/rombos.png';

const imgPicas = new Image();
imgPicas.src = 'assets/picas.png';

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

// Funcion para obtener un numero aleatorio inclusivo
// Tomada de https://coreui.io/blog/how-to-generate-a-random-number-in-javascript/#:~:text=Remember,%20while%20JavaScript%27s%20random%20numbers,Yes,%20while%20Math.
const getRandomIntegerInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Contador del juego
class Tiempo {

    constructor(tiempoSegundos = 10) {
        this.tiempolim = tiempoSegundos * 1000;
        this.time = 0;
    }

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
class Player {
    constructor(x, y, width, height, maxHealth, startingMoney = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.money = startingMoney; //Default 0, pero se puede pasar como parametro
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect((this.x),
            (this.y),
            this.width,
            this.height);
        let healthli = (this.health / this.maxHealth) * this.width;
        ctx.fillStyle = "red";
        ctx.fillRect((this.x),
            (this.y + 1),
            healthli,
            this.height - 2);
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
class Botones {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect((this.x),
            (this.y),
            this.width,
            this.height);
    }
    tocando(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
}

class Cards {
    constructor(x, y, width, height, number, type, scale, used, inboard, enMazo,habilidad) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.number = number;
        this.type = type;
        this.scale = scale;
        this.used = used;
        this.inboard = inboard;
        this.enMazo = enMazo;
        this.habilidad = habilidad;
    }
    draw(ctx) {
    }
    contains(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }

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
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.drawImage(imgPicas,this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.number, this.x + 20, this.y + 20);
    }
    actionUse(health) {
        health -= this.number;
        return health;
    }
    actionWeapon(health, num) {
        this.daño = this.number - num;
        if (this.daño < 0) {
            return health;
        }
        health -= this.daño;
        return health;
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
    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.drawImage(imgCorazon,this.x,
            this.y,
            this.width * this.scale,
            this.height * this.scale);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.number, this.x + 20, this.y + 20);
    }
    actionUse(health) {
        if (health < 20) {
            if (health + this.number > 20) {
                health = 20;
            }
            else {
                health += this.number;
            }
        }
        return health;
    }
    arma() {
        return false;
    }
    esVida() {
        return true;
    }
}

class CardEspada extends Cards {
    draw(ctx) {
        let img = imgRombos;
        if(this.habilidad != ""){
            //ctx.fillStyle = "purple";
            ctx.drawImage(img,this.x,
                this.y,
                this.width * this.scale,
                this.height * this.scale);


            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.number, this.x + 20, this.y + 20);
            ctx.font = "10px Arial";
            ctx.fillText(this.habilidad,this.x + 50, this.y+100);
            
        }
        else{
            let img = imgRombos;
            //ctx.fillStyle = "orange";
            ctx.drawImage(img,
                this.x,
                this.y,
                this.width * this.scale,
                this.height * this.scale);
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.number, this.x + 20, this.y + 20);
        }
    }
    recallNum() {
        return this.number;
    }
    arma() {
        return true;
    }
    esVida() {
        return false;
    }
}

class Game {
    constructor(canvas) {
        this.cartas = [];

        this.dificultad = 1.1 // multiplicador de dificultad de 10% por cada nivel
        this.createEventListeners();
        this.initObjects();
        this.canvas = canvas;
        this.clicked = false;
        this.tablaVacia = false;
        this.cnt = 0;
        this.ctab = 4;
        this.cantidadCartasTablero = 4;
        this.cartasArma = [];
        this.hayArma = false;
        this.gameover = false;
        this.curacionUsada = false;
        this.cartasUsadas = [];
        this.seleccionando = false; // Variable para controlar si el jugador esta seleccionando cartas
    }

    initObjects() {

        for (let i = 1; i < 11; i++) {
            let card = new CardEspada(0, 200, 112.5, 150, i, "diamantes", 1, false, false, true,"");
            this.cartas.push(card);
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardEnemie(0, 200, 112.5, 150, i, "treboles", 1, false, false, true,"");
            this.cartas.push(card);
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardEnemie(0, 200, 112.5, 150, i, "espadas", 1, false, false, true,"");
            this.cartas.push(card);
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardVida(0, 200, 112.5, 150, i, "corazones", 1, false, false, true,"");
            this.cartas.push(card);
        }
        this.contador = new Tiempo();
        this.armas = new Botones(100, 470, 120, 170);
        this.usadas = new Botones(650, 400, 120, 170);
        this.playerHealth = new Player(15, 15, 100, 20, 20);
        shuffle(this.cartas);

    }
    createEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.newLevel(true);
                console.log("new level victory")
            }
        });
            
            //DEBUG: p nuevo nivel con victoria, P nuevo nivel con derrota
        //     if (event.key === 'P') {
        //         this.newLevel(false);
        //         console.log("new level defeat")
        //     }
        window.addEventListener('keydown', (event) => {
            if (event.key == ' ' && this.gameover) {
                switch (this.reason) {
                    case 1:
                        console.log("Reiniciando juego después de perder por salud");
                        this.newLevel(false);
                        break;
                    case 2:
                        console.log("Reiniciando juego después de perder por tiempo");
                        this.newLevel(false);
                        break;
                    case 3:
                        console.log("Reiniciando juego después de ganar por usar todas las cartas");
                        this.newLevel(true);
                        break;
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
                            this.card_clicked.used = true;
                            for (let i = 0; i = this.cartasArma.length; i++) {
                                for (let cartas of this.cartasArma) {
                                    cartas.click(this.xus, this.yus);
                                    this.cartasUsadas.push(cartas);
                                }
                                this.cartasArma.pop();
                            }
                            this.cartasArma.push(this.card_clicked);
                            this.xar = this.armas.x;
                            this.yar = this.armas.y;
                            this.card_clicked.click(this.xar, this.yar);
                            this.clicked = false;
                            this.card_clicked.inboard = false;
                            this.ctab -= 1;
                            this.hayArma = true;
                            this.card_arma.click(this.xus, this.yus);
                            if(this.card_clicked.habilidad == "enemieslos"){
                                for(let card of this.cartas){
                                    if(card.enemie && card.inboard){
                                        card.number -= 1;
                                    }
                                }
                            }
                            else if(this.card_clicked.habilidad == "killhealth"){
                                
                                if (this.playerHealth.health < 20) {
                                    if (this.playerHealth.health + Math.floor(this.card_clicked.number/2) > 20) {
                                        health = 20;
                                    }
                                    else {
                                        this.playerHealth.health += this.card_clicked.number/2;
                                    }
                                }
                            }
                            else if(this.card_clicked.habilidad == "passEnemie"){
                                for(let card of this.cartas){
                                    if(card.enemie && card.inboard){
                                        card.used = true;
                                        this.cartasUsadas.push(card);
                                        this.xus = this.usadas.x;
                                        this.yus = this.usadas.y;
                                        card.click(this.xus,this.yus);
                                        card.inboard = false;
                                        this.ctab -=1;
                                        break;
                                    }
                                }
                            }
                            else if(this.card_clicked.habilidad == "healthpassEnemie"){
                                for(let card of this.cartas){
                                    if(card.enemie && card.inboard){
                                        card.used = true;
                                        this.cartasUsadas.push(card);
                                        this.xus = this.usadas.x;
                                        this.yus = this.usadas.y;
                                        card.click(this.xus,this.yus);
                                        card.inboard = false;
                                        this.ctab -=1;
                                    }
                                }
                                if (this.playerHealth.health < 20) {
                                    if (this.playerHealth.health + Math.floor(this.card_clicked.number/2) > 20) {
                                        health = 20;
                                    }
                                    else {
                                        this.playerHealth.health += this.card_clicked.number;
                                    }
                                }
                            }
                        }

                        else {
                            this.card_clicked.used = true;
                            this.cartasArma.push(this.card_clicked);
                            this.xar = this.armas.x;
                            this.yar = this.armas.y;
                            this.card_clicked.click(this.xar, this.yar);
                            this.clicked = false;
                            this.card_clicked.inboard = false;
                            this.ctab -= 1;
                            this.card_arma = this.card_clicked;
                            this.hayArma = true;
                        }
                        this.posicion = 20;
                    }
                    else if (this.hayArma && this.card_clicked.enemie()) {
                        if (this.numeroAnterior > this.card_clicked.number || this.cartasArma.length < 2) {
                            this.card_clicked.used = true;
                            this.cartasArma.push(this.card_clicked);
                            for (let cartasrma of this.cartasArma) { //CHECAR
                                if (cartasrma.arma()) {
                                    this.numberArma = cartasrma.number;
                                }
                            }
                            this.playerHealth.health = this.card_clicked.actionWeapon(this.playerHealth.health, this.numberArma);
                            this.xar = this.armas.x + this.posicion;
                            this.yar = this.armas.y;
                            this.card_clicked.click(this.xar, this.yar);
                            this.clicked = false;
                            this.card_clicked.inboard = false;
                            this.ctab -= 1;
                            this.playerHealth.money += Math.floor(this.card_clicked.number / 2);
                            this.numeroAnterior = this.card_clicked.number;
                            this.posicion += 20;
                        }
                        else {
                            this.clicked = false;
                        }
                    }
                    break;
                }
                else if (this.usadas.isHovered && this.clicked) {
                    if (this.card_clicked.esVida()) {
                        if (!this.curacionUsada) {
                            this.playerHealth.health = this.card_clicked.actionUse(this.playerHealth.health);
                        }
                        this.curacionUsada = true;
                        this.xus = this.usadas.x;
                        this.yus = this.usadas.y;
                        this.card_clicked.click(this.xus, this.yus);
                        this.clicked = false;
                        this.card_clicked.inboard = false;
                        this.ctab -= 1;
                        this.cartasUsadas.push(this.card_clicked);
                        break;
                    }
                    else {
                        this.xus = this.usadas.x;
                        this.yus = this.usadas.y;
                        this.card_clicked.click(this.xus, this.yus);
                        this.clicked = false;
                        this.card_clicked.inboard = false;
                        this.ctab -= 1;
                        this.playerHealth.health = this.card_clicked.actionUse(this.playerHealth.health);
                        break;
                    }
                }

            }
        }

        // Si estamos eligiendo cartas, necesitamos detectar el click para seleccionar la carta elegida
        else if (pantalla === 'seleccion_carta') {
            for (let card of this.arregloCartas) {
                if (card.isHovered) {
                    console.log("[Seleccion] Antes de elegir carta, mazo:", this.cartas.length);
                    this.cartas.push(card); // Agrega la carta seleccionada al mazo del jugador
                    console.log("[Seleccion] Despues de agregar carta elegida, mazo:", this.cartas.length);

                    // Agrega cartas negativas del side effect
                    let cardIndex;
                    if (card === this.cartaSeleccionada1) cardIndex = this.card1;
                    else if (card === this.cartaSeleccionada2) cardIndex = this.card2;
                    else cardIndex = this.card3;
                    
                    // Agrega las cartas negativas del side effect al mazo del jugador
                    for (let sideCard of cardPool[cardIndex].sideEffects()) {
                        this.cartas.push(sideCard);
                    }
                    console.log("[Seleccion] Despues de sideEffects, mazo:", this.cartas.length);

                    shuffle(this.cartas); // Revuelve el mazo
                    console.log("[Seleccion] Antes de newLevel(true), mazo:", this.cartas.length);
                    this.newLevel(true); // Comienza un nuevo nivel
                    console.log("[Seleccion] Despues de newLevel(true), mazo:", this.cartas.length);
                    pantalla = 'juego'; // Cambia a la pantalla de juego
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

        // Si estamos eligiendo cartas, estas se necesitan actualizar para que se pueda detectar el hover y el click
        if (pantalla === 'seleccion_carta' && this.arregloCartas) {
            for (let card of this.arregloCartas) {
                card.update(); 
            }
        }

        this.gameover = this.isGameOver();

        this.contador.contador(deltaTime);

       
    }
    // El juego termina cuando el jugador se queda sin cartas, sin salud o sin tiempo
    isGameOver() {
        return (this.cartas.length > 0 && this.cartas.every(card => card.used)) || this.playerHealth.health <= 0 || this.contador.tiempolim <= 0;
    }
    gameOverReason() {
        if (this.playerHealth.health <= 0) {
            return 1; // El jugador perdió por quedarse sin salud
        }
        else if (this.contador.tiempolim <= 0) {
            return 2; // El jugador perdió por quedarse sin tiempo
        }
        else if (this.cartas.every(card => card.used)) {
            return 3; // El jugador ganó por usar todas las cartas
        }
    }

    draw(ctx) {
        if (pantalla === 'juego') {
        //TERMINA EL JUEGO
        if (!this.gameover) {
            this.armas.draw(ctx);
            this.usadas.draw(ctx);
            this.playerHealth.draw(ctx);

            this.contador.draw(ctx);

            this.num = 0;
            let posicion = 100;
            if (this.tablaVacia && !terminado) {
                this.cantidadCartasTablero += 3
                posicion = 262.5
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
            for (let cartas of this.cartasArma) {
                cartas.draw(ctx);
            }
            for (let cartas of this.cartasUsadas) {
                cartas.draw(ctx);
            }
        }
        else {
            console.log("Partida terminada");
             this.reason = this.gameOverReason();
            switch (this.reason) {
                case 1:
                    console.log("Partida terminada con codigo: " + this.reason);
                    console.log("Has perdido por quedarte sin salud.");

                    ctx.textAlign = "center";
                    ctx.font = "65px Ethnocentric";
                    // Neon red glow
                    ctx.shadowColor = '#ff0040';
                    ctx.shadowBlur = 30;
                    ctx.strokeStyle = '#ff0040';
                    ctx.lineWidth = 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
                    ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);

                    ctx.font = "40px Ethnocentric";
                    ctx.shadowBlur = 18;
                    ctx.strokeText("Te quedaste sin vida", canvasWidth / 2, canvasHeight / 2 + 30);
                    ctx.fillText("Te quedaste sin vida", canvasWidth / 2, canvasHeight / 2 + 30);

                    ctx.font = "20px Ethnocentric";
                    ctx.shadowBlur = 12;
                    ctx.strokeText("Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                    ctx.fillText("Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                    //Apaga el glow para evitar que se vea en el texto de abajo
                    ctx.shadowBlur = 0;

                    break;
                case 2:
                    console.log("Partida terminada con codigo: " + this.reason);
                    console.log("Has perdido por quedarte sin tiempo.");

                    ctx.textAlign = "center";
                    ctx.font = "65px Ethnocentric";
                    // Neon red glow
                    ctx.shadowColor = '#ff0040';
                    ctx.shadowBlur = 30;
                    ctx.strokeStyle = '#ff0040';
                    ctx.lineWidth = 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
                    ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);

                    ctx.font = "40px Ethnocentric";
                    ctx.shadowBlur = 18;
                    ctx.strokeText("Te quedaste sin tiempo", canvasWidth / 2, canvasHeight / 2 + 30);
                    ctx.fillText("Te quedaste sin tiempo", canvasWidth / 2, canvasHeight / 2 + 30);

                    ctx.font = "20px Ethnocentric";
                    ctx.shadowBlur = 12;
                    ctx.strokeText("Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                    ctx.fillText("Presiona espacio para volver a empezar", canvasWidth / 2, canvasHeight / 2 + 70);
                    //Apaga el glow para evitar que se vea en el texto de abajo
                    ctx.shadowBlur = 0;

                    break;
                case 3:
                    console.log("Partida terminada con codigo: " + this.reason);
                    console.log("Has ganado por usar todas las cartas.");

                    ctx.textAlign = "center";
                    ctx.font = "65px Ethnocentric";
                    // Neon gold glow
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 30;
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 2;
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeText("LEVEL PASSED", canvasWidth / 2, canvasHeight / 2 - 20);
                    ctx.fillText("LEVEL PASSED", canvasWidth / 2, canvasHeight / 2 - 20);

                    ctx.font = "35px Ethnocentric";
                    ctx.shadowBlur = 18;
                    ctx.strokeText("Derrotaste a los enemigos", canvasWidth / 2, canvasHeight / 2 + 30);
                    ctx.fillText("Derrotaste a los enemigos", canvasWidth / 2, canvasHeight / 2 + 30);

                    ctx.font = "20px Ethnocentric";
                    ctx.shadowBlur = 12;
                    ctx.strokeText("Presiona espacio para continuar", canvasWidth / 2, canvasHeight / 2 + 70);
                    ctx.fillText("Presiona espacio para continuar", canvasWidth / 2, canvasHeight / 2 + 70);
                    //Apaga el glow para evitar que se vea en el texto de abajo
                    ctx.shadowBlur = 0;
                    break;
            }
        }
    }
    else if (pantalla === 'seleccion_carta')
    {
            // Texto con color neon
            ctx.textAlign = "center";
            ctx.font = "30px Ethnocentric";
            ctx.shadowColor = '#00bfff';
            ctx.shadowBlur = 30;
            ctx.strokeStyle = '#00bfff';
            ctx.lineWidth = 2;
            ctx.fillStyle = '#ffffff';
            ctx.strokeText("SELECCIONA UNA CARTA", canvasWidth / 2, 40);
            ctx.fillText("SELECCIONA UNA CARTA", canvasWidth / 2, 40);
            this.arregloCartas = [this.cartaSeleccionada1, this.cartaSeleccionada2, this.cartaSeleccionada3];
            
            // Si no se ha seleccionado una carta, selecciona 3 cartas aleatorias del cardPool y las muestra en pantalla
            if(!this.seleccionando)
                {
                
                // Selecciona 3 cartas aleatorias del cardPool
                this.card1 =getRandomIntegerInclusive(0, cardPool.length - 1);
                this.card2 =getRandomIntegerInclusive(0, cardPool.length - 1);
                this.card3 =getRandomIntegerInclusive(0, cardPool.length - 1);

                // Crea las cartas seleccionadas a partir del cardPool
                this.cartaSeleccionada1 = cardPool[this.card1].makeCard();
                this.cartaSeleccionada2 = cardPool[this.card2].makeCard();
                this.cartaSeleccionada3 = cardPool[this.card3].makeCard();

                //Arreglo para guardar las cartas que se van a seleccionar
                this.arregloCartas = [this.cartaSeleccionada1, this.cartaSeleccionada2, this.cartaSeleccionada3];
                this.seleccionando = true;
            }
            // Apaga el glow para evitar que se vea en el dibujado de las cartas
            ctx.shadowBlur = 0;

            // Dibuja las cartas en la pantalla y cambia su posicion para que se vean ordenadas
            this.cartaSeleccionada1.x = 150;
            this.cartaSeleccionada1.y = 200;
            this.cartaSeleccionada1.draw(ctx);

            this.cartaSeleccionada2.x = 325;
            this.cartaSeleccionada2.y = 200;
            this.cartaSeleccionada2.draw(ctx);

            this.cartaSeleccionada3.x = 500;
            this.cartaSeleccionada3.y = 200;
            this.cartaSeleccionada3.draw(ctx);


            //Formato neon para texto
                ctx.textAlign = "left";
                ctx.font = "10px Ethnocentric";
                
                ctx.shadowBlur = 3;
                
                ctx.lineWidth = 1;
                ctx.fillStyle = '#ffffff';

                // Color Azul para el nombre
                ctx.shadowColor = '#00bfff';
                ctx.strokeStyle = '#00bfff';
                // Nombres
                ctx.strokeText(cardPool[this.card1].nombre, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 200);
                ctx.fillText(cardPool[this.card1].nombre, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 200);

                ctx.strokeText(cardPool[this.card2].nombre, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 200);
                ctx.fillText(cardPool[this.card2].nombre, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 200);

                ctx.strokeText(cardPool[this.card3].nombre, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 200);
                ctx.fillText(cardPool[this.card3].nombre, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 200);

                // Color Verde para la ventaja
                ctx.shadowColor = '#15ff00';
                ctx.strokeStyle = '#15ff00';
                // Ventaja de la carta
                ctx.strokeText(cardPool[this.card1].ventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 220);
                ctx.fillText(cardPool[this.card1].ventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 220);
                ctx.strokeText(cardPool[this.card2].ventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 220);
                ctx.fillText(cardPool[this.card2].ventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 220);
                ctx.strokeText(cardPool[this.card3].ventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 220);
                ctx.fillText(cardPool[this.card3].ventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 220);

                // Color Rojo para la desventaja
                ctx.shadowColor = '#ff0040';
                ctx.strokeStyle = '#ff0040';
                // Desventaja de la carta
                ctx.strokeText(cardPool[this.card1].desventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 240);
                ctx.fillText(cardPool[this.card1].desventaja, this.cartaSeleccionada1.x, this.cartaSeleccionada1.y + 240);
                ctx.strokeText(cardPool[this.card2].desventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 240);
                ctx.fillText(cardPool[this.card2].desventaja, this.cartaSeleccionada2.x, this.cartaSeleccionada2.y + 240);
                ctx.strokeText(cardPool[this.card3].desventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 240);
                ctx.fillText(cardPool[this.card3].desventaja, this.cartaSeleccionada3.x, this.cartaSeleccionada3.y + 240);
            
                
    

            
                
                

            
            
            


    }
    }

    // Regenera el tablero con nuevas cartas y si se ha ganado entonces aumenta la dificultad
    //  victory determina si el jugador gano o perdio, booleano
    newLevel(victory) {
        if (victory) {
            this.dificultad *= 1.1; // Aumenta la dificultad en un 10% cada vez que se llama a newLevel
        }
        for(let card of this.cartas){
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

        if(!victory && this.dificultad == 1.1){ // Si el jugador perdió no aumenta la dificultad
        this.cartas = [];
        for (let i = 1; i < 11; i++) {                         
            let card = new CardEspada(0, 200, 112.5, 150, Math.round(i * 10) / 10, "diamantes", 1, false, false, true,"");
            this.cartas.push(card);
        }
        for (let i = 1; i < 11; i++) {                        // Escalabilidad de la dificultad un 10%
            let card = new CardEnemie(0, 200, 112.5, 150, Math.round(i * 10) / 10, "treboles", 1, false, false, true,"");
            this.cartas.push(card);
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardEnemie(0, 200, 112.5, 150, i, "espadas", 1, false, false, true,"");
            this.cartas.push(card);
        }
        for (let i = 1; i < 11; i++) {
            let card = new CardVida(0, 200, 112.5, 150, i, "corazones", 1, false, false, true,"");
            this.cartas.push(card);
        }
    }
    else {
        for(let card of this.cartas){
            if(card.arma || card.enemie){
                card.number = Math.floor(card.number *=this.dificultad);
            }
        }
        for(let card of this.cartas){
                        this.probabilidadhabilidad = Math.floor(Math.random() * (10-0+1)+0);
                        if(this.probabilidadhabilidad <=9){
                            this.habilidadProb = Math.floor(Math.random() * (10-0+1)+0);
                            if(card.arma){
                                if(this.habilidadProb >= 0 && this.habilidadProb <= 4){
                                    card.habilidad = "enemieslos";
                                }
                                else if(this.habilidadProb >= 5 && this.habilidadProb <= 7){
                                    card.habilidad = "killhealth";
                                }
                                else if(this.habilidadProb >= 8 && this.habilidadProb <= 9){
                                    card.habilidad = "passEnemie";
                                }
                                else{
                                    card.habilidad = "healthpassEnemie";
                                }
                            }
                        }
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
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    //Loads the font Ethnocenmtric
    const ethnocentric = new FontFace('Ethnocentric', 'url(assets/fonts/Ethnocentric-Regular.otf)');
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
