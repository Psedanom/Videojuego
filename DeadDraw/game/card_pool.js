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
        nombre: "Life Saver",
        ventaja: "+20 HP",
        desventaja: "+2 enemies",
        makeCard() {
            return new CardVida(0, 200, cardWidth, cardHeight, 20, "corazones", 1, false, false, true, "", imgCorazon, undefined, undefined, imgMedkit)
        },
        sideEffects() {

            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "picas", 1, false, false, true, "", imgPicas)
            ]
        }
    },
    {
        nombre: "Biggie Sword",
        ventaja: "12 DMG",
        desventaja: "+3 Enemies",
        makeCard() {
            return new CardEspada(0, 200, cardWidth, cardHeight, 12, "diamantes", 1, false, false, true, "", imgRombos, undefined, undefined, imgSword)
        },
        sideEffects() {
            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "picas", 1, false, false, true, "", imgPicas),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles)
            ]
        }

    },
    {
        nombre: "Big Biggie Sword",
        ventaja: "15 DMG",
        desventaja: "+5 Enemies",
        makeCard() {
            return new CardEspada(0, 200, cardWidth, cardHeight, 15, "diamantes", 1, false, false, true, "", imgRombos, undefined, undefined, imgSword)
        },
        sideEffects() {
            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "picas", 1, false, false, true, "", imgPicas),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "picas", 1, false, false, true, "", imgPicas),
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "treboles", 1, false, false, true, "", imgTreboles)
            ]
        }
    },
    {
        nombre: "The Big Mace",
        ventaja: "Reduces all enemies HP to 1",
        desventaja: "Adds a cursed enemy to the deck",
        makeCard() {
            return new CardEspada(0, 200, cardWidth, cardHeight, 1, "diamantes", 1, false, false, true, "enemieslos", imgRombos, undefined, undefined, imgSMG)
        },
        sideEffects() {
            return [
                new CardEnemie(0, 200, cardWidth, cardHeight, Math.floor(Math.random() * 10) + 1, "picas", 1, false, false, true, "cursedEnemy", imgPicas)
            ]
        }
    }
]