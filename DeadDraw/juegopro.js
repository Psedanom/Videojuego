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
            let card = new CardEspada(0, 200, 112.5, 150,i, "diamantes",1,false,false,true);
            this.cartas.push(card);
        }
        for (let i = 1; i <11;i++){
            let card = new CardEnemie(0, 200, 112.5, 150, i, "treboles",1,false,false,true);
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
        canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for (let card of this.cartas) {
                if(!card.used)
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
                            this.card_clicked.used = true;
                            for(let i = 0; i=this.cartasArma.length; i++){
                                for(let cartas of this.cartasArma){
                                    cartas.click(this.xus,this.yus);
                                }
                                this.cartasArma.pop();
                            }
                            this.cartasArma.push(this.card_clicked);
                            this.xar = this.armas.x;
                            this.yar = this.armas.y;
                            this.card_clicked.click(this.xar,this.yar);
                            this.clicked = false;
                            this.card_clicked.inboard = false;
                            this.ctab -=1;
                            this.hayArma = true;
                            this.card_arma.click(this.xus,this.yus);
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
                            this.card_arma = this.card_clicked;
                            this.hayArma = true;
                        }
                        this.posicion = 20;
                        this
                    }
                    else if(this.hayArma && this.card_clicked.enemie()){
                        if(this.numeroAnterior>this.card_clicked.number || this.cartasArma.length < 2){
                            this.card_clicked.used = true;
                            this.cartasArma.push(this.card_clicked);
                            for(let cartasrma of this.cartasArma){
                                if(cartasrma.arma()){
                                    this.numberArma = cartasrma.number;
                                }
                            }
                            this.playerHealth.health = this.card_clicked.actionWeapon(this.playerHealth.health,this.numberArma);
                            this.xar = this.armas.x +this.posicion;
                            this.yar = this.armas.y;
                            this.card_clicked.click(this.xar,this.yar);
                            this.clicked = false;
                            this.card_clicked.inboard = false;
                            this.ctab -=1;
                        }
                        else{
                            this.clicked = false;
                        }
                        this.numeroAnterior = this.card_clicked.number;
                        this.posicion += 20;
                        this.card_clicked.draw(ctx);
                    }
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
    } 
    draw(ctx){
        this.armas.draw(ctx);
        this.usadas.draw(ctx);
        this.playerHealth.draw(ctx);
        
        this.contador.draw(ctx);
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
