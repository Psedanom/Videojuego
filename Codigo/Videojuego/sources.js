/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the sources for the images and audios used in the game

*/

// ===================== Blank image =====================
const blank = new Image();
blank.src = '../../Videojuego/assets/blank.png';
// ===================== Images =====================
// Card images
const imgCorazon = new Image();
imgCorazon.src = "../../Videojuego/assets/corazon.png";

const imgRombos = new Image();
imgRombos.src = '../../Videojuego/assets/rombos.png';

const imgPicas = new Image();
imgPicas.src = '../../Videojuego/assets/picas.png';

const imgTreboles = new Image();
imgTreboles.src = '../../Videojuego/assets/trebol.png';

const imgDialogue = new Image();
imgDialogue.src = '../../Videojuego/assets/dialogue_box.png';

// ===================== Center images =====================

// Enemies
const imgFemaleThug = new Image();
imgFemaleThug.src = '../../Videojuego/assets/cardCenter/FemaleThug.png';

const imgMaleThug = new Image();
imgMaleThug.src = '../../Videojuego/assets/cardCenter/MaleThug.png';

const imgHeavy = new Image();
imgHeavy.src = '../../Videojuego/assets/cardCenter/Heavy.png';

const imgHacker = new Image();
imgHacker.src = '../../Videojuego/assets/cardCenter/Hacker.png';

const centerEnemyImages = [imgFemaleThug, imgMaleThug, imgHeavy, imgHacker];


// Weapons
const imgSMG = new Image();
imgSMG.src = '../../Videojuego/assets/cardCenter/SMG.png';

const imgCaster = new Image();
imgCaster.src = '../../Videojuego/assets/cardCenter/Caster.png';

const imgSword = new Image();
imgSword.src = '../../Videojuego/assets/cardCenter/Sword.png';

const imgRifle = new Image();
imgRifle.src = '../../Videojuego/assets/cardCenter/Rifle.png';

const centerWeaponImages = [imgSMG, imgCaster, imgSword, imgRifle];

// Medkit
const imgMedkit = new Image();
imgMedkit.src = '../../Videojuego/assets/cardCenter/Medkit.png';

const imgMaton = new Image();
imgMaton.src = '../../Videojuego/assets/maton.png';

// ===================== Card Abilities =====================

const imgCursedEnemie = new Image();
imgCursedEnemie.src = '../../Videojuego/assets/cardAbilities/cursedEnemie.png';

const imgEnemieslos = new Image();
imgEnemieslos.src = '../../Videojuego/assets/cardAbilities/enemieslos.png';

const imgGoldStealer = new Image();
imgGoldStealer.src = '../../Videojuego/assets/cardAbilities/goldStealer.png';

const absoluteDamage = new Image();
absoluteDamage.src = '../../Videojuego/assets/cardAbilities/absoluteDamage.png';

const imgHealthpassEnemie = new Image();
imgHealthpassEnemie.src = '../../Videojuego/assets/cardAbilities/healthpassEnemie.png';

const imgKillHealth = new Image();
imgKillHealth.src = '../../Videojuego/assets/cardAbilities/killHealth.png';

const imgPassEnemie = new Image();
imgPassEnemie.src = '../../Videojuego/assets/cardAbilities/passEnemie.png';

const imgTimeEater = new Image();
imgTimeEater.src = '../../Videojuego/assets/cardAbilities/timeEater.png';

// ===================== Decks =====================

const classicDeck = new Image();
classicDeck.src = '../../Videojuego/assets/decks/classicDeck.png';

const difficultDeck = new Image();
difficultDeck.src = '../../Videojuego/assets/decks/difficultDeck.png';

const hardDeck = new Image();
hardDeck.src = '../../Videojuego/assets/decks/hardDeck.png';

const noviceDeck = new Image();
noviceDeck.src = '../../Videojuego/assets/decks/noviceDeck.png';

// ===================== Sound effects =====================

// Looping audio element played while dialogue text is scrolling onto screen
const dialogueSound = document.createElement("audio");
dialogueSound.src = "../../Videojuego/assets/sound/textscroll.wav";

// Sound effects played when hovering over a button
const cardSelected = document.createElement("audio");
cardSelected.src = "../../Videojuego/assets/sound/cardSelected.ogg";
cardSelected.volume = 0.5;

const hoverSound = document.createElement("audio");
hoverSound.src = "../../Videojuego/assets/sound/menuHover.mp3";
hoverSound.volume = 0.3;

const skipRound = document.createElement("audio");
skipRound.src = "../../Videojuego/assets/sound/BUTIN4.wav";
skipRound.volume = 0.5;

const cardPlaces = document.createElement("audio");
cardPlaces.src = "../../Videojuego/assets/sound/BUTIN3.wav";
cardPlaces.volume = 0.5;

const cardSound = document.createElement("audio");
cardSound.src = "../../Videojuego/assets/sound/card1.ogg";
cardSound.volume = 0.5;

const playingHover = document.createElement("audio");
playingHover.src = "../../Videojuego/assets/sound/playingHover.wav";
playingHover.volume = 0.3;

const playingSelect = document.createElement("audio");
playingSelect.src = "../../Videojuego/assets/sound/playingSelect.wav";
playingSelect.volume = 0.3

const menuSelect = document.createElement("audio");
menuSelect.src = "../../Videojuego/assets/sound/menuSelect.wav";
menuSelect.volume = 0.7;

// ===================== Music =====================

// Looping music
const menuMusic = document.createElement("audio");
menuMusic.src = "../../Videojuego/assets/sound/music.mp3";
menuMusic.volume = 0;
menuMusic.loop = true;

// ===================== LootBoxes =====================

const lootboxBlue = new Image();
lootboxBlue.src = '../../Videojuego/assets/lootboxes/LootboxBlue.png';

const lootboxPurple = new Image();
lootboxPurple.src = '../../Videojuego/assets/lootboxes/LootboxPurple.png';

const lootboxYellow = new Image();
lootboxYellow.src = '../../Videojuego/assets/lootboxes/LootboxYellow.png';

const lootboxGreen = new Image();
lootboxGreen.src = '../../Videojuego/assets/lootboxes/LootboxGreen.png';



