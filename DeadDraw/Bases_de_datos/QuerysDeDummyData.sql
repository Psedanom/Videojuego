-- Active: 1727878930875@@127.0.0.1@3306@deaddraw

USE DeadDraw;


-- EFFECT (5 rows)
-- id 1  = noeffect          placeholder for base deck cards that have no ability so that it isnt NULL
-- ids 2-5 are the four weapon abilities coded in Game.poolAbilities()
-- IMPORTANT: effects 2-5 must ONLY be linked to diamond (weapon) cards via CardEffect.
--            Hearts (health) and clubs/spades (enemy) cards never receive these effects.

INSERT INTO Effect (name, description, type) VALUES
-- id 1
('noeffect',
 'No special effect; placeholder used for base deck cards with no ability',
 'defense'),
-- id 2   weapon only, probability weight 50 %
('enemieslos',
 'Reduce the value of every enemy currently on the board by 1',
 'attack'),
-- id 3   weapon only, probability weight 30 %
('killhealth',
 'Restore health equal to half this weapon card value when used against an enemy',
 'healing'),
-- id 4   weapon only, probability weight 20 %
('passEnemie',
 'Automatically discard the first board enemy without dealing or taking damage',
 'defense'),
-- id 5   weapon only, rare effect
('healthpassEnemie',
 'Discard the first board enemy and restore health equal to this card full value',
 'healing');



-- PLAYER (30 rows)
-- baseHealth = 20, baseTime = 100 (both DB defaults)

INSERT INTO Player (username, baseHealth, email, password, money, role) VALUES
('admin',       20, 'admin@gmail.com',        '$contrasena1', 9999, 'admin'),
('psedanom',    20, 'pablo@gmail.com',        '$contrasena2',  350, 'player'),
('ealighieri',  20, 'emiliano@gmail.com',     '$contrasena3',  420, 'player'),
('juriel',      20, 'uriel@gmail.com',        '$contrasena4',  280, 'player'),
('GrimDealer',  20, 'grimdealer@gmail.com',   '$contrasena5',  120, 'player'),
('CardShark',   20, 'cardshark@gmail.com',    '$contrasena6',  200, 'player'),
('NeonRogue',   20, 'neonrogue@gmail.com',    '$contrasena7',   75, 'player'),
('DeadEye',     20, 'deadeye@gmail.com',      '$contrasena8',  310, 'player'),
('HighRoller',  20, 'highroller@gmail.com',   '$contrasena9',  450, 'player'),
('Scoundrel',   20, 'scoundrel@gmail.com',    '$contrasena10',  180, 'player'),
('DarkAce',     20, 'darkace@gmail.com',      '$contrasena11',   95, 'player'),
('BloodKnight', 20, 'bloodknight@gmail.com',  '$contrasena12',  230, 'player'),
('VoidWalker',  20, 'voidwalker@gmail.com',   '$contrasena13',  160, 'player'),
('GlitchKing',  20, 'glitchking@gmail.com',   '$contrasena14',  390, 'player'),
('ShadowPlay',  20, 'shadowplay@gmail.com',   '$contrasena15',   55, 'player'),
('IronDraw',    20, 'irondraw@gmail.com',     '$contrasena16',  270, 'player'),
('CrimsonSuit', 20, 'crimsonsuit@gmail.com',  '$contrasena17',  140, 'player'),
('DeathDealer', 20, 'deathdealer@gmail.com',  '$contrasena18',  500, 'player'),
('LuckyStrike', 20, 'luckystrike@gmail.com',  '$contrasena19',   85, 'player'),
('PhantomAce',  20, 'phantomace@gmail.com',   '$contrasena20',  320, 'player'),
('DoubleDown',  20, 'doubledown@gmail.com',   '$contrasena21',  210, 'player'),
('SwiftBlade',  20, 'swiftblade@gmail.com',   '$contrasena22',  175, 'player'),
('MidnightRun', 20, 'midnightrun@gmail.com',  '$contrasena23',   60, 'player'),
('RedJoker',    20, 'redjoker@gmail.com',     '$contrasena24',  405, 'player'),
('SteelHand',   20, 'steelhand@gmail.com',    '$contrasena25',  130, 'player'),
('GhostCard',   20, 'ghostcard@gmail.com',    '$contrasena26',  245, 'player'),
('RuneDealer',  20, 'runedealer@gmail.com',   '$contrasena27',  190, 'player'),
('ChaosHand',   20, 'chaoshand@gmail.com',    '$contrasena28',  305, 'player'),
('NullVoid',    20, 'nullvoid@gmail.com',     '$contrasena29',  151, 'player'),
('LastDraw',    20, 'lastdraw@gmail.com',     '$contrasena30',  225, 'player');



