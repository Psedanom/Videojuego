/*
Emiliano Alighieri Targiano
Jonathan Uriel Anzures García
Pablo Sedano Morlett

This file contains the dialogue that the player will encounter

*/

const preGameDialogue = [                     // LIMITE DE CARACTERES EN DONDE EMPIEZA el "//"
    `You can't talk to the boss without\n
     going through us first.`,
    `Nothing personal kid,\n
     but we can't let you through.`,
    `If you want to get to the boss,\n
     you'll have to go through us.` , 
    `Think you can defeat us? think again.`,
    `You won't defeat us.`,
    `You don't stand a chance against us.`
];

const preRunDialogue = [                      // LIMITE DE CARACTERES EN DONDE EMPIEZA el "//"

    `You are a retired mercenary\nwho owes credits to the wrong people.`,
    `They took your family heirlooms your most\nprized possessions and now they want you\nto pay up.`,
    `You've been tracking them for months,\nand you finally have a lead\non their location.`,
    `As you approach the hideout, you realize\nthat it is heavily guarded by several\ngroups of mercenaries.`,
    `You know that you will have to fight your\nway through them to get to the criminal.`,
    `You take a deep breath and prepare\nfor battle.`,
    `Are you ready to DeadDraw?`

];

// En esta ciudad todo se arregla jugando cartas

// Dialogues displayed when the player clicks a card for the first time during level 0.
// Each card type has three possible lines picked at random.
const cartaDialogueArma = [
    `Use me to fight!\nI'll help you reduce\nthe damage you take.`,
    `Together we are unstoppable.\nLet me fight for you.`,
    `I'm your weapon.\nTrust me and we'll defeat them all.`
];

const cartaDialogueEnemie = [
    `Haha! You really think\nyou can beat me? Think again.`,
    `You don't stand a chance\nagainst me. Give up now.`,
    `You'll never defeat me.\nI'm stronger than you can imagine.`
];

const cartaDialogueVida = [
    `I'm here to heal\nyour wounds. Let me restore you.`,
    `Don't give up yet.\nLet me mend your injuries.`,
    `With my power you'll fight again.\nRest for a moment.`
];