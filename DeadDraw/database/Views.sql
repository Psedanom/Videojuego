/* this view is used to get the cards that are in the maze, it is used to get the cards that are in the maze and their values, it is used to get the cards that are in the maze and their values and their deck id
*/
CREATE view card_in_maze AS
SELECT idCard, value,idDeck from Card INNER JOIN CardInDeck USING(idCard);

CREATE view card_effects AS
SELECT idCard,suit,name  FROM Card INNER JOIN CardEffect USING(idCard) INNER JOIN Effect USING(idEffect) ORDER BY idCard;

CREATE view deck_cards AS
SELECT name, COUNT(`idCard`) from deck INNER JOIN CardInDeck USING(idDeck) INNER JOIN Card USING(idCard) group by idDeck;

CREATE VIEW player_decks_info AS
SELECT username, e.name, suit,d.name as deckName
FROM player
INNER JOIN matchgame USING (idPlayer)
INNER JOIN Deck d USING (idDeck)
INNER JOIN cardindeck USING (idDeck)
INNER JOIN card USING (idCard)
INNER JOIN cardeffect USING (idCard)
INNER JOIN effect e USING (idEffect)
WHERE e.name != 'noeffect'
ORDER BY idDeck DESC;

create view player_score AS
SELECT username, score FROM player INNER JOIN matchgame USING(idPlayer) ORDER BY score DESC;

CREATE View player_lootboxes AS
SELECT username, idLootbox, cost,quality,openingDate FROM player INNER JOIN playerlootbox USING(idPlayer) INNER JOIN lootbox USING (idLootbox) ORDER BY openingDate DESC;

CREATE view player_rewards AS