-- CARD (49 rows)
--
-- Base Scoundrel starting deck (38 cards, no CardEffect rows):
--   diamonds  ids  1-10  : CardEspada (weapon)  values 1-10
--   clubs     ids 11-19  : CardEnemie (enemy)   values 1-9   copy 1
--   clubs     ids 20-28  : CardEnemie (enemy)   values 1-9   copy 2
--   hearts    ids 29-38  : CardVida   (health)  values 1-10
--
-- Pool-only reward cards (11 cards, CardEffect rows added below):
--   diamonds  ids 39-44  : CardEspada (weapon)  values 11-16   appear on card-selection screen
--   spades    ids 45-49  : CardEnemie (enemy)   values 2-10    boss/elite enemies (even-valued)
--


INSERT INTO Card (value, suit) VALUES
--  Diamonds (weapon / CardEspada) base deck  ids 1-10 
(1, 'CardEspada'),
(2, 'CardEspada'),
(3, 'CardEspada'),
(4, 'CardEspada'),
(5, 'CardEspada'),
(6, 'CardEspada'),
(7, 'CardEspada'),
(8, 'CardEspada'),
(9, 'CardEspada'),
(10, 'CardEspada'),


--  Clubs (enemy / CardEnemie) first copy  ids 11-19 
(2, 'CardEnemie'),
(3, 'CardEnemie'),
(4, 'CardEnemie'),
(5, 'CardEnemie'),
(6, 'CardEnemie'),
(7, 'CardEnemie'),
(8, 'CardEnemie'),
(9, 'CardEnemie'),
(10, 'CardEnemie'),
(11, 'CardEnemie'),
(12, 'CardEnemie'),
(13, 'CardEnemie'),
(14, 'CardEnemie'),
--  Clubs (enemy / CardEnemie) second copy  ids 20-28 
(2, 'CardEnemie'),
(3, 'CardEnemie'),
(4, 'CardEnemie'),
(5, 'CardEnemie'),
(6, 'CardEnemie'),
(7, 'CardEnemie'),
(8, 'CardEnemie'),
(9, 'CardEnemie'),
(10, 'CardEnemie'),
(11, 'CardEnemie'),
(12, 'CardEnemie'),
(13, 'CardEnemie'),
(14, 'CardEnemie'),
--  Hearts (health / CardVida) base deck  ids 37-45
( 2, 'CardVida'),
( 3, 'CardVida'),
( 4, 'CardVida'),
( 5, 'CardVida'),
( 6, 'CardVida'),
( 7, 'CardVida'),
( 8, 'CardVida'),
( 9, 'CardVida'),
(10, 'CardVida'),

--  Pool-only weapon cards (CardEspada) values 11-16  ids 46-51
(11, 'CardEspada'),
(12, 'CardEspada'),
(13, 'CardEspada'),
(14, 'CardEspada'),
(15, 'CardEspada'),
(16, 'CardEspada'),

--  Pool-only boss/elite enemies (CardEnemie) even values 2-10  ids 52-56
( 2, 'CardEnemie'),
( 4, 'CardEnemie'),
( 6, 'CardEnemie'),
( 8, 'CardEnemie'),
(10, 'CardEnemie');

-- DECK (15 rows)

