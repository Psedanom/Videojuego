/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

Animated card suits background effect — suits fade in and out randomly across the screen.
*/

function cardSuitsBackground() {
    const canvas = document.getElementById('canvas3');
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const suits = ['♠', '♥', '♦', '♣'];
    const particles = [];
    const MAX_PARTICLES = 18;

    class SuitParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x      = Math.random() * canvas.width;
            this.y      = Math.random() * canvas.height;
            this.suit   = suits[Math.floor(Math.random() * suits.length)];
            this.size   = 20 + Math.random() * 60;       // entre 20px y 80px
            this.alpha  = 0;                              // empieza invisible
            this.state  = 'in';                           // 'in' | 'hold' | 'out'
            this.speed  = 0.008 + Math.random() * 0.012; // velocidad de fade
            this.holdTimer = 0;
            this.holdMax   = 60 + Math.random() * 120;   // cuántos frames se queda visible

            // rojos para corazones/diamantes, oscuro para picas/tréboles
            const isRed = this.suit === '♥' || this.suit === '♦';
            this.color  = isRed ? '#e8002d' : '#aaaaaa';
        }

        update() {
            if (this.state === 'in') {
                this.alpha += this.speed;
                if (this.alpha >= 0.6) {
                    this.alpha = 0.6;
                    this.state = 'hold';
                }
            } else if (this.state === 'hold') {
                this.holdTimer++;
                if (this.holdTimer >= this.holdMax) {
                    this.state = 'out';
                }
            } else if (this.state === 'out') {
                this.alpha -= this.speed;
                if (this.alpha <= 0) {
                    this.reset(); // renace en posición nueva
                }
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.font        = `${this.size}px monospace`;
            ctx.fillStyle   = this.color;
            ctx.fillText(this.suit, this.x, this.y);
            ctx.restore();
        }
    }

    // crea las partículas escalonadas para que no aparezcan todas a la vez
    for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = new SuitParticle();
        p.alpha      = Math.random() * 0.6;   // alpha inicial aleatorio
        p.holdTimer  = Math.floor(Math.random() * p.holdMax);
        p.state      = 'hold';
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}