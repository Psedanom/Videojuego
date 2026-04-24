/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the special card loot that the player can get after defeating the whole deck

template:

{
        nombre: "Card name",
        ventaja: "Card's advantage",
        desventaja: "Card's disadvantage",
        makeCard() {
            return new <Type of card or cards>
        },

        sideEffects() {

            return [
                new 
                <Type of card or cards>
            ]
        }
    }



*/ 


const cardPool = [
    {
        nombre: "Vial de Vida",
        ventaja: "+20 de vida",
        desventaja: "+2 enemigos",
        makeCard() {
            return new CardVida(0, 200, cardWidth, cardHeight, 20, "corazones", 1, false, false, true, "",imgCorazon)
        },
        sideEffects() {

            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, "", imgPicas)
            ]
        }
    },
    {
        nombre: "Gran Espada",
        ventaja: "12 daño",
        desventaja: "+3 enemigos",
        makeCard() {
            return new CardEspada(0, 200, cardWidth, cardHeight, 12, "diamantes", 1, false, false, true, "", imgRombos)
        },
        sideEffects() {
            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, "", imgPicas),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles)
            ]
        }

    },
    {
        nombre: "Gran Espada 2.0",
        ventaja: "15 daño",
        desventaja: "+5 enemigos",
        makeCard() {
            return new CardEspada(0, 200, cardWidth, cardHeight, 15, "diamantes", 1, false, false, true, "", imgRombos)
        },  
        sideEffects() {
            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, "", imgPicas),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "espadas", 1, false, false, true, "", imgPicas),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles)
            ]
        }
    }
];