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

const imgTreboles = new Image();
imgTreboles.src = '../game/assets/trebol.png';

const imgDialogue = new Image();
imgDialogue.src = '../game/assets/dialogue_box.png';

const imgMaton = new Image();
imgMaton.src = '../game/assets/maton.png';



// Looping audio element played while dialogue text is scrolling onto screen
const dialogueSound = document.createElement("audio");
dialogueSound.src = "../game/assets/sound/textscroll.wav";

const cardSelected = document.createElement("audio");
cardSelected.src = "../game/assets/sound/cardSelected.ogg";
cardSelected.volume = 0.5;

// Sound effects played when hovering over a button
const hoverSound = document.createElement("audio");
hoverSound.src = "../game/assets/sound/menuHover.mp3";
hoverSound.volume = 0.3;

const skipRound = document.createElement("audio");
skipRound.src = "../game/assets/sound/BUTIN4.wav";
skipRound.volume = 0.5;

const cardPlaces = document.createElement("audio");
cardPlaces.src = "../game/assets/sound/BUTIN3.wav";
cardPlaces.volume = 0.5;

const cardSound = document.createElement("audio");
cardSound.src = "../game/assets/sound/card1.ogg";
cardSound.volume = 0.5;

const playingHover = document.createElement("audio");
playingHover.src = "../game/assets/sound/playingHover.wav";
playingHover.volume = 0.3;

const playingSelect = document.createElement("audio");
playingSelect.src = "../game/assets/sound/playingSelect.wav";
playingSelect.volume = 0.3

const menuSelect = document.createElement("audio");
menuSelect.src = "../game/assets/sound/menuSelect.wav";
menuSelect.volume = 0.7;


// Looping music
const menuMusic = document.createElement("audio");
menuMusic.src = "../game/assets/sound/music.mp3";
menuMusic.volume = 0.2;
menuMusic.loop = true;