INSERT INTO Deck (name) VALUES
('base deck'),
('deck 1'),
('deck 2'),
('deck 3'),
('deck 4'),
('deck 5'),
('deck 6'),
('deck 7'),
('deck 8'),
('deck 9'),
('deck 10');
-- LOOTBOX (10 rows)
-- quality 1-5: 1 = common, 3 = rare, 5 = legenda
INSERT INTO Lootbox (cost, quality) VALUES
(50,  1),
(50,  1),
(100, 2),
(100, 2),
(200, 3),
(200, 3),
(350, 4),
(350, 4),
(500, 5),
(500, 5);

-- LOGBOOK (30 rows)
-- Sessions spread over the past few months
INSERT INTO Logbook (idPlayer, connectionTime, disconnectionTime) VALUES
(2,  '2026-01-05 10:00:00', '2026-01-05 10:45:00'),
(3,  '2026-01-05 11:00:00', '2026-01-05 12:10:00'),
(4,  '2026-01-06 09:30:00', '2026-01-06 10:00:00'),
(5,  '2026-01-07 14:00:00', '2026-01-07 14:55:00'),
(6,  '2026-01-08 18:00:00', '2026-01-08 19:20:00'),
(7,  '2026-01-10 20:00:00', '2026-01-10 20:30:00'),
(8,  '2026-01-12 16:00:00', '2026-01-12 17:15:00'),
(9,  '2026-01-14 08:00:00', '2026-01-14 09:00:00'),
(10, '2026-01-15 21:00:00', '2026-01-15 22:40:00'),
(11, '2026-01-18 13:00:00', '2026-01-18 13:50:00'),
(2,  '2026-02-01 10:00:00', '2026-02-01 11:30:00'),
(12, '2026-02-03 15:00:00', '2026-02-03 16:00:00'),
(13, '2026-02-05 19:00:00', '2026-02-05 20:05:00'),
(14, '2026-02-08 10:00:00', '2026-02-08 10:45:00'),
(15, '2026-02-10 22:00:00', '2026-02-10 23:00:00'),
(16, '2026-02-12 09:00:00', '2026-02-12 09:40:00'),
(17, '2026-02-15 17:00:00', '2026-02-15 18:20:00'),
(18, '2026-02-20 11:00:00', '2026-02-20 12:30:00'),
(19, '2026-03-01 14:00:00', '2026-03-01 15:00:00'),
(20, '2026-03-03 20:00:00', '2026-03-03 21:10:00'),
(3,  '2026-03-05 10:00:00', '2026-03-05 11:00:00'),
(21, '2026-03-08 16:00:00', '2026-03-08 17:30:00'),
(22, '2026-03-10 19:00:00', '2026-03-10 19:50:00'),
(23, '2026-03-15 08:00:00', '2026-03-15 09:00:00'),
(24, '2026-03-18 21:00:00', '2026-03-18 22:20:00'),
(25, '2026-04-01 10:00:00', '2026-04-01 11:45:00'),
(26, '2026-04-05 13:00:00', '2026-04-05 14:00:00'),
(27, '2026-04-10 17:00:00', '2026-04-10 18:15:00'),
(28, '2026-04-15 20:00:00', '2026-04-15 21:00:00'),
(29, '2026-04-20 09:00:00', '2026-04-20 10:00:00');


-- MATCHGAME (30 rows)
-- score = total money accumulated during the run
-- (money += floor(enemy_value / 2) per enemy defeated with a weapon)

