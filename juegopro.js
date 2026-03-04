"use strict";

const canvasWidth = 800;
const canvasHeight = 600;

let ctx;
let game;


class cards {
    constructor(x, y, width, height, number, type,scale) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.number = number;
        this.type = type;
        this.scale = scale;
    }
    draw(ctx , pos) {
        ctx.fillStyle = "blue";
            ctx.fillRect((this.x),
                         (this.y),
                         this.width * this.scale,
                         this.height* this.scale);
    }
    contains(mx, my) {
        return mx >= this.x && mx <= this.x + this.width &&
               my >= this.y && my <= this.y + this.height;
    }
    defx(x){
        this.x = x;
    }
    update(){
        if (this.isHovered) {
            this.scale = 1.2;
        } else {
            this.scale = 1.0;
        }
    }
    click(){
        this.y = 450;
    }
}
class Game{
    constructor(canvas) {
        this.cards = [];
        this.createEventListeners();
        this.initObjects();
        this.canvas = canvas;
    }

    initObjects(){
        for (let i = 0; i < 4;i++){
            let card = new cards(0, 200, 112.5, 150, 1, "normal",1);
            this.cards.push(card);
        }
    }
    createEventListeners() {
        canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for (let card of this.cards) {
                card.isHovered = card.contains(mouseX, mouseY);
            }
        });
        canvas.addEventListener('click', (event) =>{
            for(let card of this.cards){
                if(card.isHovered){
                    card.click();
                }
            }
        });
    }
    update(){
        for(let card of this.cards){
            card.update();
            
        }

    }

    draw(ctx){
        let num = 0;
        let pos = 100;
        for(let card of this.cards){
            if(num<4){
                card.defx(pos);
                card.draw(ctx,pos);
                pos += 162.5;
                num+=1;
            }
        }
    }
}

function drawScene() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update();
    game.draw(ctx);
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
