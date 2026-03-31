"use strict";

const canvasWidth = 800;
const canvasHeight = 700;

let oldTime =0;

let ctx;
let game;
let terminado = false;


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



class tiempo{
    constructor(){
        this.tiempolim = 300 * 1000;
        this.time = 0;
    }
    
    contador(deltatime){
        this.time = deltatime;
        this.tiempolim -= this.time;
    }
    draw(ctx){
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "left";
            ctx.fillText("Tiempo restante " + Math.floor(this.tiempolim/1000), canvasWidth - 250, 15);
    }
}
class HealthBar{
    constructor(x, y, width, height, maxHealth){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }
    draw(ctx){
        ctx.fillStyle = "black";
            ctx.fillRect((this.x),
                         (this.y),
                         this.width,
                         this.height);
        let healthli = (this.health/this.maxHealth)*this.width;
        ctx.fillStyle = "red";
            ctx.fillRect((this.x),
                         (this.y +1),
                         healthli,
                         this.height -2);
        ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.health, this.width -35, this.height +12);
    }
}
class Botones{
    constructor(x,y,width,height){
        this.x = x
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(ctx){
        ctx.fillStyle = "white";
            ctx.fillRect((this.x),
                         (this.y),
                         this.width,
                         this.height);
    }
    tocando(mx,my){
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
}

class cards{
    constructor(x, y, width, height, number, type,scale,used,inboard,enMazo) {
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
    }
    draw(ctx) {
        if(this.type == "diamantes"){
             ctx.fillStyle = "orange";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        }
        if(this.type == "treboles"){
             ctx.fillStyle = "green";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        }
        if(this.type == "espadas"){
             ctx.fillStyle = "black";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        }
        if(this.type == "corazones"){
             ctx.fillStyle = "red";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        }
    }
    contains(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
    
    defx(x){
        this.x = x;
    }
    update(){
        if (this.isHovered) {
            this.scale = 1.2;
        } else {
            this.scale = 1;
        }
    }
    click(x,y){
        this.x = x;
        this.y = y;
        this.used = true;
        
    }

}

class CardEnemie extends cards{
    draw(ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.number, this.x +20, this.y+20);
    }
    actionUse(health){
        health-=this.number;
        return health;
    }
    actionWeapon(health,num){
        this.daño = this.number -num;
        if(this.daño <0){
            return health;
        }
        health -= this.daño;
        return health;
    }
    arma(){
        return false;
    }
    enemie(){
        return true;
    }
}
class CardVida extends cards{
    draw(ctx) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.number, this.x +20, this.y+20);
    }
    actionUse(health){
        if(health < 20){
            if(health + this.number > 20){
                health = 20;
            }
            else{
                health += this.number;
            }
        }
        return health;
    }
    arma(){
        return false;
    }
}

class CardEspada extends cards{
    draw(ctx) {
            ctx.fillStyle = "orange";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
        ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.number, this.x +20, this.y+20);
    }
    recallNum(){
        return this.number;
    }
    arma(){
        return true;
    }
}

