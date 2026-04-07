

const cardPool = [
    {
        nombre: "Vial de Vida",
        ventaja: "+20 de vida",
        desventaja: "+2 enemigos",
        makeCard() {
            return new CardVida(0, 200, 112.5, 150, 20, "corazones", 1, false, false, true, "")
        },

        sideEffects() {

            return [
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, "")
            ]
        }
    },
    {
        nombre: "Gran Espada",
        ventaja: "12 daño",
        desventaja: "+3 enemigos",
        makeCard() {
            return new CardEspada(0, 200, 112.5, 150, 12, "diamantes", 1, false, false, true, "")
        },
        sideEffects() {
            return [
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "")
            ]
        }

    },
    {
        nombre: "Gran Espada 2.0",
        ventaja: "15 daño",
        desventaja: "+5 enemigos",
        makeCard() {
            return new CardEspada(0, 200, 112.5, 150, 15, "diamantes", 1, false, false, true, "")
        },
        sideEffects() {
            return [
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, ""),
                new CardEnemie(0, 200, 112.5, 150, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "")
            ]
        }
    }
];