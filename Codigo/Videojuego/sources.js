/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the sources for the images and audios used in the game

*/

// ===================== Blank image =====================
const blank = new Image();
blank.src = '../game/assets/blank.png';
// ===================== Images =====================
// Card images
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

// ===================== Center images =====================

// Enemies
const imgFemaleThug = new Image();
imgFemaleThug.src = '../game/assets/cardCenter/FemaleThug.png';

const imgMaleThug = new Image();
imgMaleThug.src = '../game/assets/cardCenter/MaleThug.png';

const imgHeavy = new Image();
imgHeavy.src = '../game/assets/cardCenter/Heavy.png';

const imgHacker = new Image();
imgHacker.src = '../game/assets/cardCenter/Hacker.png';

const centerEnemyImages = [imgFemaleThug, imgMaleThug, imgHeavy, imgHacker];


// Weapons
const imgSMG = new Image();
imgSMG.src = '../game/assets/cardCenter/SMG.png';

const imgCaster = new Image();
imgCaster.src = '../game/assets/cardCenter/Caster.png';

const imgSword = new Image();
imgSword.src = '../game/assets/cardCenter/Sword.png';

const imgRifle = new Image();
imgRifle.src = '../game/assets/cardCenter/Rifle.png';

const centerWeaponImages = [imgSMG, imgCaster, imgSword, imgRifle];

// Medkit
const imgMedkit = new Image();
imgMedkit.src = '../game/assets/cardCenter/Medkit.png';

const imgMaton = new Image();
imgMaton.src = '../game/assets/maton.png';

// ===================== Card Abilities =====================

const imgCursedEnemie = new Image();
imgCursedEnemie.src = '../game/assets/cardAbilities/cursedEnemie.png';

const imgEnemieslos = new Image();
imgEnemieslos.src = '../game/assets/cardAbilities/enemieslos.png';

const imgGoldStealer = new Image();
imgGoldStealer.src = '../game/assets/cardAbilities/goldStealer.png';

const absoluteDamage = new Image();
absoluteDamage.src = '../game/assets/cardAbilities/absoluteDamage.png';

const imgHealthpassEnemie = new Image();
imgHealthpassEnemie.src = '../game/assets/cardAbilities/healthpassEnemie.png';

const imgKillHealth = new Image();
imgKillHealth.src = '../game/assets/cardAbilities/killHealth.png';

const imgPassEnemie = new Image();
imgPassEnemie.src = '../game/assets/cardAbilities/passEnemie.png';

const imgTimeEater = new Image();
imgTimeEater.src = '../game/assets/cardAbilities/timeEater.png';

// ===================== Decks =====================

const classicDeck = new Image();
classicDeck.src = '../game/assets/decks/classicDeck.png';

const difficultDeck = new Image();
difficultDeck.src = '../game/assets/decks/difficultDeck.png';

const hardDeck = new Image();
hardDeck.src = '../game/assets/decks/hardDeck.png';

const noviceDeck = new Image();
noviceDeck.src = '../game/assets/decks/noviceDeck.png';

// ===================== Sound effects =====================

// Looping audio element played while dialogue text is scrolling onto screen
const dialogueSound = document.createElement("audio");
dialogueSound.src = "../game/assets/sound/textscroll.wav";

// Sound effects played when hovering over a button
const cardSelected = document.createElement("audio");
cardSelected.src = "../game/assets/sound/cardSelected.ogg";
cardSelected.volume = 0.5;

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

// ===================== Music =====================

// Looping music
const menuMusic = document.createElement("audio");
menuMusic.src = "../game/assets/sound/music.mp3";
menuMusic.volume = 0;
menuMusic.loop = true;

// ===================== LootBoxes =====================

const lootboxBlue = new Image();
lootboxBlue.src = '../game/assets/lootboxes/LootboxBlue.png';

const lootboxPurple = new Image();
lootboxPurple.src = '../game/assets/lootboxes/LootboxPurple.png';

const lootboxYellow = new Image();
lootboxYellow.src = '../game/assets/lootboxes/LootboxYellow.png';

const lootboxGreen = new Image();
lootboxGreen.src = '../game/assets/lootboxes/LootboxGreen.png';