INSERT INTO MatchGame (idPlayer, idDeck, score, result, startDate, endDate) VALUES
(2,  1, 48,  'victory',     '2026-01-05 10:05:00', '2026-01-05 10:42:00'),
(3,  1, 72,  'victory',     '2026-01-05 11:05:00', '2026-01-05 11:58:00'),
(4,  1, 15,  'defeat',      '2026-01-06 09:32:00', '2026-01-06 09:55:00'),
(5,  1, 30,  'victory',     '2026-01-07 14:03:00', '2026-01-07 14:50:00'),
(6,  1, 0,   'defeat',      '2026-01-08 18:02:00', '2026-01-08 18:20:00'),
(7,  1, 20,  'defeat',      '2026-01-10 20:05:00', '2026-01-10 20:25:00'),
(8,  1, 95,  'victory',     '2026-01-12 16:05:00', '2026-01-12 17:10:00'),
(9,  1, 60,  'victory',     '2026-01-14 08:05:00', '2026-01-14 08:55:00'),
(10, 1, 110, 'victory',     '2026-01-15 21:05:00', '2026-01-15 22:35:00'),
(11, 1, 8,   'defeat',      '2026-01-18 13:05:00', '2026-01-18 13:20:00'),
(2,  2, 130, 'victory',     '2026-02-01 10:05:00', '2026-02-01 11:25:00'),
(12, 1, 45,  'victory',     '2026-02-03 15:05:00', '2026-02-03 15:55:00'),
(13, 1, 0,   'defeat',      '2026-02-05 19:05:00', '2026-02-05 19:25:00'),
(14, 1, 55,  'victory',     '2026-02-08 10:05:00', '2026-02-08 10:40:00'),
(15, 1, 80,  'victory',     '2026-02-10 22:05:00', '2026-02-10 22:55:00'),
(16, 1, 12,  'defeat',      '2026-02-12 09:05:00', '2026-02-12 09:35:00'),
(17, 1, 165, 'victory',     '2026-02-15 17:05:00', '2026-02-15 18:15:00'),
(18, 1, 200, 'victory',     '2026-02-20 11:05:00', '2026-02-20 12:25:00'),
(19, 1, 35,  'defeat',      '2026-03-01 14:05:00', '2026-03-01 14:50:00'),
(20, 1, 70,  'victory',     '2026-03-03 20:05:00', '2026-03-03 21:05:00'),
(3,  1, 145, 'victory',     '2026-03-05 10:05:00', '2026-03-05 10:55:00'),
(21, 1, 50,  'victory',     '2026-03-08 16:05:00', '2026-03-08 17:25:00'),
(22, 1, 5,   'defeat',      '2026-03-10 19:05:00', '2026-03-10 19:45:00'),
(23, 1, 90,  'victory',     '2026-03-15 08:05:00', '2026-03-15 08:55:00'),
(24, 1, 25,  'defeat',      '2026-03-18 21:05:00', '2026-03-18 21:40:00'),
(25, 1, 175, 'victory',     '2026-04-01 10:05:00', '2026-04-01 11:40:00'),
(26, 1, 40,  'victory',     '2026-04-05 13:05:00', '2026-04-05 13:55:00'),
(27, 1, 60,  'defeat',      '2026-04-10 17:05:00', '2026-04-10 18:10:00'),
(28, 1, 15,  'victory',     '2026-04-15 20:05:00', '2026-04-15 21:05:00'),
(29, 1, 0,   'defeat',      '2026-04-20 09:05:00', '2026-04-20 10:00:00');




-- PLAYERLOOTBOX (30 rows)
-- Records each lootbox a player has opened

INSERT INTO PlayerLootbox (idPlayer, idLootbox, openingDate) VALUES
(2,  1, '2026-01-10 12:00:00'),
(2,  3, '2026-01-20 14:00:00'),
(3,  1, '2026-01-12 09:00:00'),
(3,  5, '2026-02-01 10:00:00'),
(4,  1, '2026-01-15 15:00:00'),
(5,  2, '2026-01-18 11:00:00'),
(6,  1, '2026-01-20 16:00:00'),
(7,  1, '2026-01-22 18:00:00'),
(8,  3, '2026-01-25 20:00:00'),
(8,  5, '2026-02-05 10:00:00'),
(8,  7, '2026-02-15 13:00:00'),
(9,  2, '2026-01-28 09:00:00'),
(9,  4, '2026-02-10 15:00:00'),
(10, 3, '2026-02-01 11:00:00'),
(10, 5, '2026-02-12 14:00:00'),
(10, 9, '2026-03-01 10:00:00'),
(11, 1, '2026-02-03 16:00:00'),
(12, 2, '2026-02-06 12:00:00'),
(13, 1, '2026-02-08 17:00:00'),
(14, 4, '2026-02-11 09:00:00'),
(15, 3, '2026-02-14 14:00:00'),
(15, 7, '2026-03-05 11:00:00'),
(16, 1, '2026-02-18 16:00:00'),
(17, 5, '2026-02-22 10:00:00'),
(17, 9, '2026-03-10 13:00:00'),
(18, 9, '2026-03-01 12:00:00'),
(18, 10,'2026-03-15 15:00:00'),
(19, 2, '2026-03-08 09:00:00'),
(20, 4, '2026-03-12 14:00:00'),
(21, 1, '2026-03-20 11:00:00');



