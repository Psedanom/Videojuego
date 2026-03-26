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
        let healthli = (this.maxHealth/this.health)*this.width;
        ctx.fillStyle = "red";
            ctx.fillRect((this.x),
                         (this.y +1),
                         healthli,
                         this.height -2);
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

class cards {
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
    /*
    defx(x){
        this.x = x;
    }*/
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
class Game{
    constructor(canvas) {
        this.cards = [];
        this.createEventListeners();
        this.initObjects();
        this.canvas = canvas;
        this.clicked = false;
        this.tablaVacia = false;
        this.ctab = 4;
        this.cantidadCartasTablero = 4;
    }

    initObjects(){
        for (let i = 0; i < 10;i++){
            let card = new cards(0, 200, 112.5, 150,10, "diamantes",1,false,false,true);
            this.cards.push(card);
        }
        for (let i = 0; i < 10;i++){
            let card = new cards(0, 200, 112.5, 150, Math.floor(Math.random() * (10 - 1) + 1), "treboles",1,false,false,true);
            this.cards.push(card);
        }
        for (let i = 0; i < 10;i++){
            let card = new cards(0, 200, 112.5, 150, Math.floor(Math.random() * (10 - 1) + 1), "espadas",1,false,false,true);
            this.cards.push(card);
        }
        for (let i = 0; i < 10;i++){
            let card = new cards(0, 200, 112.5, 150, Math.floor(Math.random() * (10 - 1) + 1), "corazones",1,false,false,true);
            this.cards.push(card);
        }
        this.contador = new tiempo();
        this.armas = new Botones(100,470,120,170);
        this.usadas = new Botones(650,400,120,170);
        this.playerHealth = new HealthBar(15,15,100,20,20);
        shuffle(this.cards); 
        
    }
    createEventListeners() {
        canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for (let card of this.cards) {
                card.isHovered = card.contains(mouseX, mouseY);
            }
            this.armas.isHovered = this.armas.tocando(mouseX,mouseY);
            this.usadas.isHovered = this.usadas.tocando(mouseX,mouseY);
        });
        canvas.addEventListener('click', (event) =>{
            for(let card of this.cards){
                if(card.isHovered && !this.clicked && !card.used){
                    this.clicked = true;
                    this.card_clicked = card;
                    break;
                }
                else if(this.armas.isHovered && this.clicked){
                    this.xar = this.armas.x;
                    this.yar = this.armas.y;
                    this.card_clicked.click(this.xar,this.yar);
                    this.clicked = false;
                    this.card_clicked.inboard = false;
                    this.ctab -=1;
                    break;
                }
                else if(this.usadas.isHovered && this.clicked){
                    this.xus = this.usadas.x;
                    this.yus = this.usadas.y;
                    this.card_clicked.click(this.xus,this.yus);
                    this.clicked = false;
                    this.card_clicked.inboard = false;
                    this.ctab -=1;
                    break;
                }
                    
            }
        });
    }
    update(deltaTime){

        if(this.ctab <= 1){
            for(let card of this.cards ){
                if(!card.used && card.inboard){
                    card.x = 100;
                    this.tablaVacia = true;
                     
                }
            }
            this.ctab = 4;
        }
        for(let card of this.cards ){
            card.update();
        }
        this.contador.contador(deltaTime);
    } 
    draw(ctx){
        this.armas.draw(ctx);
        this.usadas.draw(ctx);
        this.playerHealth.draw(ctx);
        this.num = 0;
        let posicion = 100;
        if(this.tablaVacia && !terminado){
            this.cantidadCartasTablero += 3
            posicion = 262.5
            this.tablaVacia = false
        }
        
        for(let card of this.cards){
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