class Game{
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
    }

    initObjects(){
        
        for (let i = 1; i <11;i++){                         
            let card = new CardEspada(0, 200, 112.5, 150,i,  "diamantes",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){                       
            let card = new CardEnemie(0, 200, 112.5, 150, i , "treboles",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){
            let card = new CardEnemie(0, 200, 112.5, 150, i, "espadas",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){
            let card = new CardVida(0, 200, 112.5, 150, i, "corazones",1,false,false,true);
            this.cartas.push(card);
        }
        this.contador = new tiempo();
        this.armas = new Botones(100,470,120,170);
        this.usadas = new Botones(650,400,120,170);
        this.playerHealth = new HealthBar(15,15,100,20,20);
        shuffle(this.cartas); 
        
    }
    createEventListeners() {
        //DEBUG: p nuevo nivel con victoria, P nuevo nivel con derrota
        document.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.newLevel(true);
                console.log("new level victory")
            }
            if (event.key === 'P') {
                this.newLevel(false);
                console.log("new level defeat")
            }
        });
        canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for (let card of this.cartas) {
                card.isHovered = card.contains(mouseX, mouseY);
            }
            this.armas.isHovered = this.armas.tocando(mouseX,mouseY);
            this.usadas.isHovered = this.usadas.tocando(mouseX,mouseY);
        });
        canvas.addEventListener('click', (event) =>{
            for(let card of this.cartas){
                if(card.isHovered  && !card.used){
                    this.clicked = true;
                    this.card_clicked = card;
                    break;
                }
                else if(this.armas.isHovered && this.clicked){
                    if(this.card_clicked.arma()){
                        if(this.hayArma){
                            this.clicked = false;
                            this.card_clicked.used = false;
                        }
                        else{
                            this.card_clicked.used = true;
                            this.cartasArma.push(this.card_clicked);
                            this.xar = this.armas.x;
                            this.yar = this.armas.y;
                            this.card_clicked.click(this.xar,this.yar);
                            this.clicked = false;
                            this.card_clicked.inboard = false;
                            this.ctab -=1;
                            this.hayArma = true;
                        }
                    }
                    else if(this.hayArma && this.card_clicked.enemie()){
                        this.card_clicked.used = true;
                        this.cartasArma.push(this.card_clicked);
                        for(let cartasrma of this.cartasArma){
                            if(cartasrma.arma()){
                                this.numberArma = cartasrma.number;
                            }
                        }
                        this.playerHealth.health = this.card_clicked.actionWeapon(this.playerHealth.health,this.numberArma);
                        this.xar = this.armas.x;
                        this.yar = this.armas.y;
                        this.card_clicked.click(this.xar,this.yar);
                        this.clicked = false;
                        this.card_clicked.inboard = false;
                        this.ctab -=1;
                    }
                    console.log(this.hayArma);

                    break;
                }
                else if(this.usadas.isHovered && this.clicked){
                    this.xus = this.usadas.x;
                    this.yus = this.usadas.y;
                    this.card_clicked.click(this.xus,this.yus);
                    this.clicked = false;
                    this.card_clicked.inboard = false;
                    this.ctab -=1;
                    this.playerHealth.health = this.card_clicked.actionUse(this.playerHealth.health);
                    break;
                }
                    
            }
        });
    }
    update(deltaTime){

        if(this.ctab <= 1){
            for(let card of this.cartas ){
                if(!card.used && card.inboard){
                    card.x = 100;
                    this.tablaVacia = true;
                }
            }
            terminado = false;
            this.ctab = 4;
        }
        for(let card of this.cartas ){
            card.update();
        }
        this.contador.contador(deltaTime);

        this.num = 0;
        let posicion = 100;
        if(this.tablaVacia && !terminado){
            this.cantidadCartasTablero += 3
            posicion = 262.5
        }
        
        for(let card of this.cartas){
            if(this.num < this.cantidadCartasTablero){
                if(!card.used && !card.inboard){
                    card.x = posicion;
                    posicion += 162.5;
                    card.inboard = true;
                }
                card.draw(ctx);
                this.num+=1;
            }
         }
        this.tablaVacia = false;
        terminado = true;

        // Verifica si el juego ha terminado
        if (this.isGameOver()) {
            console.log("Partida terminada");
            let reason = this.gameOverReason();
            switch(reason) {
                case 1:
                    console.log("Partida terminada con codigo: " + reason);
                    console.log("Has perdido por quedarte sin salud.");
                    this.newLevel(false);
                    
                    break;
                case 2:
                    console.log("Partida terminada con codigo: " + reason);
                    console.log("Has perdido por quedarte sin tiempo.");
                    this.newLevel(false);
                    break;
                case 3:
                    console.log("Partida terminada con codigo: " + reason);
                    console.log("Has ganado por usar todas las cartas.");
                    this.newLevel(true);
                    break;
            }
            


        }
    }
    // El juego termina cuando el jugador se queda sin cartas
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
        else if (this.cartas.every(card => card.used)){
            return 3; // El jugador ganó por usar todas las cartas
        }
    }

    draw(ctx){
        this.armas.draw(ctx);
        this.usadas.draw(ctx);
        this.playerHealth.draw(ctx);
        
        this.contador.draw(ctx);
    }

    // Regenera el tablero con nuevas cartas y si se ha ganado entonces aumenta la dificultad
    //  victory determina si el jugador gano o perdio, booleano
    newLevel(victory){
        if(victory){
        this.dificultad *= 1.1; // Aumenta la dificultad en un 10% cada vez que se llama a newLevel
        }

        this.cartas = [];
        this.cartasArma = [];
        this.hayArma = false;
        this.clicked = false;
        this.ctab = 4;
        this.cantidadCartasTablero = 4;
        this.tablaVacia = false;
    for (let i = 1; i <11;i++){                         // Escalabilidad de la dificultad un 10%
            let card = new CardEspada(0, 200, 112.5, 150,Math.round(i * this.dificultad * 10) / 10, "diamantes",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){                        // Escalabilidad de la dificultad un 10%
            let card = new CardEnemie(0, 200, 112.5, 150, Math.round(i * this.dificultad * 10) / 10, "treboles",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){
            let card = new CardEnemie(0, 200, 112.5, 150, i, "espadas",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){
            let card = new CardVida(0, 200, 112.5, 150, i, "corazones",1,false,false,true);
            this.cartas.push(card);
        }
        this.contador = new tiempo();
        this.armas = new Botones(100,470,120,170);
        this.usadas = new Botones(650,400,120,170);
        this.playerHealth = new HealthBar(15,15,100,20,20);
        shuffle(this.cartas); 
}
}
function drawScene(newTime) {
    let deltaTime = newTime-oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.draw(ctx);
    game.update(deltaTime);
    
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

function main(){

    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game(canvas);

    drawScene(0);
}
