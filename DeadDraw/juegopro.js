"use strict";

const canvasWidth = 800;
const canvasHeight = 700;

let ctx;
let game;
let terminado = false;
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
class cubitos{
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
    constructor(x, y, width, height, number, type,scale,used,inboard,inma) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.number = number;
        this.type = type;
        this.scale = scale;
        this.used = used;
        this.inboard = inboard;
        this.inma = inma;
    }
    draw(ctx) {
        ctx.fillStyle = "red";
            ctx.fillRect(this.x,
                         this.y,
                         this.width * this.scale,
                         this.height* this.scale);
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
class Game{
    constructor(canvas) {
        this.cards = [];
        this.createEventListeners();
        this.initObjects();
        this.canvas = canvas;
        this.clicked = false;
        this.cnt = 0;
        this.tabvas = false;
        this.ctab = 4;
        this.cancar = 4;
    }

    initObjects(){
        for (let i = 0; i < 8;i++){
            let card = new cards(0, 200, 112.5, 150, 1, "normal",1,false,false,true);
            this.cards.push(card);
        }
        this.armas = new cubitos(100,470,120,170);
        this.usadas = new cubitos(650,400,120,170);
        this.playerh = new HealthBar(15,15,100,20,20);
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
    update(){
        if(this.ctab <= 1){
            for(let card of this.cards ){
                if(!card.used && card.inboard){
                    card.x = 100;
                    this.tabvas = true;
                    terminado = false;
                }
            }
            this.ctab = 4;
        }
        for(let card of this.cards ){
            card.update();
        }
    } 
    draw(ctx){
        this.armas.draw(ctx);
        this.usadas.draw(ctx);
        this.playerh.draw(ctx);
        this.num = 0;
        let pos = 100;
        if(this.tabvas && !terminado){
            this.cancar += 3
            pos = 262.5
            this.tabvas = false
        }
        
        for(let card of this.cards){
            if(this.num < this.cancar){
                if(!card.used && !card.inboard){
                    card.x = pos;
                    pos += 162.5;
                    card.inboard = true;
                }
                card.draw(ctx);
                this.num+=1;
            }
         }
        this.tabvas = false;
        terminado = true;
    }
}
function drawScene() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.draw(ctx);
    game.update();
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