-- CARDINDECKK  base Deck (idDeck 1) holds all 38 base cards
-- Plus small samples for two additional decks

INSERT INTO CardInDeck (idCard, idDeck) VALUES
-- Base Deck (id 1)  all 38 Scoundrel starting cards
(1,  1), (2,  1), (3,  1), (4,  1), (5,  1),
(6,  1), (7,  1), (8,  1), (9,  1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1),
(16, 1), (17, 1), (18, 1), (19, 1), (20, 1),
(21, 1), (22, 1), (23, 1), (24, 1), (25, 1),
(26, 1), (27, 1), (28, 1), (29, 1), (30, 1),
(31, 1), (32, 1), (33, 1), (34, 1), (35, 1),
(36, 1), (37, 1), (38, 1),
-- Aggressive Deck (id 2)  extra high-value weapons + all enemies
(8,  2), (9,  2), (10, 2), (39, 2), (40, 2),
(11, 2), (12, 2), (13, 2), (14, 2), (15, 2),
(16, 2), (17, 2), (18, 2), (19, 2),
(20, 2), (21, 2), (22, 2), (23, 2), (24, 2),
-- Healing Focus Deck (id 7)  all hearts plus mid-range weapons
(29, 7), (30, 7), (31, 7), (32, 7), (33, 7),
(34, 7), (35, 7), (36, 7), (37, 7), (38, 7),
(4,  7), (5,  7), (6,  7), (7,  7);



INSERT INTO CardEffect (idCard, idEffect) VALUES
(39, 2),   -- Diamond 11  enemieslos       (50 % weight in poolAbilities)
(40, 3),   -- Diamond 12  killhealth        (30 % weight in poolAbilities)
(41, 4),   -- Diamond 13  passEnemie        (20 % weight in poolAbilities)
(42, 5),   -- Diamond 14  healthpassEnemie  (future / rare)
(43, 2),   -- Diamond 15  enemieslos
(44, 3);   -- Diamond 16  killhealth



-- REWARDCARD (25 rows)
-- Cards available as lootbox rewards, grouped by quality tier.
-- Higher quality = rarer / more valuable card.

INSERT INTO RewardCard (idCard, quality) VALUES
-- Quality 1 (common) low-value base cards
(1,  1), (11, 1), (20, 1), (29, 1), (30, 1),
-- Quality 2 (uncommon) mid-value base cards
(5,  2), (6,  2), (15, 2), (24, 2), (33, 2), (34, 2),
-- Quality 3 (rare) high-value base cards
(8,  3), (9,  3), (18, 3), (27, 3), (37, 3),
-- Quality 4 (epic) pool-only special weapon cards
(39, 4), (40, 4), (41, 4),
-- Quality 5 (legendary) strongest pool cards and elite enemies
(42, 5), (43, 5), (44, 5), (47, 5), (48, 5), (49, 5);



-- REWARDUPGRADE (8 rows)
-- Effects that can be granted to a player's card as an upgrade reward.
-- Quality reflects rarity of receiving that upgrade.

INSERT INTO RewardUpgrade (idEffect, quality) VALUES
(2, 2),   -- enemieslos       uncommon upgrade
(2, 3),   -- enemieslos       rare version (higher quality lootbox)
(3, 3),   -- killhealth       rare upgrade
(3, 4),   -- killhealth       epic version
(4, 3),   -- passEnemie       rare upgrade
(4, 4),   -- passEnemie       epic version
(5, 4),   -- healthpassEnemie  epic upgrade
(5, 5);   -- healthpassEnemie  legendary version



