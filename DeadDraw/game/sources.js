/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the sources for the images and audios used in the game

*/

const imgCorazon = new Image();
imgCorazon.src = "../game/assets/corazon.png";

const imgRombos = new Image();
imgRombos.src = '../game/assets/rombos.png';

const imgPicas = new Image();
imgPicas.src = '../game/assets/picas.png';

const imgDialogue = new Image();
imgDialogue.src = '../game/assets/dialogue_box.png';

const imgMaton = new Image();
imgMaton.src = '../game/assets/maton.png';


// Looping audio element played while dialogue text is scrolling onto screen
const dialogueSound = document.createElement("audio");
dialogueSound.src = "../game/assets/sound/textscroll.wav";