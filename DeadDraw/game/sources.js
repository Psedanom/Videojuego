/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the sources for the images and audios used in the game

*/

const imgCorazon = new Image();
imgCorazon.src = '../assets/corazon.png';

const imgRombos = new Image();
imgRombos.src = '../assets/rombos.png';

const imgPicas = new Image();
imgPicas.src = '../assets/picas.png';

const imgDialogue = new Image();
imgDialogue.src = '../assets/dialogue_box.png';

const imgMaton = new Image();
imgMaton.src = '../assets/maton.png';


// Looping audio element played while dialogue text is scrolling onto screen
const dialogueSound = document.createElement("audio");
dialogueSound.src = "../assets/sound/textscroll.wav";