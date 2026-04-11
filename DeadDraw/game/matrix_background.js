function matrixBackground() {
        
        const canvas2 = document.getElementById("canvas2");
        const ctx2 = canvas2.getContext("2d");

        canvas2.width = window.innerWidth;
        canvas2.height = window.innerHeight;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const lettersArray = letters.split("");

        const fontSize = 16;
        const columns = canvas2.width / fontSize;

        const drops = [];
        for (let i = 0; i < columns; i++) drops[i] = 1;

        function draw() {
            ctx2.fillStyle = "rgba(0,0,0,0.05)";
            ctx2.fillRect(0, 0, canvas2.width , canvas2.height);

            ctx2.fillStyle = "#e8002d";
            ctx2.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
                ctx2.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas2.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 30);
    }